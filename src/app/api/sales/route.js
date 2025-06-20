// src/app/api/sales/route.js

import { NextResponse } from 'next/server';
import { getDatabase } from '../../lib/database';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // 모든 매출 데이터 조회
    const sales = await db.all(`
      SELECT 
        id,
        input_date,
        weather,
        amount,
        payment_type,
        created_at
      FROM sales 
      ORDER BY input_date DESC, created_at DESC
    `);
    
    return NextResponse.json(sales);
  } catch (error) {
    console.error("매출 데이터 조회 오류:", error);
    return NextResponse.json(
      { error: "매출 데이터를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // 데이터 유효성 검사
    if (!data.date || !data.sales) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const inputDate = data.date;
    const weather = data.weather || "맑음";
    const salesData = data.sales;
    
    // 각 매출처별로 데이터베이스에 저장
    const paymentTypes = {
      cash: "현금",
      card: "카드", 
      onnuri: "온누리상품권",
      delivery: "배달",
      other: "기타"
    };
    
    const savedRecords = [];
    
    for (const [type, amount] of Object.entries(salesData)) {
      if (amount && parseInt(amount) > 0) {
        const result = await db.run(`
          INSERT INTO sales (input_date, weather, amount, payment_type)
          VALUES (?, ?, ?, ?)
        `, [inputDate, weather, parseInt(amount), paymentTypes[type]]);
        
        savedRecords.push({
          id: result.lastID,
          input_date: inputDate,
          weather: weather,
          amount: parseInt(amount),
          payment_type: paymentTypes[type]
        });
      }
    }
    
    if (savedRecords.length === 0) {
      return NextResponse.json(
        { error: "저장할 매출 데이터가 없습니다." },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      status: "success", 
      message: "매출이 성공적으로 저장되었습니다.",
      data: savedRecords
    });
  } catch (error) {
    console.error("매출 저장 오류:", error);
    return NextResponse.json(
      { error: "매출 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
