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
    // 全体のスタイルを適用
    applyGlobalStyles();
    
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

// グローバルスタイルを適用する関数
function applyGlobalStyles() {
    // コンテナのスタイリング
    const container = document.getElementById('takasuHatakeCondition');
    if (container) {
        container.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
        container.style.maxWidth = '100%';
        container.style.margin = '0 auto';
        container.style.padding = '20px';
        container.style.backgroundColor = '#f8fff8'; // 薄い緑色の背景
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 6px 25px rgba(105, 165, 120, 0.15)';
        container.style.overflow = 'hidden';
    }
    
    // タイトルスタイルの改善
    const title = document.querySelector('h2');
    if (title) {
        title.style.borderBottom = '2px solid #4CAF50';
        title.style.paddingBottom = '10px';
        title.style.color = '#2E7D32'; // 深い緑色
        title.style.fontWeight = '600';
        title.style.marginBottom = '20px';
        title.style.fontSize = window.innerWidth < 600 ? '20px' : '24px'; // レスポンシブフォントサイズ
    }
    
    // 画面サイズが変更されたときのイベントリスナー
    window.addEventListener('resize', adjustLayoutForScreenSize);
    
    // 初期表示時にもレイアウトを調整
    adjustLayoutForScreenSize();
}

// 画面サイズに応じてレイアウトを調整する関数
function adjustLayoutForScreenSize() {
    const container = document.getElementById('takasuHatakeCondition');
    const isSmallScreen = window.innerWidth < 600;
    
    if (container) {
        container.style.padding = isSmallScreen ? '15px 10px' : '20px';
    }
    
    // テーブルのレスポンシブ対応
    const table = document.getElementById('weather-table');
    if (table) {
        if (isSmallScreen) {
            table.style.fontSize = '14px';
            
            // テーブルのセルにあるすべてのth, tdにスタイルを適用
            const cells = table.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.style.padding = '10px';
            });
        } else {
            table.style.fontSize = '16px';
            
            const cells = table.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.style.padding = '15px 20px';
            });
        }
    }
    
    // 週間予報カードのレスポンシブ対応
    const forecastContainer = document.querySelector('#weekly-forecast-section > div');
    if (forecastContainer) {
        // スマホでは1行2カードにする
        forecastContainer.style.gap = isSmallScreen ? '10px' : '15px';
        
        const cards = forecastContainer.querySelectorAll('div');
        cards.forEach(card => {
            if (card.style.flex) { // カードの要素だけを選択
                card.style.minWidth = isSmallScreen ? 'calc(50% - 5px)' : '130px';
                card.style.maxWidth = isSmallScreen ? 'calc(50% - 5px)' : 'calc(100% / 3 - 15px)';
                card.style.padding = isSmallScreen ? '10px' : '15px';
                
                // 天気絵文字のサイズ調整
                const emoji = card.querySelector('div[style*="fontSize"]');
                if (emoji) {
                    emoji.style.fontSize = isSmallScreen ? '36px' : '45px';
                    emoji.style.margin = isSmallScreen ? '8px 0' : '15px 0';
                }
                
                // 日付ヘッダーのサイズ調整
                const dateHeader = card.querySelector('h4');
                if (dateHeader) {
                    dateHeader.style.fontSize = isSmallScreen ? '14px' : '16px';
                }
                
                // 温度表示のサイズ調整
                const tempDiv = card.querySelector('div[style*="fontWeight: 600"]');
                if (tempDiv) {
                    tempDiv.style.fontSize = isSmallScreen ? '14px' : '16px';
                }
                
                // 詳細情報のコンテナサイズ調整
                const detailsContainer = card.querySelector('div[style*="borderTop"]');
                if (detailsContainer) {
                    detailsContainer.style.fontSize = isSmallScreen ? '11px' : '13px';
                    detailsContainer.style.padding = isSmallScreen ? '8px 2px 2px' : '10px 5px 5px';
                }
            }
        });
    }
    
    // 週間予報のタイトルもレスポンシブに
    const weeklyTitle = document.querySelector('#weekly-forecast-section > h3');
    if (weeklyTitle) {
        weeklyTitle.style.fontSize = isSmallScreen ? '18px' : '20px';
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
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.style.margin = '20px 0';
    table.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
    table.style.borderRadius = '10px';
    table.style.overflow = 'hidden';
    
    // レスポンシブテーブル
    const isSmallScreen = window.innerWidth < 600;
    if (isSmallScreen) {
        table.style.fontSize = '14px';
    }
    
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
    const isSmallScreen = window.innerWidth < 768; // タブレットサイズ未満をスマホとみなす
    
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
    weeklyTitle.style.color = '#2E7D32'; // 深い緑色
    weeklyTitle.style.borderBottom = '2px solid #4CAF50';
    weeklyTitle.style.paddingBottom = '10px';
    weeklyTitle.style.fontSize = isSmallScreen ? '18px' : '20px';
    forecastSection.appendChild(weeklyTitle);
    
    // APIからの予報データを処理
    let forecastList = [];
    
    if (Array.isArray(forecastData)) {
        forecastList = forecastData;
    } else if (forecastData.list && Array.isArray(forecastData.list)) {
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
        forecastSection.appendChild(noDataMsg);
        container.appendChild(forecastSection);
        console.log('予報データがないため、処理を終了します');
        return;
    }
    
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
            
            // 気温データを追加
            if (forecast.main && typeof forecast.main.temp !== 'undefined') {
                const celsiusTemp = kelvinToCelsius(forecast.main.temp);
                dailyForecasts[dateString].temps.push(parseFloat(celsiusTemp));
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
                dailyForecasts[dateString].weather.push('不明');
            }
        } catch (err) {
            console.error('予報データの処理中にエラーが発生しました:', err, forecast);
        }
    });
    
    // グループ化されたデータがない場合
    if (Object.keys(dailyForecasts).length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = '処理可能な週間天気予報データがありません';
        noDataMsg.style.textAlign = 'center';
        noDataMsg.style.width = '100%';
        noDataMsg.style.padding = '20px';
        forecastSection.appendChild(noDataMsg);
        container.appendChild(forecastSection);
        console.log('処理可能な予報データがないため、終了します');
        return;
    }
    
    // 日付データを最大7日分取得
    const forecasts = Object.values(dailyForecasts).slice(0, 7);
    
    if (isSmallScreen) {
        // スマホサイズの場合はスライドショーで表示
        createSlideshow(forecasts, forecastSection);
    } else {
        // PCサイズの場合はグリッド表示
        createGridView(forecasts, forecastSection);
    }
    
    container.appendChild(forecastSection);
    
    // 画面サイズが変わった時に表示を切り替える
    window.addEventListener('resize', () => {
        const newIsSmallScreen = window.innerWidth < 768;
        // 画面サイズの区分が変わった場合のみ再描画
        if (newIsSmallScreen !== isSmallScreen) {
            showWeeklyForecast(forecastData);
        }
    });
    
    console.log('週間天気予報の表示が完了しました');
}

