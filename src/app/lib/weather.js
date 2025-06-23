const https = require('https');

// 날씨 API 인증키 (환경변수에서 가져오거나 직접 설정)
const AUTH_KEY = '9xeZl3v1RDGXmZd79YQx_Q';

// 하늘상태 코드를 한글로 변환하는 함수
function getSkyStatus(skyCode) {
    const skyMap = {
        'DB01': '맑음',
        'DB02': '구름조금',
        'DB03': '구름많음',
        'DB04': '흐림'
    };
    return skyMap[skyCode] || '알 수 없음';
}

// 강수유무 코드를 한글로 변환하는 함수
function getPrecipitationStatus(prepCode) {
    const prepMap = {
        '1': '비',
        '2': '비/눈',
        '3': '눈',
        '4': '눈/비'
    };
    return prepMap[prepCode] || '없음';
}

// 오늘 날짜를 YYYYMMDDHH 형식으로 변환하는 함수
function getTodayFormatted() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 현재 시간을 3시간 단위로 조정 (02, 05, 08, 11, 14, 17, 20, 23)
    let hour = now.getHours();
    if (hour < 2) hour = 23; // 00-01시는 전날 23시로
    else if (hour < 5) hour = 2;
    else if (hour < 8) hour = 5;
    else if (hour < 11) hour = 8;
    else if (hour < 14) hour = 11;
    else if (hour < 17) hour = 14;
    else if (hour < 20) hour = 17;
    else if (hour < 23) hour = 20;
    else hour = 23;
    
    const hourStr = String(hour).padStart(2, '0');
    
    return `${year}${month}${day}${hourStr}`;
}

export async function getTodayWeather(location = "Seoul") {
    const today = new Date().toISOString().slice(0, 10);
    const formattedTime = getTodayFormatted();
    
    // API 요청 파라미터 설정
    const params = new URLSearchParams({
        authKey: AUTH_KEY,
        tmfc: formattedTime,  // 발표시간 (오늘 날짜 + 현재 시간대)
        tmef1: formattedTime, // 발효시간 시작
        tmef2: formattedTime, // 발효시간 종료
        disp: '1',            // 고정 길이 형식으로 응답
        reg: '11B10101'       // 서울 지역 코드 (기본값)
    });

    const apiUrl = `https://apihub.kma.go.kr/api/typ01/url/fct_afs_ds.php?${params.toString()}`;

    // URL을 파싱하여 hostname, path 등을 추출
    const url = new URL(apiUrl);
    const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)'
        }
    };

    // 요청 생성
    const req = https.request(options, (res) => {
        let result = '';
        
        // 데이터 수신 이벤트 처리
        res.on('data', (chunk) => {
            result += chunk;
        });
        
        // 수신 완료 이벤트 처리
        res.on('end', () => {
            try {
                // 기상청 특별 형식 파싱
                const weatherData = parseWeatherData(result, today);
                
                if (weatherData) {
                    const response = {
                        date: today,
                        location: location,
                        weather: {
                            temperature: weatherData.temperature || 'N/A',
                            sky: weatherData.sky || '맑음',
                            precipitation: weatherData.precipitation || '없음',
                            probability: weatherData.probability || 'N/A',
                            forecast: weatherData.forecast || '맑음',
                            windDirection: weatherData.windDirection || 'N/A',
                            effectiveTime: weatherData.effectiveTime || 'N/A'
                        },
                        raw: weatherData.raw
                    };
                    
                    resolve(response);
                } else {
                    throw new Error('유효한 날씨 데이터가 없습니다.');
                }
            } catch (error) {
                console.error('날씨 데이터 파싱 오류:', error);
                // API 호출 실패 시 기본 데이터 반환
                resolve({
                    date: today,
                    location: location,
                    weather: {
                        temperature: 'N/A',
                        sky: '맑음',
                        precipitation: '없음',
                        probability: 'N/A',
                        forecast: '맑음',
                        windDirection: 'N/A',
                        effectiveTime: 'N/A'
                    },
                    error: '날씨 데이터를 가져올 수 없습니다.'
                });
            }
        });
    });

    // 에러 이벤트 처리
    req.on('error', (error) => {
        console.error('날씨 API 호출 오류:', error);
        reject(error);
    });

    // 요청 완료
    req.end();
}

// 특정 날짜의 날씨를 가져오는 함수
export async function getWeatherByDate(targetDate, regionCode = '11B10101') {
    // targetDate는 YYYY-MM-DD 형식
    const dateObj = new Date(targetDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    // 해당 날짜의 02시(새벽 2시) 데이터를 가져옴
    const hour = '02';
    const formattedTime = `${year}${month}${day}${hour}`;
    
    const params = new URLSearchParams({
        authKey: AUTH_KEY,
        tmfc: formattedTime,
        tmef1: formattedTime,
        tmef2: formattedTime,
        disp: '0',  // 고정 길이 형식으로 변경
        reg: regionCode
    });

    const apiUrl = `https://apihub.kma.go.kr/api/typ01/url/fct_afs_ds.php?${params.toString()}`;
    console.log(apiUrl);
    const url = new URL(apiUrl);
    const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; WeatherApp/1.0)'
        }
    };

    const req = https.request(options, (res) => {
        let result = '';
        
        res.on('data', (chunk) => {
            result += chunk;
        });
        
        res.on('end', () => {
            try {
                // 기상청 특별 형식 파싱
                const weatherData = parseWeatherData(result, targetDate);
                
                if (weatherData) {
                    resolve({
                        date: targetDate,
                        regionCode: regionCode,
                        regionName: weatherData.regionName || '서울',
                        weather: {
                            temperature: weatherData.temperature || 'N/A',
                            sky: weatherData.sky || '맑음',
                            precipitation: weatherData.precipitation || '없음',
                            probability: weatherData.probability || 'N/A',
                            forecast: weatherData.forecast || '맑음',
                            windDirection: weatherData.windDirection || 'N/A',
                            effectiveTime: weatherData.effectiveTime || 'N/A'
                        },
                        raw: weatherData
                    });
                } else {
                    throw new Error('유효한 날씨 데이터가 없습니다.');
                }
            } catch (error) {
                console.error('날씨 데이터 파싱 오류:', error);
                // API 호출 실패 시 기본 데이터 반환
                resolve({
                    date: targetDate,
                    regionCode: regionCode,
                    regionName: '서울',
                    weather: {
                        temperature: 'N/A',
                        sky: '맑음',
                        precipitation: '없음',
                        probability: 'N/A',
                        forecast: '맑음',
                        windDirection: 'N/A',
                        effectiveTime: 'N/A'
                    },
                    error: '날씨 데이터를 가져올 수 없습니다.'
                });
            }
        });
    });

    req.on('error', (error) => {
        console.error('날씨 API 호출 오류:', error);
        reject(error);
    });

    req.end();
}