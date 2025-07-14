const http = require('http');

const BASE_URL = 'http://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList';
const SERVICE_KEY = 'trBoR5TDCEd7SkX1DUwD5Ow7PGV7lZFdicILrYCnbbr4GMCpGgYh+xx84YrSwd+++DqI74NpWxU96LmxB94zZQ==';

/**
 * 특정 날짜(YYYYMMDD)의 시간별 기상청 날씨 데이터를 가져옵니다.
 * @param {string} date
 * @returns {Promise<Array>} - 시간별 날씨 데이터 배열
 */
function getWeatherByDate(date) {
    return new Promise((resolve, reject) => {
        const queryParams = new URLSearchParams({
            serviceKey: SERVICE_KEY,
            numOfRows: '100',
            pageNo: '1',
            dataType: 'JSON',
            dataCd: 'ASOS',
            dateCd: 'HR',
            startDt: date,
            startHh: '00',
            endDt: date,
            endHh: '23',
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
                    const items = parsed?.response?.body?.items?.item || [];
                    resolve(items);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

/**
 * 하루 동안의 시간별 날씨 데이터를 기반으로 대표 날씨 상태를 요약합니다.
 * @param {Array} items
 * @returns {string} - '비', '흐림', '맑음' 중 하나
 */
function summarizeDailyWeather(items) {
    if (!items || items.length === 0) return '정보 없음';

    let rainFound = false;
    let cloudSum = 0;
    let validCloudCount = 0;

    for (const item of items) {
        const rn = parseFloat(item.rn);
        const cloud = parseInt(item.dc10Tca);

        if (!isNaN(rn) && rn > 0) rainFound = true;
        if (!isNaN(cloud)) {
            cloudSum += cloud;
            validCloudCount++;
        }
    }

    if (rainFound) return '비';
    if (validCloudCount > 0 && (cloudSum / validCloudCount) >= 7) return '흐림';
    return '맑음';
}

module.exports = {
    getWeatherByDate,
    summarizeDailyWeather
};