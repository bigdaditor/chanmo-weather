"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./input.module.css";

export default function InputPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weather, setWeather] = useState({ condition: "맑음", temperature: "20°C" });
  const [salesData, setSalesData] = useState({
    cash: "",
    card: "",
    onnuri: "",
    delivery: "",
    other: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 날씨 정보 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?date=${date}`);
        if (response.ok) {
          const weatherData = await response.json();
          setWeather(weatherData);
        }
      } catch (error) {
        console.error("날씨 정보를 가져오는데 실패했습니다:", error);
      }
    };

    fetchWeather();
  }, [date]);

  // 페이지를 벗어날 때 입력값 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지 새로고침이나 브라우저 닫기 시 초기화
      resetForm();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 컴포넌트 언마운트 시 초기화
      resetForm();
    };
  }, []);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSalesChange = (field, value) => {
    setSalesData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const totalAmount = Object.values(salesData).reduce((sum, value) => {
        return sum + (parseInt(value) || 0);
      }, 0);

      if (totalAmount === 0) {
        setMessage("최소 하나의 매출 항목을 입력해주세요.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          weather: weather.condition,
          temperature: weather.temperature,
          sales: salesData,
          total: totalAmount
        }),
      });

      if (response.ok) {
        setMessage("매출이 성공적으로 저장되었습니다!");
        // 폼 초기화
        resetForm();
        // 2초 후 메인화면으로 이동
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setMessage("네트워크 오류가 발생했습니다.");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSalesData({
      cash: "",
      card: "",
      onnuri: "",
      delivery: "",
      other: ""
    });
    setMessage("");
  };

  const clearForm = () => {
    resetForm();
  };

  const goToMain = () => {
    // 메인화면으로 이동하면서 입력값 초기화
    resetForm();
    router.push('/');
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "맑음": return "☀️";
      case "흐림": return "☁️";
      case "비": return "🌧️";
      case "눈": return "❄️";
      default: return "🌤️";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={goToMain} className={styles.backButton}>
            ← 메인으로
          </button>
        </div>
        <div className={styles.headerCenter}>
          <h1>매출 입력</h1>
          <p>반찬가게 매출을 입력하고 날씨 정보와 함께 저장하세요</p>
        </div>
        <div className={styles.headerRight}>
          {/* 우측 여백을 위한 빈 div */}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 날짜 및 날씨 정보 */}
        <div className={styles.dateWeatherSection}>
          <div className={styles.dateInput}>
            <label htmlFor="date">날짜</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={handleDateChange}
              required
            />
          </div>
          
          <div className={styles.weatherInfo}>
            <div className={styles.weatherIcon}>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className={styles.weatherDetails}>
              <span className={styles.weatherCondition}>{weather.condition}</span>
              <span className={styles.temperature}>{weather.temperature}</span>
            </div>
          </div>
        </div>

        {/* 매출 입력 섹션 */}
        <div className={styles.salesSection}>
          <h2>매출 입력</h2>
          
          <div className={styles.salesGrid}>
            <div className={styles.salesItem}>
              <label htmlFor="cash">현금 매출</label>
              <input
                id="cash"
                type="number"
                value={salesData.cash}
                onChange={(e) => handleSalesChange("cash", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className={styles.salesItem}>
              <label htmlFor="card">카드 매출</label>
              <input
                id="card"
                type="number"
                value={salesData.card}
                onChange={(e) => handleSalesChange("card", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className={styles.salesItem}>
              <label htmlFor="onnuri">온누리상품권</label>
              <input
                id="onnuri"
                type="number"
                value={salesData.onnuri}
                onChange={(e) => handleSalesChange("onnuri", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className={styles.salesItem}>
              <label htmlFor="delivery">배달 매출</label>
              <input
                id="delivery"
                type="number"
                value={salesData.delivery}
                onChange={(e) => handleSalesChange("delivery", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className={styles.salesItem}>
              <label htmlFor="other">기타 매출</label>
              <input
                id="other"
                type="number"
                value={salesData.other}
                onChange={(e) => handleSalesChange("other", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* 총 매출 표시 */}
          <div className={styles.totalSection}>
            <div className={styles.totalAmount}>
              <span>총 매출:</span>
              <span className={styles.totalValue}>
                {Object.values(salesData).reduce((sum, value) => sum + (parseInt(value) || 0), 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className={`${styles.message} ${message.includes("성공") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        {/* 버튼 섹션 */}
        <div className={styles.buttonSection}>
          <button
            type="button"
            onClick={clearForm}
            className={styles.clearButton}
            disabled={isLoading}
          >
            초기화
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "매출 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
