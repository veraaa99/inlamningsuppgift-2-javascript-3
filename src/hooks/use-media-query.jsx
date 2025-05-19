import { useEffect, useState } from "react";

export function useMediaQuery(query) {
    const [value, setValue] = useState(false)

    useEffect(() => {
      const onChange = (e) => {
        setValue(e.matches)
      }

      const result = matchMedia(query)
      result.addEventListener("change", onChange)
      setValue(result.matches)

      return () => result.removeEventListener("change", onChange)
    }, [query])
    
    return value
}