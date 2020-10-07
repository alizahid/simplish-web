import { useEffect, useRef } from 'react'

export const usePageTitle = (title: string): void => {
  const previous = useRef<string>()

  useEffect(() => {
    previous.current = document.title

    document.title = title

    return () => {
      if (previous.current) {
        document.title = previous.current
      }
    }
  }, [title])
}
