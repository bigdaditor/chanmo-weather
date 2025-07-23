"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div
      className={styles.container}
      style={{
        width: '1024px',
        height: '768px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4'
      }}
    >
      <h1 className={styles.title} style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        📋 찬모날씨 POS 메뉴
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          width: '100%',
          padding: '0 2rem'
        }}
      >
        <Link
          href="/input"
          className="button-large"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.4rem'
          }}
        >
          ➕<div style={{ marginTop: '0.5rem' }}>매출 입력</div>
        </Link>
        <Link
          href="/stats"
          className="button-large"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.4rem'
          }}
        >
          📊<div style={{ marginTop: '0.5rem' }}>통계 확인</div>
        </Link>
        <div
          className="button-large"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.4rem',
            color: '#888'
          }}
        >
          ⚙️<div style={{ marginTop: '0.5rem' }}>업무가이드</div>
        </div>
      </div>
    </div>
  );
}
