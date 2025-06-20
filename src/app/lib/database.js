import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  // 데이터베이스 파일 경로 설정
  const dbPath = path.join(process.cwd(), 'sales.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 테이블 생성
  await createTables();
  
  return db;
}

async function createTables() {
  const database = await getDatabase();
  
  // sales 테이블 생성
  await database.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      input_date TEXT NOT NULL,
      weather TEXT NOT NULL,
      amount INTEGER NOT NULL,
      payment_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('데이터베이스 테이블이 생성되었습니다.');
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
} 