/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface Position {
  x: number
  y: number
}
export type Direction = 'up' | 'down' | 'left' | 'right'
export interface GameBoardProps {
  onGameOver: (score: number) => void
}

const WIDTH = 800
const HEIGHT = 400
const SIZE = 20
const DELAY = 100
const BOARD_BACKGROUND = '#eee'
const SNAKE_COLOR = '#D21312'
const FOOD_COLOR = '#41644A'
const SCORE_PER_FOOD = 10
const INITIAL_SNAKE: Position[] = [
  {
    x: SIZE,
    y: SIZE,
  },
  {
    x: SIZE * 2,
    y: SIZE,
  },
  {
    x: SIZE * 3,
    y: SIZE,
  },
]

// generate a random position on the canvas that is a multiple of the size of the snake
const randomPosition = (): Position => {
  const rand = (max: number) =>
    Math.floor(Math.floor(Math.random() * (max + SIZE)) / SIZE) * SIZE
  return {
    x: rand(WIDTH - SIZE),
    y: rand(HEIGHT - SIZE),
  }
}
export function GameBoard({ onGameOver }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [snake, setSnake] = useState<Position[]>(() => INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [food, setFood] = useState<Position>(() => randomPosition())

  // calculate the score based on the snake and the food eaten
  const score = useMemo<number>(() => {
    const initialSnakeLength = INITIAL_SNAKE.length
    const currentSnakeLength = snake.length
    const totalFoodEaten = currentSnakeLength - initialSnakeLength
    return totalFoodEaten * SCORE_PER_FOOD
  }, [snake.length])

  // calculate the speed of the snake based on the length of the snake
  // increase the speed by 2 for every food eaten
  const snakeSpeed = useMemo<number>(() => {
    const speed = DELAY - snake.length * 2
    return speed < 10 ? 10 : speed
  }, [snake.length])

  const clearCanvas = useCallback(() => {
    if (context !== null) {
      context.fillStyle = BOARD_BACKGROUND
      context.fillRect(0, 0, WIDTH, HEIGHT)
    }
  }, [context])

  const drawObject = useCallback(
    (positions: Position[], fillColor: string) => {
      positions.forEach(position => {
        if (context !== null) {
          context.fillStyle = fillColor
          context.fillRect(position.x, position.y, SIZE, SIZE)
        }
      })
    },
    [context]
  )
  // check whether the snake has eaten the food or not
  const hasSnakeEatenFood = useCallback((): boolean => {
    const { x, y } = snake[0]
    return food.x === x && food.y === y
  }, [food, snake])

  // check whether moving the snake in the given direction is allowed or not
  const isMoveAllowed = useCallback(
    (moveDirection: Direction) => {
      if (direction === null) return true
      const isOppositeDirection =
        (direction === 'up' && moveDirection === 'down') ||
        (direction === 'down' && moveDirection === 'up') ||
        (direction === 'left' && moveDirection === 'right') ||
        (direction === 'right' && moveDirection === 'left')
      return !isOppositeDirection
    },
    [direction]
  )
  // check whether the snake has collided with the wall or itself
  const hasSnakeCollided = useCallback((): boolean => {
    const { x, y } = snake[0]
    const hasCollidedWithWall = x <= 0 || x >= WIDTH || y <= 0 || y >= HEIGHT
    const hasCollidedWithItself = snake.some(
      (position, index) =>
        INITIAL_SNAKE.length !== snake.length &&
        index !== 0 &&
        position.x === x &&
        position.y === y
    )
    return hasCollidedWithWall || hasCollidedWithItself
  }, [snake])

  // update the snake body by adding or removing a position
  const updateSnakeBody = useCallback(
    (dx: number, dy: number, mode: 'update' | 'add') => {
      const { x, y } = snake[0]
      const newSnake = [...snake]
      const newHead: Position = { x: x + dx, y: y + dy }
      newSnake.unshift(newHead)
      if (mode === 'update') {
        newSnake.pop()
      }
      setSnake(newSnake)
    },
    [snake]
  )

  const moveSnake = useCallback(
    (moveDirection: Direction) => {
      const dx =
        moveDirection === 'left' ? -SIZE : moveDirection === 'right' ? SIZE : 0
      const dy =
        moveDirection === 'up' ? -SIZE : moveDirection === 'down' ? SIZE : 0

      if (!isMoveAllowed(moveDirection)) return
      if (hasSnakeCollided()) {
        setSnake(INITIAL_SNAKE)
        setFood(randomPosition())
        setDirection(null)
        onGameOver(score)
        return
      }
      if (hasSnakeEatenFood()) {
        updateSnakeBody(dx, dy, 'add')
        setFood(randomPosition())
        setDirection(moveDirection)
        return
      }
      updateSnakeBody(dx, dy, 'update')
      setDirection(moveDirection)
    },
    [
      hasSnakeCollided,
      hasSnakeEatenFood,
      isMoveAllowed,
      onGameOver,
      score,
      updateSnakeBody,
    ]
  )

  const runGame = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault()
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          moveSnake('up')
          break
        case 'ArrowDown':
        case 's':
          moveSnake('down')
          break
        case 'ArrowLeft':
        case 'a':
          moveSnake('left')
          break
        case 'ArrowRight':
        case 'd':
          moveSnake('right')
          break
        default:
          break
      }
    },
    [moveSnake]
  )

  useEffect(() => {
    // store the reference of the canvas 2d context in the state
    const canvas = canvasRef.current
    if (canvas !== null) {
      setContext(canvas.getContext('2d'))
    }
  }, [])

  // draw the snake and the food on the canvas
  useEffect(() => {
    clearCanvas()
    drawObject(snake, SNAKE_COLOR)
    drawObject([food], FOOD_COLOR)
  }, [clearCanvas, drawObject, food, snake])

  // add the event listener to the document for moving the snake
  useEffect(() => {
    window.addEventListener('keydown', runGame)
    return () => window.removeEventListener('keydown', runGame)
  }, [runGame])

  // automatically move the snake in the given direction
  useEffect(() => {
    const id = setInterval(() => {
      if (direction !== null) moveSnake(direction)
    }, snakeSpeed)
    return () => clearInterval(id)
  }, [direction, moveSnake, snake.length, snakeSpeed])

  return (
    <canvas
      ref={canvasRef}
      className='rounded-md shadow-md'
      height={HEIGHT}
      width={WIDTH}
    />
  )
}
