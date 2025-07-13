import { getSeoulWeatherByDateTime, summarizeWeatherStatus } from '../../lib/weather';

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

        // 20시 날씨 기준 조회
        const weatherData = await new Promise((resolve, reject) => {
            const chunks = [];
            const originalLog = console.info;
            console.info = (...args) => {
                const match = args.find(arg => typeof arg === 'string' && arg.includes('"response"'));
                if (match) {
                    try {
                        const parsed = JSON.parse(match);
                        resolve(parsed.response?.body?.items?.item?.[0]);
                    } catch (e) {
                        reject(e);
                    }
                }
                originalLog(...args);
            };

            require('../../lib/weather').getSeoulWeatherByDateTime(date, '20');
        });

        const summary = summarizeWeatherStatus(weatherData);

        return Response.json({
            success: true,
            date,
            summary,
            raw: weatherData
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