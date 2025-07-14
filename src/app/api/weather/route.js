import { getWeatherByDate, summarizeDailyWeather } from '../../lib/weather';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date'); // YYYYMMDD 형식

        if (!date) {
            return Response.json({
                success: false,
                error: '날짜(date) 파라미터가 필요합니다.'
            }, { status: 400 });
        }

        const items = await getWeatherByDate(date);
        const summary = summarizeDailyWeather(items);

        return Response.json({
            success: true,
            date,
            summary,
            raw: items
        });

    } catch (error) {
        console.error('날씨 API 오류:', error);
        return Response.json({
            success: false,
            error: '날씨 정보를 가져오는데 실패했습니다.',
            message: error.message
        }, { status: 500 });
    }
}