import { useEffect, useRef } from 'react'

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas !== null) {
      console.error('canvas', canvas)
    }
  }, [])
  return <canvas className='min-h-screen bg-grass bg-cover' ref={canvasRef} />
}
