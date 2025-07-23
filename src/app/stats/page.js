

"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 추후 /api/sales?withWeather=true 와 같은 API에서 불러오기
    setData([
      { date: "2025-07-10", total: 120000, weather: "맑음" },
      { date: "2025-07-11", total: 95000, weather: "흐림" },
      { date: "2025-07-12", total: 102000, weather: "비" }
    ]);
  }, []);

  const totalDays = data.length;
  const totalSales = data.reduce((sum, item) => sum + item.total, 0);
  const averageSales = totalDays > 0 ? Math.round(totalSales / totalDays) : 0;

  return (
    <div style={{
      width: '1024px',
      height: '768px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊 매출 통계</h1>

      <div style={{ display: 'flex', gap: '2rem', fontSize: '1.2rem' }}>
        <div>📅 총 {totalDays}일</div>
        <div>💰 총 매출 {totalSales.toLocaleString()}원</div>
        <div>📈 평균 {averageSales.toLocaleString()}원</div>
      </div>

      <table style={{
        width: '100%',
        marginTop: '2rem',
        borderCollapse: 'collapse',
        fontSize: '1.1rem',
        backgroundColor: '#fff'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#e0e0e0' }}>
            <th style={{ padding: '1rem', border: '1px solid #ccc' }}>날짜</th>
            <th style={{ padding: '1rem', border: '1px solid #ccc' }}>날씨</th>
            <th style={{ padding: '1rem', border: '1px solid #ccc' }}>총 매출</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.date}>
              <td style={{ padding: '1rem', border: '1px solid #ccc' }}>{item.date}</td>
              <td style={{ padding: '1rem', border: '1px solid #ccc' }}>{item.weather}</td>
              <td style={{ padding: '1rem', border: '1px solid #ccc' }}>{item.total.toLocaleString()}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}