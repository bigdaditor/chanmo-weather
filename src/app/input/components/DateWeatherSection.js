"use client";

import styles from "../input.module.css";

export default function DateWeatherSection({ 
  date, 
  onDateChange, 
  weather, 
  weatherLoading 
}) {
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "맑음": return "☀️";
      case "구름조금": return "🌤️";
      case "구름많음": return "⛅";
      case "흐림": return "☁️";
      case "비": return "🌧️";
      case "비/눈": return "🌨️";
      case "눈": return "❄️";
      case "눈/비": return "🌨️";
      default: return "🌤️";
    }
  };

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
      
      <div className={styles.weatherInfo}>
        {weatherLoading ? (
          <div className={styles.weatherLoading}>
            <div className={styles.loadingSpinner}></div>
            <span>날씨 정보 로딩 중...</span>
          </div>
        ) : (
          <>
            <div className={styles.weatherIcon}>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className={styles.weatherDetails}>
              <span className={styles.weatherCondition}>{weather.condition}</span>
              <span className={styles.temperature}>{weather.temperature}</span>
              {weather.precipitation !== "없음" && (
                <span className={styles.precipitation}>
                  {weather.precipitation} ({weather.probability}%)
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 