import React from "react";
import s from "./style.module.css";

interface Props {
  value: string;
}

export const ExchangeCell: React.FC<Props> = ({ value }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      console.log("Copied:", value);
    });
  };
  return (
    <span
      onClick={handleCopy}
      title={`${value} (click to copy)`}
      className={s.cell}
    >
      {value}
    </span>
  );
};
