"use client";

import styles from "../input.module.css";

export default function Header({ onGoToMain }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={onGoToMain} className={styles.backButton}>
          ← 메인으로
        </button>
      </div>
      <div className={styles.headerCenter}>
        <h1>매출 입력</h1>
      </div>
      <div className={styles.headerRight}>
        {/* 우측 여백을 위한 빈 div */}
      </div>
    </div>
  );
} 