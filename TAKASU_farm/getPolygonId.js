// ポリゴンIDを取得するスクリプト
// ブラウザのコンソールにコピーして実行してください

// APIキー - 実際のAPIキーに置き換えてください
const apiKey = 'b89c50b7546d536cc1464deb65b0656c';

// ポリゴン一覧を取得するAPI
fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${apiKey}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('あなたのポリゴン一覧:');
    
    // ポリゴンがない場合
    if (data.length === 0) {
      console.log('ポリゴンが見つかりません。先にポリゴンを作成してください。');
      return;
    }
    
    // 各ポリゴンの情報を表示
    data.forEach((polygon, index) => {
      console.log(`ポリゴン ${index + 1}:`);
      console.log(`  名前: ${polygon.name || '名前なし'}`);
      console.log(`  ID: ${polygon.id}`);  // これがポリゴンIDです
      console.log(`  面積: ${polygon.area} ha`);
      console.log('---');
    });
    
    // TAKASUという名前のポリゴンを探す
    const takasuPolygon = data.find(p => p.name && p.name.includes('TAKASU'));
    if (takasuPolygon) {
      console.log('TAKASUポリゴンが見つかりました！');
      console.log(`TAKASU ポリゴンID: ${takasuPolygon.id}`);
      
      // takasuWeather.jsで使用するための書式でIDを表示
      console.log('\nこの行を takasuWeather.js にコピーしてください:');
      console.log(`const polygonId = '${takasuPolygon.id}'; // TAKASUポリゴンのID`);
    }
  })
  .catch(error => {
    console.error('エラーが発生しました:', error);
    console.log('APIキーが正しいか確認してください。');
  }); 