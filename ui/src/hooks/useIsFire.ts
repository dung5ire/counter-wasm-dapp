import { useState, useEffect } from "react"

const useIsFire = () => {
  const [isFire, setIsFire] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fire !== 'undefined') {
      setIsFire(true)
    }
  }, [])

  return {
    isFire,
    setIsFire
  }
}

export default useIsFire