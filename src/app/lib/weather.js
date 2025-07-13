const http = require('http');

const BASE_URL = 'http://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList';
const SERVICE_KEY = 'trBoR5TDCEd7SkX1DUwD5Ow7PGV7lZFdicILrYCnbbr4GMCpGgYh+xx84YrSwd+++DqI74NpWxU96LmxB94zZQ==';

/**
 * 기상청 ASOS API를 통해 특정 날짜와 시간의 서울 날씨 정보를 가져옵니다.
 * @param {string} date - 조회 날짜 (YYYYMMDD)
 * @param {string} hour - 조회 시간 (HH, 예: '01', '14')
 */
function getSeoulWeatherByDateTime(date, hour = '01') {
    const queryParams = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        numOfRows: '10',
        pageNo: '1',
        dataType: 'JSON',
        dataCd: 'ASOS',
        dateCd: 'HR',
        startDt: date,
        startHh: hour,
        endDt: date,
        endHh: hour,
        stnIds: '108'
    });

    const requestUrl = `${BASE_URL}?${queryParams.toString()}`;

    http.get(requestUrl, (res) => {
        let rawData = '';

        res.on('data', (chunk) => {
            rawData += chunk;
        });

        res.on('end', () => {
            try {
                const parsed = JSON.parse(rawData);
                console.info('[기상청 응답]', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.error('[JSON 파싱 오류]', e);
                console.error(rawData);
            }
        });
    }).on('error', (e) => {
        console.error('[HTTP 요청 오류]', e);
    });
}

// 사용 예시
getSeoulWeatherByDateTime('20250710', '14');


/**
 * 기상청 ASOS 시간자료 응답에서 날씨 상태를 요약합니다.
 * @param {Object} item - 기상청 응답 items 배열 중 하나의 item (20시 기준)
 * @returns {string} - '비', '흐림', '맑음' 중 하나
 */
function summarizeWeatherStatus(item) {
    if (!item) return '정보 없음';

    const rn = parseFloat(item.rn);
    const totalCloud = parseInt(item.dc10Tca); // 전운량 (0~10)

    if (!isNaN(rn) && rn > 0) return '비';
    if (!isNaN(totalCloud) && totalCloud >= 8) return '흐림';
    return '맑음';
}

module.exports = {
    getSeoulWeatherByDateTime,
    summarizeWeatherStatus
};