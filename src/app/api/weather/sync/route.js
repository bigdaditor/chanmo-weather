import {syncWeatherData} from '../../../lib/weather';

export async function POST() {
  try {
    const inserted = await syncWeatherData(5);
    return Response.json({ success: true, inserted });
  } catch (error) {
    console.error('날씨 동기화 오류:', error);
    return Response.json(
      {
        success: false,
        error: '날씨 동기화에 실패했습니다.',
        message: error.message
      },
      { status: 500 }
    );
  }
}