// テーブルを作る
// reverse: 現在これで順ソート中で、もう一度クリックされたら逆順ソートになる
function make_table(tb_head, tb_body, reverse="") {
  // 結果格納変数
  var table = document.createElement('table');
  thead = document.createElement('thead');
  tbody = document.createElement('tbody');
  table.appendChild(thead);
  table.appendChild(tbody);

  // 凡例
  tr = thead.appendChild(document.createElement('tr'));
  tb_head.forEach(elem => {
    th = document.createElement('th');
    th.innerText = elem;
    tr.appendChild(th);
    // クリックされたらソートする
    th.onclick = () => {sort_table(tb_head, tb_body, elem, elem!=reverse, table)};
  })

  // データ
  tb_body.forEach(row => {
    tr = tbody.appendChild(document.createElement('tr'));
    row.forEach(elem => {
      th = document.createElement('th');
      th.innerText = elem;
      tr.appendChild(th);
    })
  });

  return table;
}

// ソートボタンが押された時の処理
function sort_table(tb_head, tb_body, sort_key, order, old_table) {
  // sort_keyは凡例の名前で渡されるので、何番目か調べる
  sort_index = tb_head.indexOf(sort_key);
  
  // ソート
  tb_body = sort_matrix(tb_body, sort_index, order);

  // 新しいテーブルを作る
  new_table = make_table(tb_head, tb_body, order ? sort_key : "");

  // テーブルの中身を置き換える
  old_table.replaceChildren(new_table);
}

// 配列の配列を指定した列でソート
function sort_matrix(matrix, sort_index, order=true) {
  sign = order ? 1 : -1;
  
  matrix = matrix.sort((a,b) => {
    // どちらも非数なら文字列として比較
    if (isNaN(a[sort_index]) && isNaN(b[sort_index]))
      return (b[sort_index] >= a[sort_index]) ? sign :-sign;
    
    // 一方が非数なら、数の方が0以上なら数の方が大きいとする
    //if (isNaN(a[sort_index])) return b[sort_index] >= 0 ? sign :-sign;
    //if (isNaN(b[sort_index])) return a[sort_index] >= 0 ?-sign : sign;
    
    // 一方が非数なら、数の方が大きいとする
    if (isNaN(a[sort_index])) return  1;
    if (isNaN(b[sort_index])) return -1;
    
    // どちらも数なら数として比較
    return sign * (b[sort_index] - a[sort_index]);
  });
  return matrix;
}

// 表の編集完了ボタン
function change_view_mode(div_id) {
  // --- 表の更新 ----
  // 指定された要素からcsv読み取り
  csv = document.getElementById(div_id).
        getElementsByClassName('edit')[0].
        getElementsByClassName('csv_field')[0].value;

  // csvを二次元配列にし、凡例とデータに分ける
  rows = csv.split(/\n/).map(row => {return row.split(",");});
  tb_head = rows[0];
  tb_body = rows.slice(1);

  // テーブルを作る
  new_table = make_table(tb_head, tb_body);

  // 指定されたdivのテーブルの中身を上書きする
  old_table = document.getElementById(div_id).
              getElementsByClassName('view')[0].
              getElementsByClassName('table')[0];
  old_table.replaceChildren(new_table);

  // --- タイトルの更新 ---
  // 入力されたタイトルを読み取る
  new_title = document.getElementById(div_id).
              getElementsByClassName('edit')[0].
              getElementsByClassName('title')[0].value;

  // viewのタイトルを更新する
  document.getElementById(div_id).
  getElementsByClassName('view')[0].
  getElementsByClassName('title')[0].innerHTML = new_title;


  // edit画面を非表示にし、view画面を表示する
  document.getElementById(div_id).
    getElementsByClassName('edit')[0].style.display = 'none';
  document.getElementById(div_id).
    getElementsByClassName('view')[0].style.display = 'block';
}

// 表の削除ボタン
function delete_table(table_id) {
  if (confirm("この表を削除します。")) document.getElementById(table_id).remove();
}

// 表の編集ボタン
function change_edit_mode(div_id) {
  // edit画面を表示し、view画面を非表示にする
  document.getElementById(div_id).
    getElementsByClassName('edit')[0].style.display = 'block';
  document.getElementById(div_id).
    getElementsByClassName('view')[0].style.display = 'none';
}

// ランダムなidを作る
function gen_table_id() {
  return "table_" + Math.floor(Math.random()*(16**8)).toString(16);
}

// 表の追加ボタン
function add_new_table(table_id=gen_table_id(), csv='', title='') {
  // 要素を作る
  new_div = document.createElement('div');
  new_div.innerHTML = `
      <div id="${table_id}" class="table_unit" comment="これ1つが表1つぶん">
        <div class="edit" comment="csvの入力などの編集画面">
          <input type="text" value="${title}" class="title" placeholder="表のタイトル">
          <textarea class="csv_field" placeholder="csvをここに入力">${csv}</textarea><br>
          <input type="button" value="編集完了" onclick="change_view_mode('${table_id}'); save_tables();">
          <input type="button" value="表を削除" onclick="delete_table('${table_id}'); save_tables();">
        </div>
        <div class="view" comment="テーブルを表示する画面">
          <div class="title" comment="表のタイトル">${title}</div>
          <div class="table" comment="表の本体"></div>
          <input type="button" value="表を編集" onclick="change_edit_mode('${table_id}');">
        </div>
      </div>`;

  // 要素を追加
  document.getElementById('tables').appendChild(new_div.firstElementChild);
}

// 表のセーブ
function save_tables() {
  // セーブするjsonを作る
  json = [];
  tables = Array.from(
    document.getElementById('tables').
    getElementsByClassName('table_unit'));
  
  tables.forEach(elem => {
    table_id = elem.id
    csv = elem.getElementsByClassName('edit')[0].
          getElementsByClassName('csv_field')[0].value;
    title = elem.getElementsByClassName('edit')[0].
            getElementsByClassName('title')[0].value;
    json.push({'id':elem.id, 'csv':csv, 'title':title});
  });

  // 保存
  writeToLocalStorage('csv_tables', getGET()['name'], json);
}

// 表のロード
function load_tables() {
  // jsonをロードする
  json = readToLocalStorage('csv_tables', getGET()['name']);
  if (!json) return;

  // 表を復元する
  json.forEach(elem => {
    add_new_table(elem['id'], elem['csv'], elem['title']);
    change_view_mode(elem['id']);
  });
}

// getパラメータを取得して連想配列にする
function getGET() {
  params = {};

  window.location.search.substring(1).split('&').forEach(x => {
    y = x.split('=');
    params[y[0]] = decodeURIComponent(y[1]);
  });

  return params;
}

// ページを開いたときの処理
function init() {
  // タイトル
  title = getGET()['name'] ? getGET()['name'] : '無題';
  document.title = title;
  document.getElementById('name').innerHTML = title;

  // セーブデータのロード
  load_tables();
}