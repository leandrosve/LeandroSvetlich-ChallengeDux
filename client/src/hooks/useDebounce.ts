import { useEffect, useRef, useState } from "react";

/**
 * Pequeño hook para manejar valores debounced
 */
export function useDebounce<T>(
  value: T,
  delay: number
): [T, (value: T) => void] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // Ignorar la primera vez
    }

    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
}
