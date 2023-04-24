import { Center, Stack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

import { ControlsModal } from './components/controls-modal'
import { GameBoard } from './components/game-board'
import { Menu } from './components/menu'
import { ScoresModal } from './components/scores-modal'
import { useLocalStorage } from './hooks/use-local-storage'

function App() {
  const [showControls, setShowControls] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [scores, setScores] = useLocalStorage<number[]>('scores', [])

  const toggleShowControls = useCallback(
    () => setShowControls(prev => !prev),
    []
  )
  const toggleShowScore = useCallback(() => setShowScore(prev => !prev), [])

  const handleGameOver = useCallback(
    (score: number) => {
      setScores(prev =>
        Array.from(new Set([...prev, score].sort((a, b) => b - a).slice(0, 10)))
      )
    },
    [setScores]
  )

  return (
    <>
      <Center minH='100vh'>
        <Stack>
          <GameBoard onGameOver={handleGameOver} />
          <Menu
            onShowControls={toggleShowControls}
            onShowScore={toggleShowScore}
          />
        </Stack>
      </Center>
      <ControlsModal
        isCentered
        isOpen={showControls}
        onClose={toggleShowControls}
      />
      <ScoresModal
        isOpen={showScore}
        onClose={toggleShowScore}
        scores={scores}
      />
    </>
  )
}

export default App
