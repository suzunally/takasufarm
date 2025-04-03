// APIキー
const agroAPIKey = 'b89c50b7546d536cc1464deb65b0656c';
const takasuFarm = 'TAKASU';

// ポリゴンID - Agro Dashboardで作成したポリゴンのIDを設定
const polygonId = '6795fe3fc46b9fa867dfb642'; // これは例です。実際のポリゴンIDに置き換えてください

// ポリゴンベースの天気データAPIエンドポイント - 修正
// /weather/stats ではなく /weather を使用
const polygonWeatherEndpoint = `https://api.agromonitoring.com/agro/1.0/weather?polyid=${polygonId}&appid=${agroAPIKey}`;

// ポリゴンベースの予報データAPIエンドポイント
const polygonForecastEndpoint = `https://api.agromonitoring.com/agro/1.0/weather/forecast?polyid=${polygonId}&appid=${agroAPIKey}`;

// 天気の英語表現を日本語に変換する関数
function translateWeather(englishWeather) {
    const weatherMap = {
        // 基本的な天気
        'clear sky': '快晴',
        'few clouds': '晴れ（雲少し）',
        'scattered clouds': '晴れ（雲あり）',
        'broken clouds': '曇り（晴れ間あり）',
        'overcast clouds': '曇り',
        'light rain': '小雨',
        'moderate rain': '雨',
        'heavy rain': '大雨',
        'light snow': '小雪',
        'snow': '雪',
        'heavy snow': '大雪',
        'sleet': 'みぞれ',
        'shower rain': 'にわか雨',
        'thunderstorm': '雷雨',
        'mist': '霧',
        'fog': '濃霧',
        'haze': '霞',
        // その他の天気表現
        'light intensity drizzle': '弱い霧雨',
        'drizzle': '霧雨',
        'heavy intensity drizzle': '強い霧雨',
        'shower drizzle': 'にわか霧雨',
        'rain and snow': '雨と雪',
        'light shower snow': '小さな雪のにわか雪',
        'shower snow': 'にわか雪',
        'heavy shower snow': '強いにわか雪',
        'freezing rain': '冷たい雨',
        'light thunderstorm': '小さな雷雨',
        'heavy thunderstorm': '激しい雷雨',
        'ragged thunderstorm': '不規則な雷雨',
        'thunderstorm with light rain': '小雨を伴う雷雨',
        'thunderstorm with rain': '雨を伴う雷雨',
        'thunderstorm with heavy rain': '大雨を伴う雷雨',
        'dust': 'ほこり',
        'sand': '砂',
        'volcanic ash': '火山灰',
        'squalls': '突風',
        'tornado': '竜巻'
    };
    
    // 対応する日本語訳があればそれを返し、なければ英語をそのまま返す
    return weatherMap[englishWeather.toLowerCase()] || englishWeather;
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    fetchAgroInfo();
    fetchWeeklyForecast();
});

async function fetchAgroInfo() {
    try {
        // ポリゴンベースの天気データを取得
        const response = await fetch(polygonWeatherEndpoint);
        
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        
        const agroInfo = await response.json();
        showAgroInfo(agroInfo);
        
    } catch(error) {
        // エラー内容をh2要素に表示
        const errorElement = document.querySelector('h2');
        errorElement.textContent = `ごめんなさい！ エラーが発生しました💦 エラーコード：${error.message}`;
        errorElement.style.color = '#CE579B';
    } finally {
        // コンソールに情報取得完了を表示
        console.log('情報取得完了！');
    }
}

// 週間天気予報を取得する関数
async function fetchWeeklyForecast() {
    try {
        // ポリゴンベースの予報データを取得
        console.log('週間天気予報を取得中...', polygonForecastEndpoint);
        const response = await fetch(polygonForecastEndpoint);
        
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        
        const forecastData = await response.json();
        console.log('取得した週間天気予報データ:', forecastData);
        
        // データ構造を検証
        if (!forecastData || typeof forecastData !== 'object') {
            throw new Error('予報データが正しい形式ではありません');
        }
        
        // 重要: forecastDataが配列の場合があります（AgroMonitoring APIの特性）
        if (Array.isArray(forecastData)) {
            // 配列をlistプロパティを持つオブジェクトに変換
            const formattedData = { list: forecastData };
            showWeeklyForecast(formattedData);
        } else {
            showWeeklyForecast(forecastData);
        }
        
    } catch(error) {
        console.error('週間天気予報の取得に失敗しました:', error);
        
        // エラー表示（オプション）
        const container = document.getElementById('takasuHatakeCondition');
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `週間天気予報の取得に失敗しました: ${error.message}`;
        errorMsg.style.color = 'red';
        container.appendChild(errorMsg);
    }
}

