import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") {
        return;
      }
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
