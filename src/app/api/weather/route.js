import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // 실제 날씨 API 연동 (현재는 더미 데이터 반환)
    // TODO: 실제 날씨 API로 교체
    const weatherData = await getWeatherData(date);
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('날씨 API 오류:', error);
    return NextResponse.json(
      { error: '날씨 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function getWeatherData(date) {
  // 실제 구현에서는 날씨 API를 호출하여 데이터를 가져옴
  // 현재는 더미 데이터 반환
  
  const weatherConditions = ['맑음', '흐림', '비', '눈'];
  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const randomTemp = Math.floor(Math.random() * 30) + 5; // 5~35도
  
  return {
    date: date,
    condition: randomCondition,
    temperature: `${randomTemp}°C`,
    humidity: `${Math.floor(Math.random() * 40) + 40}%`, // 40~80%
    windSpeed: `${Math.floor(Math.random() * 10) + 1}m/s` // 1~10m/s
  };
} 