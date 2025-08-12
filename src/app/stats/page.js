"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sales');
      const json = await res.json();
      if (res.status === 200) {
        setData(json);
      } else {
        console.error(JSON.stringify(json));
      }
    };
    fetchData();
  }, []);

  const totalDays = data.length;
  const totalSales = data.reduce((sum, item) => sum + item.amount, 0);
  const averageSales = totalDays > 0 ? Math.round(totalSales / totalDays) : 0;

  // 날짜별로 매출 그룹화
  const groupedByDateMap = {};
  data.forEach((item) => {
    if (!groupedByDateMap[item.input_date]) {
      groupedByDateMap[item.input_date] = {
        date: item.input_date,
        total: 0,
        weather: item.weather
      };
    }
    groupedByDateMap[item.input_date].total += item.amount;
  });
  const groupedByDate = Object.values(groupedByDateMap);

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
      <a href="/" style={{ fontSize: "1.5rem", textDecoration: "none", color: "#333" }}>
        ← 메인으로
      </a>
      <button
        onClick={async () => {
          const res = await fetch('/api/weather/sync', { method: 'POST' });
          const result = await res.json();
          if (res.status === 200) {
            alert(`날씨 동기화 완료 (${result.inserted.length}건)`);
          } else {
            alert('동기화 실패: ' + result.error);
          }
        }}
        style={{
          alignSelf: 'flex-end',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 날씨 동기화
      </button>
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
          {groupedByDate.map((item) => (
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