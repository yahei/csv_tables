// LocalStorage機能を使ってjson形式でデータを保存する関数

// データ書き込み
function writeToLocalStorage(dbname, key, value) {
  if (!window.localStorage) return;

  // json読み出し、無ければ空のJSONオブジェクトを作る
  try {
    // localStorageにキーが無かった場合はnullとなる
    // JSON.parse(null)の戻り値はnull
    json = JSON.parse(window.localStorage.getItem(dbname));
    if (!json) json = {};
  }
  catch(e) {
    // jsonとして読めなかった場合
    json = {};
  }

  // キーと値を書き込む/値が空なら消す
  if (value.length > 0) {
    json[key] = value;
  } else {
    delete json[key];
  }

  // localStorageを更新/全て空なら消す
  if (JSON.stringify(json) == '{}') {
    window.localStorage.removeItem(dbname);
  } else {
    window.localStorage.setItem(dbname, JSON.stringify(json));
  }
}

// データ削除
function deleteToLocalStorage(dbname, key) {
  if (!window.localStorage) return;

  // json読み出し
  try {
    // localStorageにキーが無かった場合はnullとなる
    // JSON.parse(null)の戻り値はnull
    json = JSON.parse(window.localStorage.getItem(dbname));
    if (!json) return;
  }
  catch(e) {
    // jsonとして読めなかった場合
    return;
  }

  // キーを削除
  delete json[key];

  // localStorageを更新
  window.localStorage.setItem(dbname, JSON.stringify(json));
}

// データ読み出し
function readToLocalStorage(dbname, key) {
  if (!window.localStorage) return null;

  // json読み出し
  try {
    // localStorageにキーが無かった場合はnullとなる
    // JSON.parse(null)の戻り値はnull
    json = JSON.parse(window.localStorage.getItem(dbname));
    if (!json) return null;
  }
  catch(e) {
    // jsonとして読めなかった場合
    return null;
  }

  // 指定されたキーを返す(無かったらundefined)
  return json[key];
}
