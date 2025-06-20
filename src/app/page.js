"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch("/api/sales");
      if (response.ok) {
        const data = await response.json();
        setSalesData(data);
      }
    } catch (error) {
      console.error("매출 데이터를 가져오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 범위 내의 데이터만 필터링
  const getFilteredData = () => {
    return salesData.filter(sale => {
      const saleDate = sale.input_date;
      return saleDate >= dateRange.startDate && saleDate <= dateRange.endDate;
    });
  };

  // 날짜별로 그룹화된 매출 데이터
  const getGroupedSales = () => {
    const filteredData = getFilteredData();
    const grouped = {};
    filteredData.forEach(sale => {
      if (!grouped[sale.input_date]) {
        grouped[sale.input_date] = {
          date: sale.input_date,
          weather: sale.weather,
          total: 0,
          items: []
        };
      }
      grouped[sale.input_date].total += sale.amount;
      grouped[sale.input_date].items.push(sale);
    });
    return Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getTotalSales = () => {
    const filteredData = getFilteredData();
    return filteredData.reduce((total, item) => total + item.amount, 0);
  };

  const getRecentSales = () => {
    return getGroupedSales().slice(0, 5);
  };

  const getWeatherStats = () => {
    const weatherStats = {};
    const groupedSales = getGroupedSales();
    groupedSales.forEach(group => {
      const weather = group.weather || "맑음";
      if (!weatherStats[weather]) {
        weatherStats[weather] = { count: 0, total: 0 };
      }
      weatherStats[weather].count += 1;
      weatherStats[weather].total += group.total;
    });
    return weatherStats;
  };

  const getPaymentTypeStats = () => {
    const typeStats = {};
    const filteredData = getFilteredData();
    filteredData.forEach(sale => {
      const type = sale.payment_type;
      if (!typeStats[type]) {
        typeStats[type] = { count: 0, total: 0 };
      }
      typeStats[type].count += 1;
      typeStats[type].total += sale.amount;
    });
    return typeStats;
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

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetDateRange = () => {
    setDateRange({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10)
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  const groupedSales = getGroupedSales();
  const totalSales = getTotalSales();
  const recentSales = getRecentSales();
  const weatherStats = getWeatherStats();
  const paymentStats = getPaymentTypeStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📊</span>
          찬모날씨 대시보드
        </h1>
        <Link href="/input" className={styles.addButton}>
          + 매출 입력
        </Link>
      </div>

      {/* 날짜 범위 선택 */}
      <div className={styles.dateRangeSection}>
        <div className={styles.dateRangeHeader}>
          <h2>조회 기간</h2>
          <button onClick={resetDateRange} className={styles.resetButton}>
            기본값으로
          </button>
        </div>
        <div className={styles.dateRangeInputs}>
          <div className={styles.dateInput}>
            <label htmlFor="startDate">시작일</label>
            <input
              id="startDate"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
            />
          </div>
          <div className={styles.dateSeparator}>~</div>
          <div className={styles.dateInput}>
            <label htmlFor="endDate">종료일</label>
            <input
              id="endDate"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3>총 매출</h3>
            <p className={styles.statValue}>{totalSales.toLocaleString()}원</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <h3>기록된 일수</h3>
            <p className={styles.statValue}>{groupedSales.length}일</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>평균 매출</h3>
            <p className={styles.statValue}>
              {groupedSales.length > 0 
                ? Math.round(totalSales / groupedSales.length).toLocaleString() 
                : 0}원
            </p>
          </div>
        </div>
      </div>

      {/* 최근 매출 기록 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>최근 매출 기록</h2>
        {recentSales.length > 0 ? (
          <div className={styles.salesList}>
            {recentSales.map((sale) => (
              <div key={sale.date} className={styles.saleItem}>
                <div className={styles.saleDate}>
                  <span className={styles.dateText}>{sale.date}</span>
                  <span className={styles.weatherInfo}>
                    {getWeatherIcon(sale.weather)} {sale.weather}
                  </span>
                </div>
                <div className={styles.saleAmount}>
                  {sale.total.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>선택한 기간에 매출 기록이 없습니다.</p>
            <Link href="/input" className={styles.emptyStateButton}>
              매출 입력하기
            </Link>
          </div>
        )}
      </div>

      {/* 날씨별 통계 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>날씨별 매출 통계</h2>
        <div className={styles.weatherStats}>
          {Object.entries(weatherStats).map(([weather, stats]) => (
            <div key={weather} className={styles.weatherStat}>
              <div className={styles.weatherIcon}>{getWeatherIcon(weather)}</div>
              <div className={styles.weatherInfo}>
                <span className={styles.weatherName}>{weather}</span>
                <span className={styles.weatherCount}>{stats.count}일</span>
                <span className={styles.weatherAmount}>{stats.total.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 매출처별 통계 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>매출처별 통계</h2>
        <div className={styles.paymentStats}>
          {Object.entries(paymentStats).map(([type, stats]) => (
            <div key={type} className={styles.paymentStat}>
              <div className={styles.paymentType}>{type}</div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentCount}>{stats.count}건</span>
                <span className={styles.paymentTotal}>{stats.total.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