// PCサイズ用のグリッド表示を作成する関数
function createGridView(forecasts, container) {
    // グリッドコンテナ
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'flex';
    gridContainer.style.flexWrap = 'wrap';
    gridContainer.style.justifyContent = 'space-between';
    gridContainer.style.gap = '15px';
    gridContainer.style.marginTop = '20px';
    
    forecasts.forEach(dayData => {
        try {
            // カード作成
            const dayCard = createDayCard(dayData, 'grid');
            dayCard.style.flex = '1';
            dayCard.style.minWidth = '150px';
            dayCard.style.maxWidth = 'calc(100% / 4 - 15px)'; // 4カラムまで
            dayCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            
            // ホバーエフェクト
            dayCard.addEventListener('mouseover', () => {
                dayCard.style.transform = 'translateY(-5px)';
                dayCard.style.boxShadow = '0 10px 20px rgba(76, 175, 80, 0.15)';
            });
            
            dayCard.addEventListener('mouseout', () => {
                dayCard.style.transform = 'translateY(0)';
                dayCard.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.1)';
            });
            
            gridContainer.appendChild(dayCard);
        } catch (err) {
            console.error('日ごとのカード作成中にエラーが発生しました:', err, dayData);
        }
    });
    
    container.appendChild(gridContainer);
}

