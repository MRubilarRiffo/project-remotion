import React from "react";
import styles from "./LetterHint.module.css";

export const LetterHint = ({ hint }) => {
  // hint e.g., "C_N__A"
  const letters = hint.split("");

  return (
    <div className={styles.container}>
      {letters.map((char, index) => {
        const isKnown = char !== "_";
        return (
          <div
            key={index}
            className={isKnown ? styles.knownBox : styles.unknownBox}
          >
            {isKnown ? char : ""}
          </div>
        );
      })}
    </div>
  );
};
