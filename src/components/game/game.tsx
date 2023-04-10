import { useEffect, useRef } from 'react'

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null) return
  }, [])
  return <canvas className='min-h-screen bg-grass bg-cover' ref={canvasRef}></canvas>
}
