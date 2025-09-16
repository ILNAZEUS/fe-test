import React from "react";
import s from "./style.module.css";

interface Props {
  mintable: boolean;
  freezable: boolean;
  honeypot: boolean;
  contractVerified: boolean;
}

export const AuditCell: React.FC<Props> = ({
  contractVerified,
  freezable,
  honeypot,
  mintable,
}) => {
  return (
    <>
      {contractVerified && (
        <div className={s.item}>
          <span>✅</span>
          <span>Verified</span>
        </div>
      )}

      {mintable && (
        <div className={s.item}>
          <span>✅</span>
          <span>Mintable</span>
        </div>
      )}

      {freezable && (
        <div className={s.item}>
          <span>✅</span>
          <span>Freezable</span>
        </div>
      )}

      {honeypot && (
        <div className={s.item}>
          <span>✅</span>
          <span>Honeypot</span>
        </div>
      )}
    </>
  );
};
