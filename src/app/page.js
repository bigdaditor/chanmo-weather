"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function Dashboard() {
  return (
    <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1 className={styles.title} style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        📋 찬모날씨 POS 메뉴
      </h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link href="/input" className={styles.addButton} style={{ fontSize: '1.5rem', padding: '2rem 3rem' }}>
          ➕ 매출 입력
        </Link>
        <Link href="/stats" className={styles.addButton} style={{ fontSize: '1.5rem', padding: '2rem 3rem' }}>
          📊 통계 확인
        </Link>
      </div>
    </div>
  );
}
