"use client";

import styles from "../input.module.css";

export default function MessageDisplay({ message }) {
  if (!message) return null;

  return (
    <div className={`${styles.message} ${message.includes("성공") ? styles.success : styles.error}`}>
      {message}
    </div>
  );
} 