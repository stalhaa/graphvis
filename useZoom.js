// libs
import { useEffect, useState } from 'react'

export default function useZoom(initialZoom: number = 1) {
  const [zoom, setZoom] = useState(initialZoom)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.defaultPrevented) {
        return
      }
      if (event.keyCode !== undefined) {
        const { keyCode } = event

        if (keyCode === 107 || keyCode === 187) {
          setZoom(zoom => zoom * 1.1)
        } else if (keyCode === 109 || keyCode === 173 || keyCode === 189) {
          setZoom(zoom => zoom / 1.1)
        }
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown, false)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [])

  return zoom
}
