import { useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function ScrambleText({ text, className, as: Tag = "span" }) {
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef(null);

  const scramble = () => {
    let iteration = 0;
    const totalIterations = 12;
    clearTimeout(timeoutRef.current);

    const run = () => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration < totalIterations) {
        iteration += 1;
        timeoutRef.current = setTimeout(run, 30);
      } else {
        setDisplay(text);
      }
    };

    run();
  };

  const reset = () => {
    clearTimeout(timeoutRef.current);
    setDisplay(text);
  };

  return (
    <Tag className={className} onMouseEnter={scramble} onMouseLeave={reset}>
      {display}
    </Tag>
  );
}
