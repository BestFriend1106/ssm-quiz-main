import { useState, useEffect } from 'react'
import useWindowSize from './useWindowSize'

export const useTextInEllipsis = <T extends HTMLElement>() => {
  const [textEl, setTextEl] = useState<T | null>(null)
  const [hasEllipsis, setHasEllipsis] = useState(false)
  const [forceRerender, setForceRerender] = useState(false)
  const windowSize = useWindowSize()

  const updateEllipsisState = () => {
    if (!textEl) {
      setHasEllipsis(false)
      return
    }

    const isTitleOverflowing = textEl.offsetWidth < textEl.scrollWidth
    setHasEllipsis(isTitleOverflowing)
  }

  // Avoids issues with sizing updates during transitions
  useEffect(() => {
    setTimeout(() => {
      setForceRerender(true)
    }, 500)
  }, [])

  useEffect(() => {
    updateEllipsisState()
  }, [textEl, windowSize, forceRerender])

  return { textEl, textRef: setTextEl, hasEllipsis }
}