// スマホサイズ用のスライドショーを作成する関数
function createSlideshow(forecasts, container) {
    // 外側のコンテナ（全体のサイズを固定）
    const outerContainer = document.createElement('div');
    outerContainer.style.maxWidth = '100%';
    outerContainer.style.margin = '20px auto';
    outerContainer.style.position = 'relative';
    
    // スライドカードのサンプルを作成してサイズを事前計算
    const sampleCard = createDayCard(forecasts[0], 'slide');
    sampleCard.style.position = 'absolute';
    sampleCard.style.visibility = 'hidden';
    sampleCard.style.zIndex = '-1';
    document.body.appendChild(sampleCard);
    
    // ドット（ページネーション）コンテナ
    const dotsContainer = document.createElement('div');
    dotsContainer.style.display = 'flex';
    dotsContainer.style.justifyContent = 'center';
    dotsContainer.style.margin = '15px 0 5px';
    dotsContainer.style.gap = '8px';
    
    // スライドの初期表示
    let currentSlide = 0;
    const totalSlides = forecasts.length;
    
    // スライド表示部分
    const slideView = document.createElement('div');
    slideView.style.width = '100%';
    slideView.style.borderRadius = '12px';
    slideView.style.backgroundColor = 'white';
    slideView.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.15)';
    slideView.style.overflow = 'hidden'; // 内容が収まらない場合は隠す
    slideView.style.height = '650px'; // 初期高さを十分に確保
    
    // レンダリング完了後に適切なサイズに調整
    setTimeout(() => {
        document.body.removeChild(sampleCard);
        // 実際の高さ+余裕を追加
        const actualHeight = Math.max(sampleCard.offsetHeight, 550) + 30;
        slideView.style.height = `${actualHeight}px`;
    }, 100);
    
    // 各スライドの内容を生成（最初は現在のスライドのみ表示）
    function renderCurrentSlide() {
        // スライドビューをクリア
        slideView.innerHTML = '';
        
        // 現在のスライド用のカードを作成
        const currentData = forecasts[currentSlide];
        const card = createDayCard(currentData, 'slide');
        card.style.padding = '20px';
        card.style.boxSizing = 'border-box';
        card.style.width = '100%';
        card.style.height = '100%';
        
        // スライドビューに追加
        slideView.appendChild(card);
        
        // ドットの状態を更新
        updateDots();
    }
    
    // 前へボタン
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '◀';
    prevButton.style.position = 'absolute';
    prevButton.style.left = '10px';
    prevButton.style.top = '50%';
    prevButton.style.transform = 'translateY(-50%)';
    prevButton.style.zIndex = '10';
    prevButton.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
    prevButton.style.color = 'white';
    prevButton.style.border = 'none';
    prevButton.style.borderRadius = '50%';
    prevButton.style.width = '40px';
    prevButton.style.height = '40px';
    prevButton.style.fontSize = '18px';
    prevButton.style.cursor = 'pointer';
    prevButton.style.display = 'flex';
    prevButton.style.justifyContent = 'center';
    prevButton.style.alignItems = 'center';
    prevButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    prevButton.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });
    
    prevButton.addEventListener('mouseover', () => {
        prevButton.style.backgroundColor = 'rgba(76, 175, 80, 1)';
    });
    
    prevButton.addEventListener('mouseout', () => {
        prevButton.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
    });
    
    // 次へボタン
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '▶';
    nextButton.style.position = 'absolute';
    nextButton.style.right = '10px';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.zIndex = '10';
    nextButton.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
    nextButton.style.color = 'white';
    nextButton.style.border = 'none';
    nextButton.style.borderRadius = '50%';
    nextButton.style.width = '40px';
    nextButton.style.height = '40px';
    nextButton.style.fontSize = '18px';
    nextButton.style.cursor = 'pointer';
    nextButton.style.display = 'flex';
    nextButton.style.justifyContent = 'center';
    nextButton.style.alignItems = 'center';
    nextButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    nextButton.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
    
    nextButton.addEventListener('mouseover', () => {
        nextButton.style.backgroundColor = 'rgba(76, 175, 80, 1)';
    });
    
    nextButton.addEventListener('mouseout', () => {
        nextButton.style.backgroundColor = 'rgba(76, 175, 80, 0.7)';
    });
    
    // ドットの作成
    const dots = [];
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = i === 0 ? '#4CAF50' : '#e0e0e0';
        dot.style.cursor = 'pointer';
        dot.style.transition = 'background-color 0.3s';
        
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        
        dots.push(dot);
        dotsContainer.appendChild(dot);
    }
    
    // スライド移動関数
    function goToSlide(index) {
        // 範囲外のインデックスを循環させる
        let newIndex = index;
        if (newIndex < 0) newIndex = totalSlides - 1;
        if (newIndex >= totalSlides) newIndex = 0;
        
        // 現在のスライドを更新
        currentSlide = newIndex;
        
        // 新しいスライド内容を描画
        renderCurrentSlide();
    }
    
    // ドットの更新
    function updateDots() {
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === currentSlide ? '#4CAF50' : '#e0e0e0';
        });
    }
    
    // タッチスワイプ機能
    let startX, endX;
    const threshold = 50; // スワイプを検出する閾値（ピクセル）
    
    slideView.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    slideView.addEventListener('touchmove', (e) => {
        if (!startX) return;
        endX = e.touches[0].clientX;
    });
    
    slideView.addEventListener('touchend', (e) => {
        if (!startX || !endX) return;
        const diff = endX - startX;
        
        if (Math.abs(diff) > threshold) {
            // 閾値を超えたスワイプを検出
            if (diff > 0) {
                // 右にスワイプ（前のスライド）
                goToSlide(currentSlide - 1);
            } else {
                // 左にスワイプ（次のスライド）
                goToSlide(currentSlide + 1);
            }
        }
        
        // リセット
        startX = null;
        endX = null;
    });
    
    // 要素を配置
    outerContainer.appendChild(slideView);
    outerContainer.appendChild(prevButton);
    outerContainer.appendChild(nextButton);
    container.appendChild(outerContainer);
    container.appendChild(dotsContainer);
    
    // 初期スライドを表示
    renderCurrentSlide();
    
    // 画面サイズ変更時の対応
    window.addEventListener('resize', () => {
        // 少し待機してからサイズ再調整
        setTimeout(() => {
            // 必要に応じてコンテナサイズを再調整できます
        }, 200);
    });
}