function showAgroInfo(AgroInfomations) {
    // 取得情報をテーブルで表示
    const container = document.getElementById('takasuHatakeCondition');
    
    // 既存のテーブルがあれば削除
    const existingTable = document.querySelector('#weather-table');
    if (existingTable) {
        existingTable.remove();
    }
    
    // テーブル要素の作成
    const table = document.createElement('table');
    table.id = 'weather-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.margin = '20px 0';
    table.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    
    // テーブルヘッダーの作成
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['項目', '数値', '単位'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.padding = '12px 15px';
        th.style.backgroundColor = '#4CAF50';
        th.style.color = 'white';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // テーブル本体の作成
    const tbody = document.createElement('tbody');
    
    // ケルビンを摂氏に変換する関数
    const kelvinToCelsius = (kelvin) => {
        return kelvin ? (kelvin - 273.15).toFixed(2) : '情報なし';
    };
    
    // 英語の天気を日本語に変換
    const weatherDescription = AgroInfomations.weather?.[0]?.description || '情報なし';
    const translatedWeather = translateWeather(weatherDescription);
    
    // 表示データの定義（APIから取得したデータに合わせて調整）
    const weatherData = [
        { name: '気温', value: kelvinToCelsius(AgroInfomations.main?.temp), unit: '°C' },
        { name: '湿度', value: AgroInfomations.main?.humidity || '情報なし', unit: '%' },
        { name: '天気', value: translatedWeather, unit: '' },
        { name: '風速', value: AgroInfomations.wind?.speed || '情報なし', unit: 'm/s' },
        { name: '気圧', value: AgroInfomations.main?.pressure || '情報なし', unit: 'hPa' }
    ];
    
    // データ行の作成
    weatherData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : 'white';
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        nameCell.style.padding = '12px 15px';
        nameCell.style.borderBottom = '1px solid #ddd';
        
        const valueCell = document.createElement('td');
        valueCell.textContent = item.value;
        valueCell.style.padding = '12px 15px';
        valueCell.style.borderBottom = '1px solid #ddd';
        
        const unitCell = document.createElement('td');
        unitCell.textContent = item.unit;
        unitCell.style.padding = '12px 15px';
        unitCell.style.borderBottom = '1px solid #ddd';
        
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(unitCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    // 更新時間の表示
    const updateInfo = document.createElement('p');
    const date = new Date();
    updateInfo.textContent = `最終更新: ${date.toLocaleString('ja-JP')}`;
    updateInfo.style.fontSize = '0.8em';
    updateInfo.style.color = '#666';
    updateInfo.style.textAlign = 'right';
    
    container.appendChild(updateInfo);
}

// 週間天気予報を表示する関数
function showWeeklyForecast(forecastData) {
    console.log('週間天気予報表示処理を開始します');
    const container = document.getElementById('takasuHatakeCondition');
    
    // 既存の週間予報セクションがあれば削除
    const existingForecast = document.querySelector('#weekly-forecast-section');
    if (existingForecast) {
        existingForecast.remove();
    }
    
    // 週間予報セクション
    const forecastSection = document.createElement('div');
    forecastSection.id = 'weekly-forecast-section';
    
    // 週間予報のセクションタイトル
    const weeklyTitle = document.createElement('h3');
    weeklyTitle.textContent = '週間天気予報';
    weeklyTitle.style.marginTop = '30px';
    weeklyTitle.style.borderBottom = '2px solid #4CAF50';
    weeklyTitle.style.paddingBottom = '5px';
    forecastSection.appendChild(weeklyTitle);
    
    // 週間予報コンテナ
    const forecastContainer = document.createElement('div');
    forecastContainer.style.display = 'flex';
    forecastContainer.style.flexWrap = 'wrap';
    forecastContainer.style.justifyContent = 'space-between';
    forecastContainer.style.gap = '10px';
    forecastContainer.style.marginTop = '20px';
    
    // APIからの予報データを処理
    // AgroMonitoring APIは配列として直接予報データを返す場合があります
    let forecastList = [];
    
    if (Array.isArray(forecastData)) {
        // データが直接配列の場合
        forecastList = forecastData;
    } else if (forecastData.list && Array.isArray(forecastData.list)) {
        // データがlist配列プロパティを持つオブジェクトの場合
        forecastList = forecastData.list;
    } else {
        console.log('予期しない予報データ形式:', forecastData);
    }
    
    console.log('予報リスト:', forecastList);
    
    // 予報データがない場合
    if (!forecastList || forecastList.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = '週間天気予報データがありません';
        noDataMsg.style.textAlign = 'center';
        noDataMsg.style.width = '100%';
        noDataMsg.style.padding = '20px';
        forecastContainer.appendChild(noDataMsg);
        forecastSection.appendChild(forecastContainer);
        container.appendChild(forecastSection);
        console.log('予報データがないため、処理を終了します');
        return;
    }
    
    // デバッグ用：最初の予報データの構造を確認
    console.log('最初の予報データの例:', forecastList[0]);
    
    // ケルビンを摂氏に変換する関数
    const kelvinToCelsius = (kelvin) => {
        return kelvin ? (kelvin - 273.15).toFixed(1) : '情報なし';
    };
    
    // 日付ごとにデータをグループ化（同じ日の予報が複数ある場合）
    const dailyForecasts = {};
    
    forecastList.forEach(forecast => {
        try {
            // 日付を取得
            if (!forecast.dt) {
                console.warn('dtフィールドがない予報データをスキップします:', forecast);
                return;
            }
            
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString('ja-JP');
            console.log(`処理中の日付: ${dateString}`, forecast);
            
            // まだその日のデータがなければ初期化
            if (!dailyForecasts[dateString]) {
                dailyForecasts[dateString] = {
                    date: date,
                    temps: [],
                    weather: [],
                    icon: forecast.weather?.[0]?.icon || '',
                    humidity: [],
                    wind: [],
                    pressure: []
                };
            }
            
            // 気温データを追加（エラー処理を追加）
            if (forecast.main && typeof forecast.main.temp !== 'undefined') {
                // ケルビンから摂氏に変換して保存
                const celsiusTemp = kelvinToCelsius(forecast.main.temp);
                dailyForecasts[dateString].temps.push(parseFloat(celsiusTemp));
            } else {
                console.warn('気温データがありません:', forecast);
            }
            
            // 湿度データを追加
            if (forecast.main && typeof forecast.main.humidity !== 'undefined') {
                dailyForecasts[dateString].humidity.push(forecast.main.humidity);
            }
            
            // 風速データを追加
            if (forecast.wind && typeof forecast.wind.speed !== 'undefined') {
                dailyForecasts[dateString].wind.push(forecast.wind.speed);
            }
            
            // 気圧データを追加
            if (forecast.main && typeof forecast.main.pressure !== 'undefined') {
                dailyForecasts[dateString].pressure.push(forecast.main.pressure);
            }
            
            // 天気データを追加 - 英語から日本語に変換
            if (forecast.weather && forecast.weather[0] && forecast.weather[0].description) {
                const englishWeather = forecast.weather[0].description;
                const japaneseWeather = translateWeather(englishWeather);
                dailyForecasts[dateString].weather.push(japaneseWeather);
            } else {
                console.warn('天気の説明がありません:', forecast);
                dailyForecasts[dateString].weather.push('不明');
            }
        } catch (err) {
            console.error('予報データの処理中にエラーが発生しました:', err, forecast);
        }
    });
    
    console.log('日付ごとにグループ化した予報:', dailyForecasts);
    
    // グループ化されたデータがない場合
    if (Object.keys(dailyForecasts).length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = '処理可能な週間天気予報データがありません';
        noDataMsg.style.textAlign = 'center';
        noDataMsg.style.width = '100%';
        noDataMsg.style.padding = '20px';
        forecastContainer.appendChild(noDataMsg);
        forecastSection.appendChild(forecastContainer);
        container.appendChild(forecastSection);
        console.log('処理可能な予報データがないため、終了します');
        return;
    }
    
    // 日ごとのカードを作成（最大7日分）
    Object.values(dailyForecasts).slice(0, 7).forEach(dayData => {
        try {
            const dayCard = document.createElement('div');
            dayCard.style.flex = '1';
            dayCard.style.minWidth = '120px';
            dayCard.style.maxWidth = 'calc(100% / 3 - 10px)';
            dayCard.style.backgroundColor = '#f9f9f9';
            dayCard.style.borderRadius = '8px';
            dayCard.style.padding = '10px';
            dayCard.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            dayCard.style.textAlign = 'center';
            
            // 曜日
            const weekday = dayData.date.toLocaleDateString('ja-JP', { weekday: 'short' });
            const dateHeader = document.createElement('h4');
            dateHeader.textContent = `${dayData.date.getMonth() + 1}/${dayData.date.getDate()} (${weekday})`;
            dateHeader.style.margin = '5px 0';
            dayCard.appendChild(dateHeader);
            
            // 主な天気（最も頻度の高い天気を表示）
            const weatherCounts = {};
            dayData.weather.forEach(w => {
                weatherCounts[w] = (weatherCounts[w] || 0) + 1;
            });
            
            let mainWeather = '';
            let maxCount = 0;
            for (const [weather, count] of Object.entries(weatherCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    mainWeather = weather;
                }
            }
            
            // 天気に応じた絵文字を表示
            const weatherEmoji = document.createElement('div');
            weatherEmoji.style.fontSize = '40px';
            weatherEmoji.style.margin = '10px 0';
            
            // 天気に応じた絵文字を設定
            if (mainWeather === '快晴') {
                weatherEmoji.textContent = '🌞';
            } else if (mainWeather.includes('晴れ')) {
                weatherEmoji.textContent = '🌤️';
            } else if (mainWeather.includes('曇り')) {
                weatherEmoji.textContent = '☁️';
            } else if (mainWeather.includes('雨')) {
                weatherEmoji.textContent = '🌧️';
            } else if (mainWeather.includes('雪')) {
                weatherEmoji.textContent = '❄️';
            } else if (mainWeather.includes('雷')) {
                weatherEmoji.textContent = '⚡';
            } else if (mainWeather.includes('霧')) {
                weatherEmoji.textContent = '🌫️';
            } else {
                weatherEmoji.textContent = '🌈';
            }
            
            dayCard.appendChild(weatherEmoji);
            
            // 最高・最低気温
            const temps = dayData.temps;
            if (temps && temps.length > 0) {
                const maxTemp = Math.max(...temps);
                const minTemp = Math.min(...temps);
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = `<span style="color: #FF5722; font-weight: bold;">${maxTemp.toFixed(1)}°C</span> / <span style="color: #2196F3; font-weight: bold;">${minTemp.toFixed(1)}°C</span>`;
                dayCard.appendChild(tempDiv);
            } else {
                const tempDiv = document.createElement('div');
                tempDiv.textContent = '気温データなし';
                dayCard.appendChild(tempDiv);
            }
            
            const weatherDiv = document.createElement('div');
            weatherDiv.textContent = mainWeather || '天気データなし';
            weatherDiv.style.marginTop = '5px';
            dayCard.appendChild(weatherDiv);
            
            // 湿度の表示（平均値）
            if (dayData.humidity && dayData.humidity.length > 0) {
                const avgHumidity = dayData.humidity.reduce((sum, val) => sum + val, 0) / dayData.humidity.length;
                const humidityDiv = document.createElement('div');
                humidityDiv.innerHTML = `<small>湿度: <span style="color: #4a86e8;">${Math.round(avgHumidity)}%</span></small>`;
                humidityDiv.style.marginTop = '3px';
                dayCard.appendChild(humidityDiv);
            }
            
            // 風速の表示（平均値）
            if (dayData.wind && dayData.wind.length > 0) {
                const avgWind = dayData.wind.reduce((sum, val) => sum + val, 0) / dayData.wind.length;
                const windDiv = document.createElement('div');
                windDiv.innerHTML = `<small>風速: <span style="color: #6aa84f;">${avgWind.toFixed(1)}m/s</span></small>`;
                windDiv.style.marginTop = '3px';
                dayCard.appendChild(windDiv);
            }
            
            // 気圧の表示（平均値）
            if (dayData.pressure && dayData.pressure.length > 0) {
                const avgPressure = dayData.pressure.reduce((sum, val) => sum + val, 0) / dayData.pressure.length;
                const pressureDiv = document.createElement('div');
                pressureDiv.innerHTML = `<small>気圧: <span style="color: #674ea7;">${Math.round(avgPressure)}hPa</span></small>`;
                pressureDiv.style.marginTop = '3px';
                dayCard.appendChild(pressureDiv);
            }
            
            forecastContainer.appendChild(dayCard);
        } catch (err) {
            console.error('日ごとの予報カード作成中にエラーが発生しました:', err, dayData);
        }
    });
    
    forecastSection.appendChild(forecastContainer);
    container.appendChild(forecastSection);
    console.log('週間天気予報の表示が完了しました');
}
