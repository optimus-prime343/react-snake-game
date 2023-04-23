import { Center, Stack } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

import { ControlsModal } from './components/controls-modal'
import { GameBoard } from './components/game-board'
import { Menu } from './components/menu'

function App() {
  const [showControls, setShowControls] = useState(false)
  const [showScore, setShowScore] = useState(false)

  const toggleShowControls = useCallback(
    () => setShowControls(prev => !prev),
    []
  )
  const toggleShowScore = useCallback(() => setShowScore(prev => !prev), [])

  return (
    <>
      <Center minH='100vh'>
        <Stack>
          <GameBoard onGameOver={console.error} />
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
    </>
  )
}

export default App