// 天気カードを作成する共通関数
function createDayCard(dayData, mode) {
    const isSlide = mode === 'slide';
    
    const dayCard = document.createElement('div');
    dayCard.style.backgroundColor = 'white';
    dayCard.style.borderRadius = '12px';
    dayCard.style.padding = isSlide ? '15px' : '15px';
    dayCard.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.1)';
    dayCard.style.textAlign = 'center';
    dayCard.style.height = '100%';
    dayCard.style.boxSizing = 'border-box';
    dayCard.style.display = 'flex';
    dayCard.style.flexDirection = 'column';
    
    // 曜日
    const weekday = dayData.date.toLocaleDateString('ja-JP', { weekday: 'short' });
    const dateHeader = document.createElement('h4');
    dateHeader.textContent = `${dayData.date.getMonth() + 1}/${dayData.date.getDate()} (${weekday})`;
    dateHeader.style.margin = '0 0 15px 0';
    dateHeader.style.fontSize = isSlide ? '18px' : '16px';
    dateHeader.style.fontWeight = '600';
    dateHeader.style.color = '#33691E'; // 濃い緑色
    dateHeader.style.borderBottom = '1px solid #E8F5E9';
    dateHeader.style.paddingBottom = '10px';
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
    
    // メインコンテンツ（flex: 1で高さを確保）
    const mainContent = document.createElement('div');
    mainContent.style.flex = '1';
    mainContent.style.display = 'flex';
    mainContent.style.flexDirection = 'column';
    mainContent.style.justifyContent = 'center';
    
    // 天気に応じた絵文字を表示
    const weatherEmoji = document.createElement('div');
    weatherEmoji.style.fontSize = isSlide ? '60px' : '50px';
    weatherEmoji.style.margin = '10px 0';
    weatherEmoji.style.textShadow = '0 3px 10px rgba(0,0,0,0.1)';
    
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
    
    mainContent.appendChild(weatherEmoji);
    
    // 天気の説明
    const weatherDiv = document.createElement('div');
    weatherDiv.textContent = mainWeather || '天気データなし';
    weatherDiv.style.fontSize = isSlide ? '18px' : '16px';
    weatherDiv.style.fontWeight = '500';
    weatherDiv.style.color = '#4CAF50';
    weatherDiv.style.margin = '0 0 15px 0';
    mainContent.appendChild(weatherDiv);
    
    // 最高・最低気温
    const temps = dayData.temps;
    if (temps && temps.length > 0) {
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        
        const tempDiv = document.createElement('div');
        
        if (isSlide) {
            // スライド用の大きめ表示
            tempDiv.style.display = 'flex';
            tempDiv.style.justifyContent = 'center';
            tempDiv.style.alignItems = 'center';
            tempDiv.style.gap = '20px';
            tempDiv.style.margin = '10px 0';
            
            const maxTempDiv = document.createElement('div');
            maxTempDiv.innerHTML = `<div style="font-size: 14px; color: #757575; margin-bottom: 5px;">最高</div>
                                   <div style="font-size: 24px; color: #FF5722; font-weight: bold;">${maxTemp.toFixed(1)}°C</div>`;
            
            const minTempDiv = document.createElement('div');
            minTempDiv.innerHTML = `<div style="font-size: 14px; color: #757575; margin-bottom: 5px;">最低</div>
                                   <div style="font-size: 24px; color: #2196F3; font-weight: bold;">${minTemp.toFixed(1)}°C</div>`;
            
            tempDiv.appendChild(maxTempDiv);
            tempDiv.appendChild(minTempDiv);
        } else {
            // グリッド用のコンパクト表示
            tempDiv.style.margin = '10px 0';
            tempDiv.innerHTML = `<span style="color: #FF5722; font-weight: bold; font-size: 18px;">${maxTemp.toFixed(1)}°C</span>
                               <span style="color: #757575; margin: 0 5px;">/</span>
                               <span style="color: #2196F3; font-weight: bold; font-size: 18px;">${minTemp.toFixed(1)}°C</span>`;
        }
        
        mainContent.appendChild(tempDiv);
    } else {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = '気温データなし';
        tempDiv.style.color = '#757575';
        tempDiv.style.margin = '10px 0';
        mainContent.appendChild(tempDiv);
    }
    
    // スマホ版スライドの場合は詳細情報も追加
    if (isSlide) {
        // 詳細情報テーブルの作成
        const detailsTable = document.createElement('div');
        detailsTable.style.width = '100%';
        detailsTable.style.marginTop = '20px';
        detailsTable.style.padding = '10px 0 0';
        detailsTable.style.borderTop = '1px dashed #E8F5E9';
        
        // 詳細情報グリッド
        const detailsGrid = document.createElement('div');
        detailsGrid.style.display = 'grid';
        detailsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        detailsGrid.style.gap = '10px';
        detailsGrid.style.width = '100%';
        
        // データ項目
        const detailItems = [];
        
        // 湿度の表示（平均値）
        if (dayData.humidity && dayData.humidity.length > 0) {
            const avgHumidity = dayData.humidity.reduce((sum, val) => sum + val, 0) / dayData.humidity.length;
            detailItems.push({
                label: '湿度',
                value: `${Math.round(avgHumidity)}%`,
                color: '#1976D2'
            });
        }
        
        // 風速の表示（平均値）
        if (dayData.wind && dayData.wind.length > 0) {
            const avgWind = dayData.wind.reduce((sum, val) => sum + val, 0) / dayData.wind.length;
            detailItems.push({
                label: '風速',
                value: `${avgWind.toFixed(1)}m/s`,
                color: '#43A047'
            });
        }
        
        // 気圧の表示（平均値）
        if (dayData.pressure && dayData.pressure.length > 0) {
            const avgPressure = dayData.pressure.reduce((sum, val) => sum + val, 0) / dayData.pressure.length;
            detailItems.push({
                label: '気圧',
                value: `${Math.round(avgPressure)}hPa`,
                color: '#7B1FA2'
            });
        }
        
        // 詳細項目を追加
        detailItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.textAlign = 'center';
            itemDiv.innerHTML = `
                <div style="color: #757575; font-size: 13px;">${item.label}</div>
                <div style="color: ${item.color}; font-weight: 500; font-size: 16px;">${item.value}</div>
            `;
            detailsGrid.appendChild(itemDiv);
        });
        
        detailsTable.appendChild(detailsGrid);
        mainContent.appendChild(detailsTable);
    }
    
    dayCard.appendChild(mainContent);
    
    // PCサイズ用の詳細情報エリア（スライドショーでない場合のみ）
    if (!isSlide) {
        const detailsContainer = document.createElement('div');
        detailsContainer.style.marginTop = 'auto'; // 下部に配置
        detailsContainer.style.padding = '10px 5px 0';
        detailsContainer.style.borderTop = '1px dashed #E8F5E9';
        detailsContainer.style.display = 'flex';
        detailsContainer.style.justifyContent = 'space-around';
        
        // 湿度の表示（平均値）
        if (dayData.humidity && dayData.humidity.length > 0) {
            const avgHumidity = dayData.humidity.reduce((sum, val) => sum + val, 0) / dayData.humidity.length;
            const humidityDiv = document.createElement('div');
            humidityDiv.style.textAlign = 'center';
            const fontSize = '12px';
            const valueFontSize = '14px';
            humidityDiv.innerHTML = `<div style="color: #757575; font-size: ${fontSize};">湿度</div>
                                   <div style="color: #1976D2; font-weight: 500; font-size: ${valueFontSize};">${Math.round(avgHumidity)}%</div>`;
            detailsContainer.appendChild(humidityDiv);
        }
        
        // 風速の表示（平均値）
        if (dayData.wind && dayData.wind.length > 0) {
            const avgWind = dayData.wind.reduce((sum, val) => sum + val, 0) / dayData.wind.length;
            const windDiv = document.createElement('div');
            windDiv.style.textAlign = 'center';
            const fontSize = '12px';
            const valueFontSize = '14px';
            windDiv.innerHTML = `<div style="color: #757575; font-size: ${fontSize};">風速</div>
                               <div style="color: #43A047; font-weight: 500; font-size: ${valueFontSize};">${avgWind.toFixed(1)}m/s</div>`;
            detailsContainer.appendChild(windDiv);
        }
        
        // 気圧の表示（平均値）
        if (dayData.pressure && dayData.pressure.length > 0) {
            const avgPressure = dayData.pressure.reduce((sum, val) => sum + val, 0) / dayData.pressure.length;
            const pressureDiv = document.createElement('div');
            pressureDiv.style.textAlign = 'center';
            const fontSize = '12px';
            const valueFontSize = '14px';
            pressureDiv.innerHTML = `<div style="color: #757575; font-size: ${fontSize};">気圧</div>
                                   <div style="color: #7B1FA2; font-weight: 500; font-size: ${valueFontSize};">${Math.round(avgPressure)}hPa</div>`;
            detailsContainer.appendChild(pressureDiv);
        }
        
        dayCard.appendChild(detailsContainer);
    }
    
    return dayCard;
}
