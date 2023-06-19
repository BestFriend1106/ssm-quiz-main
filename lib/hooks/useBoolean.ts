import { useState, useCallback } from 'react'

export function useBoolean(defaultValue: boolean) {
  const [booleanValue, setBooleanValue] = useState(defaultValue)

  const toggle = useCallback(() => {
    setBooleanValue((prev) => !prev)
  }, [setBooleanValue])

  const setFalse = useCallback(() => {
    setBooleanValue(false)
  }, [setBooleanValue])

  const setTrue = useCallback(() => {
    setBooleanValue(true)
  }, [setBooleanValue])

  const setValue = useCallback(
    (newValue: boolean) => {
      setBooleanValue(newValue)
    },
    [setBooleanValue]
  )
  return { state: booleanValue, setTrue, setFalse, toggle, setValue }
}
