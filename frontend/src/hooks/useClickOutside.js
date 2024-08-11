import { useRef, useEffect } from "react";

export default function useOutsideAlerter(callbackFn) {
  let domNodeRef = useRef();

  useEffect(() => {
    let handler = (event) => {
      if (!domNodeRef.current?.contains(event.target)) {
        callbackFn();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return domNodeRef;
}
