import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(targetValue, duration = 800, decimals = 2) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = startValueRef.current;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * eased;

      setDisplayValue(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        startValueRef.current = targetValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, decimals]);

  return displayValue;
}
