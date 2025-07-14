"use client";

import styles from "../input.module.css";

export default function DateSection({
  date,
  onDateChange
}) {
  return (
    <div className={styles.dateWeatherSection}>
      <div className={styles.dateInput}>
        <label htmlFor="date">날짜</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={onDateChange}
          required
        />
      </div>
    </div>
  );
}