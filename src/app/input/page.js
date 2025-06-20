"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./input.module.css";

export default function InputPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weather, setWeather] = useState({ condition: "맑음", temperature: "20°C" });
  const [salesRows, setSalesRows] = useState([
    { id: 1, paymentType: "", amount: "" }
  ]);
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

  const handleSalesChange = (id, field, value) => {
    setSalesRows(prev => 
      prev.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    const newId = Math.max(...salesRows.map(row => row.id), 0) + 1;
    setSalesRows(prev => [...prev, { id: newId, paymentType: "", amount: "" }]);
  };

  const removeRow = (id) => {
    if (salesRows.length > 1) {
      setSalesRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 유효한 데이터만 필터링
      const validRows = salesRows.filter(row => 
        row.paymentType && row.amount && parseInt(row.amount) > 0
      );

      if (validRows.length === 0) {
        setMessage("최소 하나의 매출 항목을 입력해주세요.");
        setIsLoading(false);
        return;
      }

      // 매출 데이터를 API 형식으로 변환
      const salesData = {};
      validRows.forEach(row => {
        const type = row.paymentType;
        const amount = parseInt(row.amount);
        if (!salesData[type]) {
          salesData[type] = 0;
        }
        salesData[type] += amount;
      });

      const totalAmount = Object.values(salesData).reduce((sum, value) => sum + value, 0);

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
    setSalesRows([{ id: 1, paymentType: "", amount: "" }]);
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

  const getTotalAmount = () => {
    return salesRows
      .filter(row => row.paymentType && row.amount && parseInt(row.amount) > 0)
      .reduce((sum, row) => sum + parseInt(row.amount), 0);
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
          <div className={styles.salesHeader}>
            <h2>매출 입력</h2>
            <button 
              type="button" 
              onClick={addRow} 
              className={styles.addRowButton}
            >
              + 행 추가
            </button>
          </div>
          
          <div className={styles.salesTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerPaymentType}>매출처</div>
              <div className={styles.headerAmount}>금액</div>
              <div className={styles.headerAction}>삭제</div>
            </div>
            
            {salesRows.map((row) => (
              <div key={row.id} className={styles.salesRow}>
                <div className={styles.paymentTypeCell}>
                  <select
                    value={row.paymentType}
                    onChange={(e) => handleSalesChange(row.id, "paymentType", e.target.value)}
                    required
                    className={styles.paymentTypeSelect}
                  >
                    <option value="">매출처 선택</option>
                    <option value="cash">현금</option>
                    <option value="card">카드</option>
                    <option value="onnuri">온누리상품권</option>
                    <option value="delivery">배달</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                
                <div className={styles.amountCell}>
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) => handleSalesChange(row.id, "amount", e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                    className={styles.amountInput}
                  />
                </div>
                
                <div className={styles.actionCell}>
                  {salesRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className={styles.removeButton}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 총 매출 표시 */}
          <div className={styles.totalSection}>
            <div className={styles.totalAmount}>
              <span>총 매출:</span>
              <span className={styles.totalValue}>
                {getTotalAmount().toLocaleString()}원
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
