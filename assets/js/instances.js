import * as U from './utilities.js';
import * as C from './constants.js';

const instances = {
	main_window: null,                     // メインウィンドウのラッパー要素への参照
	modal_window: null,                    // モーダルウィンドウのラッパー要素への参照
	map_biome: C.BIOME_PLAINS,             // バイオーム
	count_wrapper: null,                   //
	count_elm: {},                         //
	map_wrapper: null,                     // マップテーブルのコンテナ要素への参照
	map_cell: null,                        // Cellオブジェクトを格納するための二次元配列 map_cell[y][x]で取り出す
	map_elm: null,                         // マップテーブルの<table><tr><td>要素への参照を格納するための辞書
	save_data: {                           // セーブデータ
		file: {},                          // * ファイルを格納するための辞書
		last_file_key: null,               // * 最後に扱ったファイル 次回起動時の読み込みに使う
		embed_option: {                    // 埋め込みオプション
			embed_size: 'cell-size',       // * マスの大きさを固定するか全体の横幅を固定するか
			map_size: 800,                 // * 全体の横幅
			cell_size: 32,                 // * マスの大きさ
		},
		download_image_option: {           // 画像保存オプション
			cell_size: 64,                 // * マスの大きさ
			map_size: 800,                 // * 全体の横幅
			type: 'png',                   // * 画像形式
			quality: 0.8,                  // * 品質
		},
		option: {                          // その他のオプション
			is_enabled_count: false,       // * カウンターが有効か
			is_enabled_grid: false,        // * グリッドが有効か
		},
	},
	current_file_key: null,                // 現在扱っているファイルのキー 上書き保存に使う 未保存のデータやオートセーブのデータの場合はnull
	is_autosave_enabled: true,             // オートセーブが有効かどうか 一時的にオフにしたい場合はfalseにする
	autosave_timer: null,                  // オートセーブのためのsetTimeoutの戻り値を格納しておく変数
	autosave_timer_sub: null,              // サブのタイマー
	is_saved: true,                        // セーブされたか
	state_save_data: {},                   // F1～F8でステートセーブ
	image_cache: {},                       // 読み込んだ画像を格納する辞書
	url_queries: U.get_queries(),          // URLクエリパラメータを格納する辞書
	lang_key: U.get_lang_key(),            // 言語キー 'ja' または 'en'
	mouse_state: {                         // マウスの状態
		is_down: false,                    // * マウスボタンが押下されているならば真
		current_palette_item: null,        // * 現在選択されているパレット
		current_palette_type: 'land',      // * パレットの種類 'land' 'resource' または 'mine'
		last_put_cell: null,               // * 最後に物を配置したセル
		last_move_cell: null,              // * 最後にマウスを動かしたときにマウスが乗っていたセル
		changed: false,                    // * 
	},
	key_state: {},                         // キーボードの押下状態を格納するための辞書 たとえばkey_state['Shift']
	last_highlight_cell: null,             // 最後にハイライトしたセル
	route_highlight_cells: [],             // ルートハイライトのセルを格納しておく配列
};

export { instances as default };