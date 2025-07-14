"use client";

import styles from "../input.module.css";

export default function ButtonSection({ 
  isLoading, 
  onClearForm, 
  onSubmit 
}) {
  return (
    <div className={styles.buttonSection}>
      <button
        type="button"
        onClick={onClearForm}
        className={styles.clearButton}
        disabled={isLoading}
      >
        초기화
      </button>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoading}
        onClick={onSubmit}
      >
        {isLoading ? "저장 중..." : "매출 저장"}
      </button>
    </div>
  );
} 
 