"use client";

import { RefObject, useEffect, useCallback } from "react";

interface ClickRecognitionProps {
  onOutsideClick: () => void;
  containerRef: RefObject<HTMLElement>;
  enabled?: boolean;
}

export default function useClickRecognition({ onOutsideClick, containerRef, enabled = true }: ClickRecognitionProps) {
  const handleOutsideClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!containerRef?.current || !event.target) return;

      const isOutside = !containerRef.current.contains(event.target as Node);
      if (isOutside) {
        onOutsideClick();
      }
    },
    [containerRef, onOutsideClick]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [enabled, handleOutsideClick]);
}
