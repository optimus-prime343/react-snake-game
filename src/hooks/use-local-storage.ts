import { useState } from 'react'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((prevValue: T) => T)) => {
    const newValue = value instanceof Function ? value(storedValue) : value
    setStoredValue(newValue)
    window.localStorage.setItem(key, JSON.stringify(newValue))
  }
  return [storedValue, setValue] as const
}
