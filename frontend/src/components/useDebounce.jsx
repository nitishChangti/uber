// hooks/useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            console.log(debouncedValue)
            setDebouncedValue(value);
        }, delay);

        // cleanup if value changes before delay
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
