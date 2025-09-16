import { useEffect, useRef, useState } from "react";
import s from "./style.module.css";

interface Props {
  value: number;
}

export const PriceCell: React.FC<Props> = ({ value }) => {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevValue = useRef<number>(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      if (value > prevValue.current) setFlash("up");
      if (value < prevValue.current) setFlash("down");

      prevValue.current = value;

      const timeout = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <span
      className={`${s.price} ${flash === "up" ? s.flashUp : ""} ${
        flash === "down" ? s.flashDown : ""
      }`}
    >
      {Number(value.toFixed(6))}
    </span>
  );
};
