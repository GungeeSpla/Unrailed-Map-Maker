(() => {

	/** 定数定義
	 */
	const VERSION = '1.2b'
	const DEFAULT_WIDTH  = 40;
	const DEFAULT_HEIGHT = 20;
	const AUTOSAVE_DELAY = 1000;

	const BIOME_PLAINS = 'plains';
	const BIOME_DESERT = 'desert';
	const BIOME_SNOW   = 'snow';
	const BIOME_HELL   = 'hell';
	const BIOME_SPACE  = 'space';
	const BIOME_MARS   = 'mars';

	const LAND_NONE      = 'none';
	const LAND_PLAIN     = 'plain';
	const LAND_WATER     = 'water';
	const LAND_IRON      = 'iron';
	const LAND_TREE      = 'tree';
	const LAND_ROCK      = 'rock';
	const LAND_BRIDGE    = 'bridge';
	const LAND_STEAM     = 'steam';
	const LAND_THORN     = 'thorn';
	const LAND_STATION_L = 'station-l';
	const LAND_STATION_R = 'station-r';
	const LAND_STATION_F = 'station-f';
	const LAND_COLOR     = 'color';
	const LAND_COLOR_1    = 'color-1';
	const LAND_COLOR_2    = 'color-2';
	const LAND_COLOR_3    = 'color-3';
	const LAND_COLOR_4    = 'color-4';
	const LAND_COLOR_5    = 'color-5';
	const LAND_COLOR_6    = 'color-6';
	const LAND_COLOR_7    = 'color-7';
	const LAND_COLOR_8    = 'color-8';
	const LAND_COLOR_9    = 'color-9';
	const LAND_COLOR_10   = 'color-10';

	const RESOURCE_NONE         = 'none';
	const RESOURCE_C_RAIL       = 'c-rail';
	const RESOURCE_RAIL         = 'rail';
	const RESOURCE_WOOD         = 'resource-wood';
	const RESOURCE_IRON         = 'resource-iron';
	const RESOURCE_DYNAMITE_1   = 'resource-dynamite-1';
	const RESOURCE_DYNAMITE_2   = 'resource-dynamite-2';
	const RESOURCE_DYNAMITE_3   = 'resource-dynamite-3';
	const RESOURCE_DYNAMITE_4   = 'resource-dynamite-4';
	const RESOURCE_DYNAMITE_5   = 'resource-dynamite-5';
	const RESOURCE_DYNAMITE_6   = 'resource-dynamite-6';
	const RESOURCE_DYNAMITE_7   = 'resource-dynamite-7';
	const RESOURCE_DYNAMITE_8   = 'resource-dynamite-8';
	const RESOURCE_DYNAMITE_9   = 'resource-dynamite-9';
	const RESOURCE_BACKET       = 'resource-backet';
	const RESOURCE_BACKET_EMPTY = 'resource-backet-empty';
	const RESOURCE_AXE          = 'resource-axe';
	const RESOURCE_PICKAXE      = 'resource-pickaxe';
	const RESOURCE_BOLT         = 'resource-bolt';
	const RESOURCE_ERASER       = 'resource-eraser';
	const RESOURCE_FACE         = 'resource-face';
	const RESOURCE_SYMBOL       = 'resource-symbol';

	const SYMBOL_ERASER         = 'symbol-eraser';
	const SYMBOL_SYMBOL         = 'symbol-symbol';
	const SYMBOL_NONE           = 'symbol-none';

	const MINE_AXE      = 'mine-axe-and-pickaxe';
	const MINE_DYNAMITE = 'mine-dynamite';

	const PALETTE_SELECT_LAND     = 'land';
	const PALETTE_SELECT_RESOURCE = 'resource';
	const PALETTE_SELECT_SYMBOL   = 'symbol';
	const PALETTE_SELECT_MINE     = 'mine';

	const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	const DIR_NONE = -1;
	const DIR_TOP = 0;
	const DIR_RIGHT = 1;
	const DIR_BOTTOM = 2;
	const DIR_LEFT = 3;

	/** 定数定義 - ダイナマイト
	 */
	const DYNAMITE_RANGE_STR_DEF = {
		'○': 3,
		'■': 3,
		'１': 2,
		'２': 1,
		'３': 0,
	};
	const DYNAMITE_RANGE_STR = [
		`
		■■■
		■○■
		■■■
		`,`
		１１■１１
		１■■■１
		■■○■■
		１■■■１
		１１■１１
		`,`
		３２■■■２３
		２■■■■■２
		■■■■■■■
		■■■○■■■
		■■■■■■■
		２■■■■■２
		３２■■■２３
		`,`
		３３■■■■■３３
		３■■■■■■■３
		■■■■■■■■■
		■■■■■■■■■
		■■■■○■■■■
		■■■■■■■■■
		■■■■■■■■■
		３■■■■■■■３
		３３■■■■■３３
		`,`
		３３■■■■■■■３３
		３■■■■■■■■■３
		■■■■■■■■■■■
		■■■■■■■■■■■
		■■■■■■■■■■■
		■■■■■○■■■■■
		■■■■■■■■■■■
		■■■■■■■■■■■
		■■■■■■■■■■■
		３■■■■■■■■■３
		３３■■■■■■■３３
		`,`
		３３３■■■■■■■３３３
		３３■■■■■■■■■３３
		３■■■■■■■■■■■３
		■■■■■■■■■■■■■
		■■■■■■■■■■■■■
		■■■■■■■■■■■■■
		■■■■■■○■■■■■■
		■■■■■■■■■■■■■
		■■■■■■■■■■■■■
		■■■■■■■■■■■■■
		３■■■■■■■■■■■３
		３３■■■■■■■■■３３
		３３３■■■■■■■３３３
		`,`
		３３３３■■■■■■■３３３３
		３３■■■■■■■■■■■３３
		３■■■■■■■■■■■■■３
		３■■■■■■■■■■■■■３
		■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■
		■■■■■■■○■■■■■■■
		■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■
		３■■■■■■■■■■■■■３
		３■■■■■■■■■■■■■３
		３３■■■■■■■■■■■３３
		３３３３■■■■■■■３３３３
		`,`
		３３３３■■■■■■■■■３３３３
		３３３■■■■■■■■■■■３３３
		３３■■■■■■■■■■■■■３３
		３■■■■■■■■■■■■■■■３
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■○■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■
		３■■■■■■■■■■■■■■■３
		３３■■■■■■■■■■■■■３３
		３３３■■■■■■■■■■■３３３
		３３３３■■■■■■■■■３３３３
		`,`
		３３３３３■■■■■■■■■３３３３３
		３３３３■■■■■■■■■■■３３３３
		３３■■■■■■■■■■■■■■■３３
		３３■■■■■■■■■■■■■■■３３
		３■■■■■■■■■■■■■■■■■３
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■○■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		■■■■■■■■■■■■■■■■■■■
		３■■■■■■■■■■■■■■■■■３
		３３■■■■■■■■■■■■■■■３３
		３３■■■■■■■■■■■■■■■３３
		３３３３■■■■■■■■■■■３３３３
		３３３３３■■■■■■■■■３３３３３
		`,
	];
	const DYNAMITE_RANGE = (() => {
		const dynamite_range = [];
		DYNAMITE_RANGE_STR.forEach((str) => {
			let y = 0;
			const range = [];
			str.split('\n').forEach((line) => {
				const trim = line.trim();
				if (trim) {
					range[y] = [];
					for (let x = 0; x < trim.length; x++) {
						const c = trim.charAt(x);
						const power = DYNAMITE_RANGE_STR_DEF[c];
						range[y][x] = power;
					}
					y++;
				}
			});
			dynamite_range.push(range);
		});
		return dynamite_range;
	})();

	/** 定数定義 - 言語
	 */
	const LANG_DEF = `
	palette-none|未生成|None
	palette-plain|平地|Plain
	palette-water|水|Water
	palette-iron|鉄|Iron
	palette-tree|木|Wood
	palette-color|色|Color
	palette-rock|黒岩|Black Rock
	palette-bridge|橋|Bridge
	palette-station-l|駅|Station
	palette-station-f|柵|Fence
	palette-c-rail|接続された線路|Connected Rail
	palette-rail|線路|Rail
	palette-color-1|色|Color
	palette-resource-bolt|ボルト|Bolt
	palette-resource-wood|木材|Wood
	palette-resource-iron|鉄材|Iron
	palette-resource-dynamite-1|ダイナマイト Lv1|Dynamite Lv1
	palette-resource-dynamite-2|ダイナマイト Lv2|Dynamite Lv2
	palette-resource-dynamite-3|ダイナマイト Lv3|Dynamite Lv3
	palette-resource-dynamite-4|ダイナマイト Lv4|Dynamite Lv4
	palette-resource-dynamite-5|ダイナマイト Lv5|Dynamite Lv5
	palette-resource-dynamite-6|ダイナマイト Lv6|Dynamite Lv6
	palette-resource-dynamite-7|ダイナマイト Lv7|Dynamite Lv7
	palette-resource-dynamite-8|ダイナマイト Lv8|Dynamite Lv8
	palette-resource-dynamite-9|ダイナマイト Lv9|Dynamite Lv9
	palette-resource-backet|バケツ|Backet
	palette-resource-backet-empty|バケツ(空)|Backet (empty)
	palette-resource-axe|斧|Axe
	palette-resource-pickaxe|つるはし|Pickaxe
	palette-resource-eraser|消しゴム(アイテムを消す)|Eraser (Remove Items)
	palette-resource-face|キャラクター|Character
	palette-symbol-eraser|消しゴム(記号を消す)|Eraser
	palette-symbol-symbol|記号|Symbol
	palette-mine-axe-and-pickaxe|斧とつるはしで採掘する|Mine with axe and pickaxe
	palette-mine-dynamite|ダイナマイトで採掘する|Mine with dynamite
	toolbar-help|ヘルプ|Help
	toolbar-file|ファイル|File
	toolbar-save|保存|Save
	toolbar-save-as|名前を付けて保存|Save As
	toolbar-load|読み込む|Load
	toolbar-open|開く|Open
	toolbar-new|新規作成|New
	toolbar-grounds|地形|Grounds
	toolbar-items|アイテム|Items
	toolbar-symbols|記号|Symbols
	toolbar-mine-tools|採掘ツール|Mine Tools
	toolbar-map-size|マップサイズ|Map Size
	toolbar-grid|罫線|Grid
	toolbar-count|カウンター|Counter
	toolbar-download-image|画像を保存|Download Image
	toolbar-share|共有|Share
	toolbar-share-url|共有URL|Share URL
	toolbar-embed-tag|埋め込み用タグ|Embet Tag
	toolbar-copy|コピー|Copy
	toolbar-close|閉じる|Close
	toolbar-delete|削除|Delete
	toaster-init|Unrailed! Map Maker Ver.{num} へようこそ！|Welcome to Unrailed! Map Maker Ver.{num}!
	toaster-load-share-url|共有URLのデータを読み込みました。|Loaded the data from the shared URL.
	toaster-success-copy|コピーしました！|Copied!
	toaster-success-save|保存しました！|Saved!
	toaster-success-load|ロードしました！|Opened!
	toaster-success-new|新規作成しました。|Created new file.
	toaster-success-save-state|スロット[{num}]に一時保存しました。|Temporarily saved in slot {num}.
	toaster-success-load-state|スロット[{num}]をロードしました。|Slot {num} is loaded.
	toaster-success-load-state-error|スロット[{num}]にデータがありません。|No data in slot {num}.
	count-wood|木の数|Wood
	count-iron|鉄の数|Iron
	count-r-wood|木(資材)の数|Woods (Material)
	count-r-iron|鉄(資材)の数|Irons (Material)
	count-r-rail|線路(資材)の数|Rails (Material)
	count-c-rail|接続された線路の数|Rails (Connected)
	count-bridge|橋の数|Bridges
	count-sup|※駅の下3マスを除く|Excluding under stations.
	open-table-title|ファイル名|Title
	open-table-created|作成日時|Created
	open-table-modified|更新日時|Modified
	open-table-open|開く|Open
	open-table-delete|削除|Delete
	confirm-delete|「{name}」を削除します。よろしいですか？|Delete "{name}". Are you sure?
	confirm-new|現在編集中の内容は失われます。よろしいですか？|Any content currently being edited will be lost. Are you sure?
	`;
	const LANG = (() => {
		const lang = {};
		const lines = LANG_DEF.split('\n');
		lines.forEach((line) => {
			const trim = line.trim();
			if (!trim) {
				return;
			}
			const values = trim.split('|');
			lang[values[0].trim()] = {
				ja: values[1].trim(),
				en: values[2].trim()
			};
		});
		return lang;
	})();

	/** インスタンス
	 */
	let main_window;                      // メインウィンドウのラッパー要素への参照
	let modal_window;                     // モーダルウィンドウのラッパー要素への参照
	let map_biome = BIOME_PLAINS;         // バイオーム
	let count_wrapper;                    //
	let count_elm = {};                   //
	let map_wrapper;                      // マップテーブルのコンテナ要素への参照
	let map_cell;                         // Cellオブジェクトを格納するための二次元配列 map_cell[y][x]で取り出す
	let map_elm;                          // マップテーブルの<table><tr><td>要素への参照を格納するための辞書
	let mouse_state = {                   // マウスの状態
		is_down: false,                   // * マウスボタンが押下されているならば真
		current_palette_item: LAND_PLAIN, // * 現在選択されているパレット
		current_palette_type: 'land',     // * パレットの種類 'land' 'resource' または 'mine'
		last_put_cell: null,              // * 最後に物を配置したセル
		last_move_cell: null,             // * 最後にマウスを動かしたときにマウスが乗っていたセル
	};
	let key_state = {};                   // キーボードの押下状態を格納するための辞書 たとえばkey_state['Shift']
	let last_highlight_cell = null;       // 最後にハイライトしたセルを記憶しておいて処理の省略に役立てる
	let route_highlight_cells = [];       // ルートハイライトのセルを格納する配列
	let save_data = {                     // セーブデータ
		file: {},                         // * ファイルを格納するための辞書
		last_file_key: null,              // * 最後に扱ったファイル 次回起動時の読み込みに使う
		embed_option: {                   // 埋め込みオプション
			embed_size: 'cell-size',      // マスの大きさを固定するか全体の横幅を固定するか
			map_size: 800,                // 全体の横幅
			cell_size: 32,                // マスの大きさ
		},
		download_image_option: {          // 画像保存オプション
			cell_size: 64,                // マスの大きさ
			map_size: 800,                // 全体の横幅
			type: 'png',                  // 画像形式
			quality: 0.8,                 // 品質
		},
		option: {                         //
			is_enabled_count: false,      //
			is_enabled_grid: false,       //
		},
	};
	let current_file_key = null;          // 現在扱っているファイルのキー 上書き保存に使う 未保存のデータやオートセーブのデータの場合はnull
	let is_autosave_enabled = true;       // オートセーブが有効かどうか 一時的にオフにしたい場合はfalseにする
	let autosave_timer;                   // オートセーブのためのsetTimeoutの戻り値を格納しておく変数
	let autosave_timer_sub;               // サブのタイマー
	let is_saved = true;                  // セーブされたか
	const state_save_data = {};           // F1～F8でステートセーブ
	const image_cache = {};               // 読み込んだ画像を格納する辞書
	const url_queries = get_queries();    // URLクエリパラメータを格納する辞書
	const lang_key = get_lang_key();      // 言語キー 'ja' または 'en'


	/** Cell
	 */
	class Cell {

		/** constructor(x, y, def)
		 */
		constructor(x, y, def) {
			this.x = x;
			this.y = y;
			this.td = create_elm('td');
			this.td.cell = this;
			this.resource_elm = create_elm('div.resource').appendTo(this.td);
			this.symbol_elm = create_elm('div.symbol').appendTo(this.td);
			this.highlight_elm = create_elm('div.highlight').appendTo(this.td);
			this.resource_count_elm = create_elm('p.count').appendTo(this.td);
			this.life = 3;
			this.land_type = LAND_PLAIN;
			this.resource_type = RESOURCE_NONE;
			this.symbol_type = SYMBOL_NONE;
			this.rail_dir = {
				from: DIR_NONE,
				to: DIR_NONE,
			};
			if (def) {
				switch (def.land_char) {
				case 'a': this.land_type = LAND_NONE; break;
				case 'b': this.land_type = LAND_PLAIN; break;
				case 'c': this.land_type = LAND_STATION_L; break;
				case 'd': this.land_type = LAND_STATION_R; break;
				case 'e': this.land_type = LAND_STATION_F; break;
				case 'f': this.land_type = LAND_TREE; break;
				case 'g': this.land_type = LAND_TREE; this.life = 2; break;
				case 'h': this.land_type = LAND_TREE; this.life = 1; break;
				case 'i': this.land_type = LAND_TREE; this.life = 0; break;
				case 'j': this.land_type = LAND_TREE; this.life = 0; this.resource_type = RESOURCE_WOOD; break;
				case 'k': this.land_type = LAND_IRON; break;
				case 'l': this.land_type = LAND_IRON; this.life = 2; break;
				case 'm': this.land_type = LAND_IRON; this.life = 1; break;
				case 'n': this.land_type = LAND_IRON; this.life = 0; break;
				case 'o': this.land_type = LAND_IRON; this.life = 0; this.resource_type = RESOURCE_IRON; break;
				case 'p': this.land_type = LAND_ROCK; break;
				case 'q': this.land_type = LAND_WATER; break;
				case 'r': this.land_type = LAND_BRIDGE; break;
				case 's': this.land_type = LAND_STEAM; break;
				case 't': this.land_type = LAND_THORN; break;
				case 'u': this.land_type = LAND_COLOR_1.replace('1', def.land_num); break;
				}
				switch (def.resource_char) {
				case 'A': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_LEFT,   to: DIR_RIGHT  }; this.update_rail(); break;
				case 'B': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_TOP,	to: DIR_BOTTOM }; this.update_rail(); break;
				case 'C': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_TOP,	to: DIR_RIGHT  }; this.update_rail(); break;
				case 'D': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_RIGHT,  to: DIR_BOTTOM }; this.update_rail(); break;
				case 'E': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_BOTTOM, to: DIR_LEFT   }; this.update_rail(); break;
				case 'F': this._resource_type = RESOURCE_C_RAIL; this.td.setAttribute('resource-type',  RESOURCE_C_RAIL); this.rail_dir = { from: DIR_TOP,	to: DIR_LEFT   }; this.update_rail(); break;
				case 'G': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_LEFT,   to: DIR_RIGHT  }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'H': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_TOP,	to: DIR_BOTTOM }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'I': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_TOP,	to: DIR_RIGHT  }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'J': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_RIGHT,  to: DIR_BOTTOM }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'K': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_BOTTOM, to: DIR_LEFT   }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'L': this._resource_type = RESOURCE_RAIL;   this.td.setAttribute('resource-type',  RESOURCE_RAIL);   this.rail_dir = { from: DIR_TOP,	to: DIR_LEFT   }; this.update_rail(); if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'M': this.resource_type = RESOURCE_WOOD; if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'N': this.resource_type = RESOURCE_IRON; if (def.resource_count) this.resource_count = def.resource_count; break;
				case 'O': this.resource_type = RESOURCE_AXE; break;
				case 'P': this.resource_type = RESOURCE_PICKAXE; break;
				case 'Q': this.resource_type = RESOURCE_BACKET; break;
				case 'R': this.resource_type = RESOURCE_BACKET_EMPTY; break;
				case 'S': this.resource_type = RESOURCE_DYNAMITE_1.replace('1', def.resource_count || 1); break;
				case 'T': this._resource_type = RESOURCE_FACE; this.td.setAttribute('resource-type',  RESOURCE_FACE); this.td.setAttribute('face-id', def.resource_count); this.td.style.setProperty('--face-image', 'url(../img/face/face-'+def.resource_count+'.png)'); break;
				case 'U': this._resource_type = RESOURCE_SYMBOL; this.td.setAttribute('resource-type',  RESOURCE_SYMBOL); this.td.setAttribute('symbol-id', def.resource_count); this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+def.resource_count+'.png)'); break;
				case 'V': this.resource_type = RESOURCE_BOLT; break;
				}
				switch (def.symbol_char) {
				case 'X': this._symbol_type = SYMBOL_SYMBOL; this.td.setAttribute('symbol-type',  SYMBOL_SYMBOL); this.td.setAttribute('symbol-id', def.symbol_id); this.td.style.setProperty('--face-image', 'url(../img/face/face-'+def.symbol_id+'.png)'); break;
				}
			}
			this.set_event();
		}

		/** .set_event()
		 */
		set_event() {

			/** 右クリックメニューの削除
			 */
			this.td.oncontextmenu = () => { return false };

			/** マウスボタンが押されたとき
			 */
			this.td.addEventListener('mousedown', (e) => {

				// 左クリックか右クリックかで場合分け
				if (e.button === 0) {

					// 左クリック
					// 押されているキーによって場合分け
					if (key_state['Control']) {

						// コントロールキーが押されているなら塗りつぶし
						if (mouse_state.current_palette_type === PALETTE_SELECT_LAND) {
							fill(this.x, this.y, mouse_state.current_palette_item, this.land_type);
							onchange();
						}

					} else if (key_state['Shift'] || key_state['Alt']) {

						// シフトキーが押されているなら直線塗り
						route_highlight_cells.forEach((cell) => {
							cell.apply_palette();
						});
						highlight_reset();
						onchange();
						
					} else {

						// 何のキーも押されていないならここを塗る
						this.apply_palette();

					}

					// 最後に置いたセルを変更する
					mouse_state.last_put_cell = this;
					mouse_state.last_move_cell = this;

				} else if (e.button === 2) {

					// 右クリック
					if (this.land_type.includes(LAND_COLOR)) {
						const li = document.querySelector(`[land-type=${LAND_COLOR_1}]`);
						li.trigger('click');
						li.style.setProperty('background-image', `url(./assets/img/color/${this.land_type.replace('color-', '')}.png)`);
						
					} else {
						document.querySelector(`[land-type=${this.land_type}]`).trigger('click');
					}
					my_console.log(this);

				}

			}, { passive: false });

			/** マウスカーソルが侵入したとき
			 */
			this.td.addEventListener('mouseenter', (e) => {

				const last_move_cell_prev = mouse_state.last_move_cell;
				mouse_state.last_move_cell = this;

				// マウスボタンが押されているかどうかで場合分け
				if (mouse_state.is_down) {

					// マウスボタンが押されている(＝ドラッグ)場合
					// このマスの地形か物資を変更する
					const cells = get_straight_route(last_move_cell_prev, mouse_state.last_move_cell);
					if (cells && cells.length) {
						for (let i = 1; i < cells.length; i++) {
							const cell = cells[i];
							cell.apply_palette(true);
						}
					}
					highlight_mouse();

					// 最後に置いたセルを変更する
					mouse_state.last_put_cell = this;

				} else {

					// マウスボタンが押されていない場合
					if (mouse_state.current_palette_type === PALETTE_SELECT_MINE && mouse_state.current_palette_item === MINE_DYNAMITE) {
						const dynamite_level = parseInt(document.getElementById('mine-dynamite').getAttribute('dynamite-level'));
						highlight_dynamite(dynamite_level);
					} else if (key_state['Shift']) {
						highlight_route(false);
					} else if (key_state['Alt']) {
						highlight_route(true);
					} else {
						highlight_mouse();
					}

				}
			});

			/** マウスホイールを回したとき
			 */
			this.td.addEventListener('mousewheel', (e) => {
				e.preventDefault();
				const r = this.resource_type;
				if (r === RESOURCE_RAIL || r === RESOURCE_WOOD || r === RESOURCE_IRON) {
					if (e.wheelDelta > 0) {
						this.resource_count += 1;
					} else {
						this.resource_count = Math.max(1, this.resource_count - 1);
					}
				}
			}, { passive: false });
		}

		/** .apply_palette(is_drag)
		 */
		apply_palette(is_drag) {
			switch (mouse_state.current_palette_type) {
			case PALETTE_SELECT_LAND:
				this.land_type = mouse_state.current_palette_item;
				this.life = 3;
				if (!this.is_vacant()) {
					this.resource_type = RESOURCE_NONE;
				}
				if (mouse_state.current_palette_item === LAND_STATION_L) {
					const right = this.right();
					if (right) {
						right.land_type = LAND_STATION_R;
					}
				}
				break;
			case PALETTE_SELECT_RESOURCE:
				if (is_drag) {
					if (this.resource_type !== mouse_state.current_palette_item) {
						this.resource_type = mouse_state.current_palette_item;
					}
				} else {
					this.resource_type = mouse_state.current_palette_item;
				}
				break;
			case PALETTE_SELECT_SYMBOL:
				this.symbol_type = mouse_state.current_palette_item;
				break;
			case PALETTE_SELECT_MINE:
				switch (mouse_state.current_palette_item) {
				case MINE_AXE:
					this.mine(3);
					break;
				case MINE_DYNAMITE:
					const dynamite_level = parseInt(document.getElementById('mine-dynamite').getAttribute('dynamite-level'));
					this.mine_with_dynamite(dynamite_level);
					break;
				}
				break;
			}
			onchange();
		}

		/** .mine()
		 */
		mine(power) {
			if (!power) {
				return;
			}
			if (this.land_type === LAND_TREE) {
				if (this.life > 0) {
					this.life = Math.max(0, this.life - power);
					if (this.life === 0) {
						this.resource_type = RESOURCE_WOOD;
					}
				}
			}
			if (this.land_type === LAND_IRON) {
				if (this.life > 0) {
					this.life = Math.max(0, this.life - power);
					if (this.life === 0) {
						this.resource_type = RESOURCE_IRON;
					}
				}
			}
		}

		/** .mine_with_dynamite()
		 */
		mine_with_dynamite(level) {
			const targets = get_dynamite_targets(this, level);
			if (targets && targets.length) {
				targets.forEach((target) => {
					target.cell.mine(target.power);
				});
			}
		}

		/** .is_vacant
		 */
		is_vacant() {
			let ret = false;
			switch (this.land_type) {
			case LAND_PLAIN: ret = true; break;
			case LAND_COLOR_1: ret = true; break;
			case LAND_COLOR_2: ret = true; break;
			case LAND_COLOR_3: ret = true; break;
			case LAND_COLOR_4: ret = true; break;
			case LAND_COLOR_5: ret = true; break;
			case LAND_COLOR_6: ret = true; break;
			case LAND_COLOR_7: ret = true; break;
			case LAND_COLOR_8: ret = true; break;
			case LAND_COLOR_9: ret = true; break;
			case LAND_COLOR_10: ret = true; break;
			case LAND_BRIDGE: ret = true; break;
			default: break;
			}
			return ret;
		}

		/** .life
		 */
		get life() {
			return this._life;
		}
		set life(value) {
			this.td.setAttribute('life', value);
			this._life = value;
		}

		/** .update_rail()
		 * レールの状況を更新する
		 */
		update_rail() {
			// リソースタイプが線路で接続元が定義されている場合
			if (this.resource_type === RESOURCE_C_RAIL) {
				// 接続先が定義されているかどうかで場合分け
				if (this.rail_dir.to < 0) {
					// 接続先が定義されていない場合
					// 接続元が上下か左右かで場合分け
					if (this.rail_dir.from === 0 || this.rail_dir.from === 2) {
						// 上下の場合
						this.td.setAttribute('rail-direction',  'tb');
					} else {
						// 左右の場合
						this.td.setAttribute('rail-direction',  'rl');
					}
				} else {
					// 接続先が定義されている場合
					const arr = [this.rail_dir.from, this.rail_dir.to].sort();
					const dir_words = ['t', 'r', 'b', 'l'];
					const dir_word = `${dir_words[arr[0]]}${dir_words[arr[1]]}`; 
					this.td.setAttribute('rail-direction',  dir_word);
				}
			}
		}

		/** .land_type
		 */
		get land_type() {
			return this._land_type;
		}
		set land_type(value) {
			this._land_type = value;
			this.td.setAttribute('land-type',  value);
		}

		/** .checkNextConnectionAround
		 */
		checkNextConnectionAround(ignore_dir) {
			// 上下左右のマスについてチェック
			let ret = false;
			for (let i = 0; i < DIRS.length; i++) {
				if (i === ignore_dir) {
					continue;
				}
				const j = reverse_dir(i);
				let nx = this.x + DIRS[i][0];
				let ny = this.y + DIRS[i][1];
				// そこがマップの範囲内であり
				if (is_on_map(nx, ny)) {
					let that = map_cell[ny][nx];
					// そこに終端ではない線路が敷いてあるならば
					if (that.check_end_of_rail() || (that.resource_type === RESOURCE_RAIL && that.resource_count === 1)) {
						this.rail_dir[this.get_free_dir()] = i;
						this.update_rail();
						that.rail_dir[that.get_free_dir()] = j;
						that._resource_type = RESOURCE_C_RAIL;
						that.td.setAttribute('resource-type',  RESOURCE_C_RAIL);
						that.update_rail();
						that.checkNextConnectionOne();
						ret = true;
						break;
					}
				}
			}
			return ret;
		}

		/** .checkNextConnectionOne
		 */
		checkNextConnectionOne() {
			const i = (this.rail_dir.to > -1) ? this.rail_dir.to : reverse_dir(this.rail_dir.from);
			const j = reverse_dir(i);
			const nx = this.x + DIRS[i][0];
			const ny = this.y + DIRS[i][1];
			if (is_on_map(nx, ny)) {
				const that = map_cell[ny][nx];
				if (that.resource_type === RESOURCE_RAIL && that.resource_count === 1 && that.rail_dir.from === j) {
					that._resource_type = RESOURCE_C_RAIL;
					that.td.setAttribute('resource-type',  RESOURCE_C_RAIL);
					that.checkNextConnectionOne();
				}
			}
		}

		/** .connectToEndOfRail
		 */
		connectToEndOfRail() {
			// 上下左右のマスについてチェック
			let ret = false;
			for (let i = 0; i < DIRS.length; i++) {
				const j = reverse_dir(i);
				let nx = this.x + DIRS[i][0];
				let ny = this.y + DIRS[i][1];
				// そこがマップの範囲内であり
				if (is_on_map(nx, ny)) {
					let that = map_cell[ny][nx];
					// そこが敷いてある線路の終端ならば
					if (that.check_end_of_rail()) {
						const d1 = that.get_free_dir();
						const d2 = (d1 === 'from') ? 'to' : 'from';
						that.rail_dir[d1] = j;
						if (that.is_flexible) {
							that.rail_dir[d2] = i;
							that.is_flexible = false;
						}
						that.update_rail();
						this.rail_dir[this.get_free_dir(i)] = i;
						this.update_rail();
						this.checkNextConnectionAround(i);
						ret = true;
						break;
					}
				}
			}
			return ret;
		}

		/** .symbol_type
		 */
		get symbol_type() {
			return this._symbol_type;
		}
		set symbol_type(value) {
			switch (value) {
			case RESOURCE_ERASER:
				this._symbol_type = RESOURCE_NONE;
				this.td.setAttribute('symbol-type',  value);
				break;
			default:
				this._symbol_type = value;
				this.td.setAttribute('symbol-type',  value);
				const symbol_id = document.getElementById('palette-symbol').getAttribute('symbol-id');
				this.td.setAttribute('symbol-id', symbol_id);
				this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+symbol_id+'.png)');
				break;
			}
		}

		/** .resource_type
		 */
		get resource_type() {
			return this._resource_type;
		}
		set resource_type(value) {
			switch (value) {
			case RESOURCE_ERASER:
				this._resource_type = RESOURCE_NONE;
				this.resource_count = 0;
				this.td.setAttribute('resource-type',  value);
				break;
			case RESOURCE_C_RAIL:
				// 線路の場合
				// ここが接続線路でないときに限り
				if (this._resource_type !== RESOURCE_C_RAIL) {
					this._resource_type = value;
					this.resource_count = 1;
					this.rail_dir = {
						from: DIR_NONE,
						to: DIR_NONE,
					};
					this.td.setAttribute('rail-direction', 'rl');
					this.td.setAttribute('resource-type',  value);
					// 周囲との接続を試みる
					if (this.connectToEndOfRail()) {
					} else {
						this.is_flexible = true;
						this.update_rail();
					}
				}
				break;
			default:
				if (this._resource_type !== value || value === RESOURCE_FACE || value === RESOURCE_SYMBOL) {
					this._resource_type = value;
					this.resource_count = 1;
					this.rail_dir = {
						from: DIR_NONE,
						to: DIR_NONE,
					};
					this.td.setAttribute('resource-type',  value);
					if (value.includes('dynamite')) {
						//const dynamite_level = parseInt(document.getElementById('resource-dynamite').getAttribute('dynamite-level'));
						const dynamite_level = parseInt(value.split('-')[1]);
						this.td.setAttribute('level', dynamite_level);
					}
					if (value === RESOURCE_FACE) {
						const face_id = document.getElementById('palette-face').getAttribute('face-id');
						this.td.setAttribute('face-id', face_id);
						this.td.style.setProperty('--face-image', 'url(../img/face/face-'+face_id+'.png)');
					}
					if (value === RESOURCE_SYMBOL) {
						const symbol_id = document.getElementById('palette-symbol').getAttribute('symbol-id');
						this.td.setAttribute('symbol-id', symbol_id);
						this.td.style.setProperty('--symbol-image', 'url(../img/symbol/'+symbol_id+'.png)');
					}
					if (value === RESOURCE_RAIL) {
						this.rail_dir = {
							from: 3,
							to: 1,
						};
						this.update_rail();
					}
				} else {
					if (value === RESOURCE_RAIL || value === RESOURCE_WOOD || value === RESOURCE_IRON) {
						this.resource_count += 1;
					} 
				}
				break;
			}
		}

		/** .resource_count
		 */
		get resource_count() {
			return this._resource_count;
		}
		set resource_count(value) {
			this._resource_count = value;
			this.resource_count_elm.textContent = value;
			if (value > 1) {
				this.resource_count_elm.style.setProperty('display', 'block');
			} else {
				this.resource_count_elm.style.setProperty('display', 'none');
			}
		}

		/** .check_end_of_rail()
		 */
		check_end_of_rail() {
			// そこにレールがあり
			if (this.resource_type === RESOURCE_C_RAIL) {
				const from = this.get_cell_with_dir(this.rail_dir.from);
				const to = this.get_cell_with_dir(this.rail_dir.to);
				if (from && to && this.is_connect_to(from) && this.is_connect_to(to)) {
					return false;
				} else {
					return true;
				}
			}
			return false;
		}

		/** .get_cell_with_dir(dir_idx)
		 */
		get_cell_with_dir(dir_idx) {
			if (dir_idx < 0) {
				return null;
			}
			const dir = DIRS[dir_idx];
			const nx = this.x + dir[0];
			const ny = this.y + dir[1];
			if (is_on_map(nx, ny)) {
				return map_cell[ny][nx];
			}
			return null;
		}

		/** .is_connect_to(that)
		 */
		is_connect_to(that) {
			if (!that) return false;
			const a = this.get_cell_with_dir(this.rail_dir.to);
			const b = this.get_cell_with_dir(this.rail_dir.from);
			const c = that.get_cell_with_dir(that.rail_dir.to);
			const d = that.get_cell_with_dir(that.rail_dir.from);
			return (a === that || b === that) && (c === this || d === this);
		}

		/** .get_free_dir(dir)
		 */
		get_free_dir(dir = -1) {
			if (dir < 0) {
				const a = this.get_cell_with_dir(this.rail_dir.to);
				return (this.is_connect_to(a)) ? 'from' : 'to';
			} else {
				return (this.rail_dir.from !== dir) ? 'from' : 'to';
			}
		}

		/** .right()
		 */
		right() {
			const nx = this.x + 1;
			const ny = this.y;
			if (is_on_map(nx, ny)) {
				return map_cell[ny][nx];
			}
			return null;
		}
	}


	/** reverse_dir(i)
	 */
	function reverse_dir(i) {
		return (i + 2) % 4;
	}


	/** map_cell_to_json
	 */
	function map_cell_to_json() {
		for (let y = 0; y < map_cell.length; y++) {
			for (let x = 0; x < map_cell[y].length; x++) {
				const cell = map_cell[y][x];
				if (cell.land_type === LAND_PLAIN) {
					if (cell.resource_type === RESOURCE_NONE) {
						// 平地で何もない
					} else {
						// 平地で何かある
					}
				} else {
					if (cell.resource_type === RESOURCE_NONE) {
						// 平地ではなく何もない
					} else {
						// 平地ではなく何かある
					}
				}
			}
		}
	}


	/** highlight_reset()
	 */
	function highlight_reset() {
		document.querySelectorAll('.highlight-frame').forEach((elm) => {
			elm.classList.remove('highlight-frame');
			elm.classList.remove('highlight-circle');
			route_highlight_cells = [];
		});
	}


	/** highlight_mouse()
	 */
	function highlight_mouse(alt_flag) {
		if (last_highlight_cell === mouse_state.last_move_cell) {
			return;
		}
		highlight_reset();
		const target = mouse_state.last_move_cell;
		target.td.classList.add('highlight-frame');
		if (mouse_state.current_palette_item === LAND_STATION_L) {
			const right = target.right();
			if (right) {
				right.td.classList.add('highlight-frame');
			}
		}
	}


	/** highlight_dynamite(level)
	 */
	function highlight_dynamite(level) {
		if (!mouse_state.last_move_cell) {
			return;
		}
		if (last_highlight_cell === mouse_state.last_move_cell) {
			return;
		}
		if (isNaN(level)) {
			level = 1;
		}
		highlight_reset();
		const targets = get_dynamite_targets(mouse_state.last_move_cell, level);
		if (targets && targets.length) {
			targets.forEach((target, i) => {
				if (target.power > 0) {
					target.cell.td.classList.add('highlight-frame');
					route_highlight_cells.push(target.cell);
					if (target.cell === mouse_state.last_move_cell) {
						target.cell.td.classList.add('highlight-circle');
					}
				}
			});
			last_highlight_cell = mouse_state.last_move_cell;
		}
	}


	/** highlight_route()
	 */
	function highlight_route(alt_flag) {
		if (!mouse_state.last_put_cell || !mouse_state.last_move_cell) {
			return;
		}
		if (!mouse_state.last_put_cell || !mouse_state.last_move_cell) {
			return;
		}
		if (mouse_state.last_put_cell === mouse_state.last_move_cell) {
			return;
		}
		if (last_highlight_cell === mouse_state.last_move_cell) {
			return;
		}
		highlight_reset();
		let cells;
		if (alt_flag) {
			cells = get_dijkstra_route(mouse_state.last_put_cell, mouse_state.last_move_cell);
		} else {
			cells = get_straight_route(mouse_state.last_put_cell, mouse_state.last_move_cell);
		}
		if (cells) {
			cells.forEach((cell, i) => {
				if (i > 0) {
					cell.td.classList.add('highlight-frame');
					route_highlight_cells.push(cell);
					if (i === cells.length - 1) {
						cell.td.classList.add('highlight-circle');
					}
				}
			});
			last_highlight_cell = mouse_state.last_move_cell;
		}
	}


	/** get_dynamite_targets(put_cell, level)
	 */
	function get_dynamite_targets(put_cell, level) {
		const targets = [];
		level = Math.max(1, Math.min(9, level));
		const dynamite_range = DYNAMITE_RANGE[level - 1];
		const dynamite_range_width = dynamite_range[0].length;
		const dynamite_range_radius = parseInt((dynamite_range_width - 1) / 2);
		for (let y = 0; y < dynamite_range_width; y++) {
			for (let x = 0; x < dynamite_range_width; x++) {
				const power = dynamite_range[y][x];
				const mx = put_cell.x - dynamite_range_radius + x;
				const my = put_cell.y - dynamite_range_radius + y;
				if (is_on_map(mx, my)) {
					const cell = map_cell[my][mx];
					targets.push({ cell, power });
				}
			}
		}
		return targets;
	}


	/** get_straight_route(from, to)
	 */
	function get_straight_route(from, to) {
		const start_x = from.x;
		const start_y = from.y;
		const move_x = to.x - from.x;
		const move_y = to.y - from.y;
		const move_x_abs = Math.abs(move_x);
		const move_y_abs = Math.abs(move_y);
		const move_x_sign = Math.sign(move_x);
		const move_y_sign = Math.sign(move_y);
		const slope = move_y / move_x;
		const down_positions = [];
		for (let i = 0; i < move_y_abs; i++) {
			const y = move_y_sign * (i + 0.5);
			const x = Math.floor(Math.abs(y / slope + 0.5 * move_x_sign));
			down_positions.push(x);
		}
		const cells = [];
		for (let x = 0, y = 0; x <= move_x_abs; x++) {
			const cell = map_cell[start_y + move_y_sign * y][start_x + move_x_sign * x];
			cells.push(cell);
			while (down_positions.length) {
				if (down_positions[0] === x) {
					y++;
					const cell_2 = map_cell[start_y + move_y_sign * y][start_x + move_x_sign * x];
					cells.push(cell_2);
					down_positions.shift();
				} else {
					break;
				}
			}
		}
		return cells;
	}


	/** get_dijkstra_route(from, to)
	 */
	function get_dijkstra_route(from, to) {
		for (let y = 0; y < map_cell.length; y++) {
			for (let x = 0; x < map_cell[y].length; x++) {
				map_cell[y][x].explore_data = {
					score: -Infinity,
					from: null,
					is_end: false,
				};
			}
		}
		from.explore_data.score = 0;
		to.explore_data.is_end = true;
		explore_loop(from, 0);
		const route = [];
		if (to.explore_data.from) {
			let cell = to;
			for (let i = 0; i < 9999; i++) {
				route.push(cell);
				if (cell === from) {
					break;
				}
				cell = cell.explore_data.from;
			}
			route.reverse();
		}
		return route;
	}


	/** explore_loop(cell, depth)
	 */
	function explore_loop(cell, depth) {
		let add_score = 0;
		DIRS.forEach((dir) => {
			const nx = cell.x + dir[0];
			const ny = cell.y + dir[1];
			if (is_on_map(nx, ny)) {
				const to = map_cell[ny][nx];
				if (to.land_type === LAND_ROCK) {
					add_score += 0.1;
				}
			}
		});
		DIRS.forEach((dir) => {
			const nx = cell.x + dir[0];
			const ny = cell.y + dir[1];
			if (is_on_map(nx, ny)) {
				const to = map_cell[ny][nx];
				if (to.land_type !== LAND_ROCK && to.resource_type !== RESOURCE_C_RAIL) {
					const score = cell.explore_data.score - 1 + add_score;
					if (score > to.explore_data.score) {
						to.explore_data.score = score;
						to.explore_data.from = cell;
						if (!to.explore_data.is_end) {
							explore_loop(to, depth + 1);
						}
					}
				}
			}
		});
	}


	/** change_map_size()
	 */
	function change_map_size() {
		const new_width = parseInt(document.querySelector('.map-size-container[dir=x] input').value);
		const new_height = parseInt(document.querySelector('.map-size-container[dir=y] input').value);
		const current_width = map_cell[0].length;
		const current_height = map_cell.length;
		const dif_width = Math.abs(new_width - current_width);
		const dif_height = Math.abs(new_height - current_height);
		if (new_width > current_width) {
			// 横幅が増える場合
			for (let y = 0; y < current_height; y++) {
				for (let i = 0; i < dif_width; i++) {
					const x = current_width + i;
					const cell = new Cell(x, y, null);
					map_elm.tr[y].append(cell.td);
					map_elm.td[y][x] = cell.td;
					map_cell[y][x] = cell;
				}
			}
		} else if (new_width < current_width) {
			// 横幅が減る場合
			for (let y = 0; y < current_height; y++) {
				for (let i = dif_width - 1; i >= 0; i--) {
					const x = current_width + i;
					const td = map_elm.td[y].pop();
					td.remove();
					map_cell[y].pop();
				}
			}
		}
		if (new_height > current_height) {
			// 高さが増える場合
			for (let i = 0; i < dif_height; i++) {
				const y = current_height + i;
				const tr = document.createElement('tr');
				map_elm.tr[y] = tr;
				map_elm.td[y] = [];
				map_cell[y] = [];
				for (let x = 0; x < new_width; x++) {
					const cell = new Cell(x, y, null);
					map_cell[y][x] = cell;
					map_elm.td[y][x] = cell.td;
					tr.append(cell.td);
				}
				map_elm.table.append(tr);
			}
		} else if (new_height < current_height) {
			// 高さが減る場合
			for (let i = 0; i < dif_height; i++) {
				const y = current_height - i - 1;
				for (let x = 0; x < new_width; x++) {
					map_elm.td[y].pop().remove();
					map_cell[y].pop();
				}
				map_elm.tr.pop().remove();
				map_elm.td.pop();
				map_cell.pop();
			}
		}
		
		onchange();
	}


	/** is_on_map(x, y)
	 * 座標(x, y)がマップからはみ出ていなければ真を返します。
	 */
	function is_on_map(x, y) {
		return x >= 0 && y >= 0 && y < map_cell.length && x < map_cell[0].length;
	}


	/** create_elm(str)
	 * DOM要素を新規作成します。
	 * 引数strはdiv#hoge.fuga[piyo=piyo]のように指定します。
	 */
	function create_elm(str, child) {
		let id;
		const attrs = [];
		const classnames = [];

		// アトリビュートを解析
		let arr = str.split('[');
		if (arr.length > 1) {
			for (let i = 1; i < arr.length; i++) {
				attrs.push(arr[i].split(']')[0].split('='));
			}
		}

		// クラスを解析
		arr = arr[0].split('.');
		if (arr.length > 1) {
			for (let i = 1; i < arr.length; i++) {
				classnames.push(arr[i]);
			}
		}

		// IDを解析
		arr = arr[0].split('#');
		if (arr.length > 1) {
			id = arr[1];
		}

		const tag = arr[0];
		const elm = document.createElement(tag);
		if (id) elm.setAttribute('id', id);
		classnames.forEach((name) => { elm.classList.add(name) });
		attrs.forEach((attr) => { elm.setAttribute(attr[0], attr[1]) });

		if (child) {
			if (typeof child === 'string') {
				elm.textContent = child;
			} else {
				elm.append(child);
			}
		}
		return elm;
	}


	/** fill(x, y, land_type, start_land_type)
	 * 座標(x, y)を基準に塗りつぶし処理を行います。
	 */
	function fill(x, y, land_type, start_land_type, depth = 0) {
		if (depth === 0 && map_cell[y][x].land_type === land_type) {
			return;
		}
		if (map_cell[y][x].land_type === start_land_type) {
			map_cell[y][x].land_type = land_type;
		} else {
			return;
		}
		// 上
		if (y > 0) {
			fill(x, y - 1, land_type, start_land_type, depth + 1);
		}
		// 下
		if (y + 1 < map_cell.length) {
			fill(x, y + 1, land_type, start_land_type, depth + 1);
		}
		// 右
		if (x + 1 < map_cell[0].length) {
			fill(x + 1, y, land_type, start_land_type, depth + 1);
		}
		// 左
		if (x > 0) {
			fill(x - 1, y, land_type, start_land_type, depth + 1);
		}
	}


	/** unix_to_str(unix)
	 */
	function unix_to_str(unix) {
		const date = new Date(unix * 1000);
		var Y = date.getFullYear();
		var M = date.getMonth() + 1;
		var D = date.getDate();
		var h = date.getHours();
		var m = String(date.getMinutes()).padStart(2, '0');
		var s = String(date.getSeconds()).padStart(2, '0');
		return `${Y}/${M}/${D} ${h}:${m}:${s}`;
	}


	/** get_time_str()
	 */
	function get_time_str() {
		const date = new Date();
		var h = String(date.getHours()).padStart(1, '0');
		var m = String(date.getMinutes()).padStart(2, '0');
		var s = String(date.getSeconds()).padStart(2, '0');
		return `${h}:${m}:${s}`;
	}


	/** init_local_storage()
	 */
	function init_local_storage() {
		localStorage.removeItem('Unrailed-Map-Maker');
	}


	/** save_local_storage()
	 */
	function save_local_storage() {
		const json_str = JSON.stringify(save_data);
		localStorage.setItem('Unrailed-Map-Maker', json_str);
	}


	/** load_local_storage()
	 */
	function load_local_storage() {
		const json_str = localStorage.getItem('Unrailed-Map-Maker');
		if (json_str) {
			const json = JSON.parse(json_str);
			Object.keys(json).forEach((key) => {
				save_data[key] = json[key];
			});
		}
	}


	/** onchange()
	 * マップの内容が変更されたときに呼び出される関数です。
	 * オートセーブ処理が走ります。
	 */
	function onchange() {

		// 前回のタイムアウトがまだ呼ばれていなければキャンセルする
		clearTimeout(autosave_timer);

		// タイムアウトをセット
		autosave_timer = setTimeout(() => {

			// マップを文字列化する
			const data = map_to_str();

			// タイムスタンプを取得
			const timestamp = parseInt(new Date().getTime() / 1000);

			// オートセーブ
			if (is_autosave_enabled) {
				save_data.file['autosave'] = {
					id: 'autosave',
					title: 'Auto-saved data',
					created: 'autosave',
					modified: timestamp,
					data: data,
				};
				save_data.last_file_key = 'autosave';
				save_local_storage();
				my_console.log('Auto-saved.');
			}

			is_saved = false;

			// URLの書き換え
			// history.replaceState('', '', '?share=' + str);

		}, AUTOSAVE_DELAY);
		
		clearTimeout(autosave_timer_sub);
		autosave_timer_sub = setTimeout(() => {
			count();
		}, 40);

	}


	/** get_lang_key()
	 */
	function get_lang_key() {
		const navigator_lang_key = navigator.language || navigator.userLanguage || 'ja';
		return url_queries.lang === 'en' ? 'en' :
			url_queries.lang === 'ja' ? 'ja' :
			navigator_lang_key.includes('ja') ? 'ja' :
			'en';
	}


	/** get_lang(key)
	 */
	function get_lang(key) {
		if (LANG[key]) {
			return LANG[key][lang_key];
		} else {
			console.error(key + ' is undefined.');
			return '';
		}
	}


	/** my_console
	 * 時分秒を付けてコンソールにログを出します。
	 */
	const my_console = {
		log(str) {
			if (typeof str === 'string') {
				console.log(`${get_time_str()} ${str}`);
			} else {
				console.log(`${get_time_str()} %o`, str);
			}
		},
		error(str) {
			console.error(`${get_time_str()} ${str}`);
		},
		info(str) {
			console.info(`${get_time_str()} ${str}`);
		},
	};


	/** my_toaster
	 */
	const my_toaster = {
		init() {
			this.timer;
			this.image = document.getElementById('bot-image');
			this.head = document.getElementById('bot-head-area');
			this.balloon = document.getElementById('bot-balloon');
			let neglect_timer;
			let move_reset_timer;
			let move_on_head = 0;
			let prev_mouse_x = -1;
			let prev_mouse_y = -1;
			this.image.addEventListener('mouseenter', (e) => {
				clearTimeout(neglect_timer);
				neglect_timer = setTimeout(() => {
					this.emoji('p2-7');
				}, 1000);
			});
			this.image.addEventListener('mouseleave', (e) => {
				clearTimeout(neglect_timer);
				move_reset_timer = setTimeout(() => {
					move_on_head = 0;
					prev_mouse_x = -1;
					prev_mouse_y = -1;
				}, 1000);
			});
			this.head.addEventListener('mousemove', (e) => {
				clearTimeout(move_reset_timer);
				if (prev_mouse_x > -1) {
					move_x = Math.abs(prev_mouse_x - e.pageX);
					move_y = Math.abs(prev_mouse_y - e.pageY);
					move_on_head += move_x + move_y;
					if (move_on_head > 300) {
						move_on_head = 0;
						this.emoji('p2-1');
					}
				}
				prev_mouse_x = e.pageX;
				prev_mouse_y = e.pageY;
			});
			this.image.addEventListener('click', (e) => {
				clearTimeout(neglect_timer);
				const r = parseInt(100 * Math.random());
				let emoji;
				if (r < 70) emoji = 'p2-2';
				else if (r < 80) emoji = 'p1-8';
				else if (r < 90) emoji = 'p2-3';
				else emoji = 'p2-2-a';
				this.emoji(emoji);
			});
			this.image.addEventListener('mousewheel', (e) => {
				clearTimeout(neglect_timer);
				e.preventDefault();
				if (e.wheelDelta > 0) {
					this.emoji('p3-1');
				} else {
					this.emoji('p3-5');
				}
			}, { passive: false });
		},
		parse(str) {
			return str.replace(/:.+:/, (match) => {
				const type = match.replace(/:/g, '');
				return '<img class="single-emoji" src="./assets/img/emoji/emoji-'+type+'.png">';
			});
		},
		log(str, time = 3000, type) {
			this.balloon.innerHTML = this.parse(str);
			this.balloon.classList.remove('error', 'success', 'gray', 'orange', 'emoji', 'blue');
			this.balloon.classList.add(type);
			this.balloon.style.setProperty('display', 'none');
			this.balloon.style.setProperty('animation-duration', time + 'ms');
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.balloon.style.setProperty('display', 'block');
				this.timer = setTimeout(() => {
					this.balloon.style.setProperty('display', 'none');
				}, time);
			}, 33);
		},
		emoji(type, time) {
			const str = '<img class="single-emoji" src="./assets/img/emoji/emoji-'+type+'.png">';
			this.log(str, time, 'emoji');
		},
		gray(str, time) {
			this.log(str, time, 'gray');
		},
		orange(str, time) {
			this.log(str, time, 'orange');
		},
		blue(str, time) {
			this.log(str, time, 'blue');
		},
		success(str, time) {
			this.log(str, time, 'success');
		},
		error(str, time) {
			this.log(str, time, 'error');
		},
	}


	/** count()
	 */
	function count() {
		const count = {
			'wood': 0,
			'iron': 0,
			'r-wood': 0,
			'r-iron': 0,
			'c-rail': 0,
			'r-rail': 0,
			'bridge': 0,
		};
		const stations = [];
		function is_under_station(cell) {
			for (let i = 0; i < stations.length; i++) {
				const s = stations[i];
				const y  = s.y + 1;
				const x1 = s.x + 0;
				const x2 = s.x + 1;
				const x3 = s.x + 2;
				if (cell.y === y) {
					if (cell.x === x1 || cell.x === x2 || cell.x === x3) {
						return true;
					}
				}
			}
			return false;
		}
		for (let y = 0; y < map_cell.length; y++) {
			for (let x = 0; x < map_cell[y].length; x++) {
				const cell = map_cell[y][x];
				let c = 1;
				switch (cell.land_type) {
				case LAND_TREE:
					count['wood']++;
					break;
				case LAND_IRON:
					count['iron']++;
					break;
				case LAND_BRIDGE:
					count['bridge']++;
					break;
				case LAND_STATION_L:
					stations.push(cell);
					break;
				}
				switch (cell.resource_type) {
				case RESOURCE_WOOD:
					c = cell.resource_count || 1;
					count['r-wood'] += c;
					break;
				case RESOURCE_IRON:
					c = cell.resource_count || 1;
					count['r-iron'] += c;
					break;
				case RESOURCE_RAIL:
					if (!is_under_station(cell)) {
						c = cell.resource_count || 1;
						count['r-rail'] += c;
					}
					break;
				case RESOURCE_C_RAIL:
					if (!is_under_station(cell)) {
						count['c-rail']++;
					}
					break;
				}
			}
		}
		Object.keys(count).forEach((key) => {
			count_elm[key].textContent = count[key];
		});
	}


	/** save()
	 * 上書き保存します。
	 */
	function save() {
		if (current_file_key) {
			const title = document.getElementById('file-name').value;
			const timestamp = parseInt(new Date().getTime() / 1000);
			save_data.file[current_file_key] = {
				title,
				created: current_file_key,
				modified: timestamp,
				data: map_to_str(),
			};
			is_saved = true;
			save_data.last_file_key = current_file_key;
			save_local_storage();
		}
	}


	/** save_as(title)
	 * 名前を付けて保存します。
	 */
	function save_as(title) {
		const timestamp = parseInt(new Date().getTime() / 1000);
		save_data.file[timestamp] = {
			title,
			created: timestamp,
			modified: timestamp,
			data: map_to_str(),
		};
		save_data.last_file_key = timestamp;
		save_local_storage();
		current_file_key = timestamp;
		is_saved = true;
		document.getElementById('file-name').val(title).classList.add('enabled');
		document.getElementById('file-save').classList.add('enabled');
	}


	/** load(file_key)
	 * ファイルを開きます。
	 */
	function load(file_key) {
		const file = save_data.file[file_key];
		if (file) {
			open_map_from_str(file.data);
			if (file_key !== 'autosave') {
				current_file_key = file.created;
				save_data.last_file_key = file.created;
				document.getElementById('file-name').val(file.title).classList.add('enabled');
				document.getElementById('file-save').classList.add('enabled');
			} else {
				current_file_key = null;
				save_data.last_file_key = 'autosave';
				document.getElementById('file-name').val(file.title).classList.remove('enabled');
				document.getElementById('file-save').classList.remove('enabled');
			}
			save_local_storage();
		}
	}


	/** open_help_window()
	 * ヘルプウィンドウを開きます。
	 */
	function open_help_window() {
		const close = () => {
			main_window.classList.remove('blur');
			modal_window.classList.add('hidden');
			modal_window.innerHTML = '';
		};
		const help = document.getElementById('help-' + lang_key);
		main_window.classList.add('blur');
		modal_window.classList.remove('hidden');
		const container = create_elm('div.modal-container.help');
		container.innerHTML = help.innerHTML;
		container.addEventListener('click', (e) => { e.stopPropagation() });
		const d1 = create_elm('div');
		const d2 = create_elm('div');
		const close_button = create_elm('button.close').text( get_lang('toolbar-close') ).appendTo(d2);
		const close_cross = create_elm('div.cross').appendTo(d2);
		close_button.addEventListener('click', close);
		close_cross.addEventListener('click', close);
		container.append(d1, d2);
		modal_window.append(container);
	}


	/** open_share_window()
	 * シェアウィンドウを開きます。
	 */
	function open_share_window() {

		// マップを文字列化する
		const data = map_to_str();

		// 共有URL
		const share_url = location.href.split('?')[0] + '?share=' + data;

		const close = () => {
			main_window.classList.remove('blur');
			modal_window.classList.add('hidden');
			modal_window.innerHTML = '';
		};
		main_window.classList.add('blur');
		modal_window.classList.remove('hidden');
		const container = create_elm('div.modal-container');
		container.addEventListener('click', (e) => { e.stopPropagation() });
		const h4 = create_elm('h4').text( get_lang('toolbar-share') ).appendTo(container);
		const d1 = create_elm('div');
		const d2 = create_elm('div');

		['share-url', 'embed-tag'].forEach((id, i) => {
			const sub_container = create_elm(`div.textarea-container.${id}`).appendTo(d1);
			const h5 = create_elm('h5').text( get_lang(`toolbar-${id}`) ).appendTo(sub_container);
			const input = create_elm(`textarea#${id}`).appendTo(sub_container);
			const button = create_elm('button.copy').text( get_lang('toolbar-copy') ).appendTo(sub_container);
			if (id === 'share-url') {
				input.textContent = share_url;
				button.addEventListener('click', (e) => {
					const ret = copy_str_to_clipboard(input.value);
					if (ret) {
						input.select();
						my_toaster.success( get_lang('toaster-success-copy') );
					}
				});
			} else {
				button.addEventListener('click', (e) => {
					const ret = copy_str_to_clipboard(input.value);
					if (ret) {
						input.select();
						my_toaster.success( get_lang('toaster-success-copy') );
					}
				});
			}
			if (i === 0) {
				sub_container.append(create_elm('hr'));
			}
		});
		function update_embed_tag() {
			const x_num = map_cell[0].length;
			const y_num = map_cell.length;
			let cell_size = 32;
			let embed_width = x_num * 32;
			let embed_height = y_num * 32;
			let embed_url;
			if (save_data.embed_option.embed_size === 'cell-size') {
				cell_size = Math.max(1, save_data.embed_option.cell_size);
				embed_width = x_num * cell_size;
				embed_height = y_num * cell_size;
				embed_url = location.href.split('?')[0] + 'emb.html?cellsize='+cell_size+'&share=' + data;
			} else {
				embed_width = Math.max(1, Math.ceil(save_data.embed_option.map_size));
				embed_height = Math.max(1, Math.ceil(save_data.embed_option.map_size * y_num / x_num));
				embed_url = location.href.split('?')[0] + 'emb.html?share=' + data;
			}
			const embed_tag = `<iframe frameborder="0" width="${embed_width}" height="${embed_height}" src="${embed_url}"></iframe>`;
			container.querySelector('#embed-tag').value = embed_tag;
		}
		{
			const opt1 = create_elm('div.radio-container').appendTo(d1);
			opt1.innerHTML = '<input type="radio" name="embed-size" id="embed-size-1" key="cell-size"><label for="embed-size-1"><span>マスの大きさを指定する</span>(<input type="text" id="embed-cell-size">px)</label>'
			const opt2 = create_elm('div.radio-container').appendTo(d1);
			opt2.innerHTML = '<input type="radio" name="embed-size" id="embed-size-2" key="map-size"><label for="embed-size-2"><span>マップの横幅を指定する</span>(<input type="text" id="embed-map-size">px)</label>'
			const check = d1.querySelector(`[name=embed-size][key=${save_data.embed_option.embed_size}]`);
			if (check) check.checked = true;
			d1.querySelectorAll('[name=embed-size]').forEach((elm) => {
				elm.addEventListener('change', (e) => {
					save_data.embed_option.embed_size = elm.getAttribute('key');
					save_local_storage();
					update_embed_tag();
				});
			});
			const text1 = d1.querySelector('#embed-cell-size');
			text1.value = save_data.embed_option.cell_size;
			text1.addEventListener('input', (e) => {
				const num = parseInt(text1.value);
				if (!isNaN(num)) {
					save_data.embed_option.cell_size = num;
					save_local_storage();
					update_embed_tag();
				}
			});
			const text2 = d1.querySelector('#embed-map-size');
			text2.value = save_data.embed_option.map_size;
			text2.addEventListener('input', (e) => {
				const num = parseInt(text2.value);
				if (!isNaN(num)) {
					save_data.embed_option.map_size = num;
					save_local_storage();
					update_embed_tag();
				}
			});
		}
		const close_button = create_elm('button.close').text( get_lang('toolbar-close') ).appendTo(d2);
		const close_cross = create_elm('div.cross').appendTo(d2);
		close_button.addEventListener('click', close);
		close_cross.addEventListener('click', close);
		container.append(d1, d2);
		update_embed_tag();
		modal_window.append(container);
	}


	/** open_save_window()
	 * セーブウィンドウを開きます。
	 */
	function open_save_window() {
		const close = () => {
			main_window.classList.remove('blur');
			modal_window.classList.add('hidden');
			modal_window.innerHTML = '';
		};
		main_window.classList.add('blur');
		modal_window.classList.remove('hidden');
		const container = create_elm('div.modal-container');
		container.addEventListener('keyup', (e) => { e.stopPropagation() });
		container.addEventListener('keydown', (e) => { e.stopPropagation() });
		container.addEventListener('click', (e) => { e.stopPropagation() });
		const h4 = create_elm('h4').text( get_lang('toolbar-save-as') ).appendTo(container);
		const d1 = create_elm('div');
		const d2 = create_elm('div');
		const input = create_elm('input[type=text]').val('Untitled!').appendTo(d1);
		const button = create_elm('button.save').text( get_lang('toolbar-save') ).appendTo(d1);
		button.addEventListener('click', (e) => {
			const title = input.value;
			save_as(title);
			my_toaster.success( get_lang('toaster-success-save') );
			close();
		});
		const close_button = create_elm('button.close').text( get_lang('toolbar-close') ).appendTo(d2);
		const close_cross = create_elm('div.cross').appendTo(d2);
		close_button.addEventListener('click', close);
		close_cross.addEventListener('click', close);
		container.append(d1, d2);
		modal_window.append(container);
	}

	/** get_canvas(callback)
	 */
	function get_canvas(callback) {
		try {
			const width = map_cell[0].length;
			const height = map_cell.length;
			const cell_size = 64;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = width * cell_size;
			canvas.height = height * cell_size;
			ctx.font = 'bold 90px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu,Cantarell, "Helvetica Neue", Arial,"Hiragino Kaku Gothic ProN", "Hiragino Sans", "BIZ UDPGothic", Meiryo, sans-serif';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';

			/** 画像の読み込み
			 */
			let img_count = 0;
			let loaded_img_count = 0;
			const url = location.href.split('?')[0];
			function parse_src(src) {
				src = (src).replace(/url\(|['")]/g, '');
				src.replace('../img', './assets/img');
				return src.replace(url, './');
			}
			function load_img(src) {
				if (src !== 'none') {
					if (!(src in image_cache)) {
						image_cache[src] = 'loading';
						img_count++;
						const img = new Image();
						img.onload = () => {
							image_cache[src] = img;
							loaded_img_count++;
							if (loaded_img_count === img_count) {
								onload_all_image();
							}
						};
						setTimeout(() => {
							img.src = parse_src(src);
						}, 10);
					}
				}
			}
			for (let y = 0; y < map_cell.length; y++) {
				for (let x = 0; x < map_cell[0].length; x++) {
					const cell = map_cell[y][x];
					const td_style = window.getComputedStyle(cell.td);
					const resource_style = window.getComputedStyle(cell.resource_elm);
					const symbol_style = window.getComputedStyle(cell.symbol_elm);
					load_img(td_style['background-image']);
					load_img(resource_style['background-image']);
					load_img(symbol_style['background-image']);
				}	
			}

			/** 画像の読み込みがすべて終わったら描画に移る
			 */
			function onload_all_image() {
				for (let y = 0; y < map_cell.length; y++) {
					for (let x = 0; x < map_cell[0].length; x++) {
						const cell = map_cell[y][x];
						const td_style = window.getComputedStyle(cell.td);
						const resource_style = window.getComputedStyle(cell.resource_elm);
						const count_style = window.getComputedStyle(cell.resource_count_elm);
						const symbol_style = window.getComputedStyle(cell.symbol_elm);
						const img_1 = image_cache[td_style['background-image']];
						const img_2 = image_cache[resource_style['background-image']];
						const img_3 = image_cache[symbol_style['background-image']];
						const ctx_x = x * cell_size;
						const ctx_y = y * cell_size;
						ctx.fillStyle = td_style['background-color'];
						ctx.fillRect(ctx_x, ctx_y, cell_size, cell_size);
						if (img_1) ctx.drawImage(img_1, ctx_x, ctx_y, cell_size, cell_size);
						if (img_2) ctx.drawImage(img_2, ctx_x, ctx_y, cell_size, cell_size);
						if (img_3) ctx.drawImage(img_3, ctx_x, ctx_y, cell_size, cell_size);
						if (count_style['display'] === 'block') {
							ctx.fillStyle = '#000';
							ctx.font = `bold ${Math.ceil(cell_size * 0.45)}px ${count_style['font-family']}`;
							ctx.textAlign = 'left';
							ctx.textBaseline = 'top';
							ctx.strokeStyle = '#fff';
							ctx.lineWidth = Math.ceil(cell_size * 0.08);
							ctx.lineJoin = 'round';
							['strokeText', 'fillText'].forEach((draw) => {
								ctx[draw](cell.resource_count_elm.textContent, ctx_x, ctx_y);
							});
						}
					}	
				}
				callback(canvas);
			}

			if (img_count === 0) {
				onload_all_image();
			}


		} catch (e) {

			my_console.error('Failed to create the canvas.');
			console.error(e);

		}
	}


	/** get_now_date_str()
	 */
	function get_now_date_str() {
		var date = new Date();
		var y = date.getFullYear();
		var M = date.getMonth() + 1;
		var d = date.getDate();
		var H = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var str = y + '-'
		  + ('00' + M).slice(-2) + '-'
		  + ('00' + d).slice(-2) + '-'
		  + ('00' + H).slice(-2) + '-'
		  + ('00' + m).slice(-2) + '-'
		  + ('00' + s).slice(-2);
		return str;
	}


	/** get_queries(url)
	 */
	function get_queries(url) {
		const url_str = String(url || window.location);
		const query_str = url_str.slice(url_str.indexOf('?') + 1);
		const queries = {};
		if (!query_str) {
			return queries;
		}
		query_str.split('&').forEach((query_str) => {
			const query_arr = query_str.split('=');
			queries[query_arr[0]] = query_arr[1];
		});
		return queries;
	}


	/** save_image()
	 */
	function save_image() {
		get_canvas((canvas) => {
			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = `Map-${get_now_date_str()}.png`;
			link.click();
			my_console.log('Downloaded the image!');
		});
	}


	/** open_load_window()
	 * ロードウィンドウを開きます。
	 */
	function open_load_window() {
		const close = () => {
			main_window.classList.remove('blur');
			modal_window.classList.add('hidden');
			modal_window.innerHTML = '';
		};
		const keys = Object.keys(save_data.file).sort().reverse();
		const list = [];
		if (save_data.file['autosave']) {
			list.push(save_data.file['autosave']);
		}
		keys.forEach((key) => {
			if (key !== 'autosave') {
				list.push(save_data.file[key]);
			}
		});
		main_window.classList.add('blur');
		modal_window.classList.remove('hidden');
		const container = create_elm('div.modal-container');
		container.addEventListener('click', (e) => { e.stopPropagation() });
		const h4 = create_elm('h4').text( get_lang('toolbar-open') ).appendTo(container);
		const table = create_elm('table.load').appendTo(container);
		const tr = create_elm('tr');
		create_elm('th').text( get_lang('open-table-title') ).appendTo(tr);
		create_elm('th').text( get_lang('open-table-created') ).appendTo(tr);
		create_elm('th').text( get_lang('open-table-modified') ).appendTo(tr);
		create_elm('th').text( get_lang('open-table-open') ).appendTo(tr);
		create_elm('th').text( get_lang('open-table-delete') ).appendTo(tr);
		table.append(tr);
		const close_button = create_elm('button.close').text( get_lang('toolbar-close') ).appendTo(container);
		const close_cross = create_elm('div.cross').appendTo(container);
		close_button.addEventListener('click', close);
		close_cross.addEventListener('click', close);
		list.forEach((file) => {
			const tr = create_elm('tr');
			const b1 = create_elm('button.delete').text( get_lang('toolbar-open') );
			const b2 = create_elm('button.delete').text( get_lang('toolbar-delete') );
			b1.addEventListener('click', (e) => {
				load(file.created);
				my_toaster.success( get_lang('toaster-success-load') );
				close();
			});
			b2.addEventListener('click', (e) => {
				if (confirm( get_lang('confirm-delete').replace('{name}', file.title) )) {
					delete save_data.file[ file.created ];
					if (save_data.last_file_key === file.created) {
						save_data.last_file_key = null;
					}
					if (current_file_key === file.created) {
						current_file_key = null;
					}
					tr.classList.add('delete');
					save_local_storage();
					setTimeout(() => {
						tr.remove();
					}, 300);
				}
			});
			if (file.created === 'autosave') b2.style.setProperty('display', 'none');
			create_elm('td.title').text(file.title).appendTo(tr).addEventListener('click', (e) => {
				load(file.created);
				my_toaster.success( get_lang('toaster-success-load') );
				close();
			});
			create_elm('td.created').text((file.created !== 'autosave') ? unix_to_str(file.created) : '-').appendTo(tr);
			create_elm('td.modified').text(unix_to_str(file.modified)).appendTo(tr);
			create_elm('td.load').appendTo(tr).append(b1);
			create_elm('td.delete').appendTo(tr).append(b2);
			table.append(tr);
		});
		modal_window.append(container);
	}


	/** create_toolbar()
	 * ツールバーを作成します。
	 */
	function create_toolbar() {

		const toolbar = create_elm('div#toolbar-wapper');

		/** ファイルメニュー
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container.file-tool');
			const h4 = create_elm('h4').text( get_lang('toolbar-file') ).appendTo(wrapper);
			const input = create_elm('input#file-name[type=text]');
			input.addEventListener('click', (e) => {
			});
			wrapper.append(input);
			const button_save = create_elm('button#file-save.main-button').text( get_lang('toolbar-save') ).appendTo(wrapper);
			button_save.addEventListener('click', (e) => {
				if (button_save.classList.contains('enabled')) {
					save();
					my_toaster.success( get_lang('toaster-success-save') );
				}
			});
			const button_save_as = create_elm('button#file-save-as.main-button').text( get_lang('toolbar-save-as') ).appendTo(wrapper).addEventListener('click', (e) => {
				open_save_window();
			});
			const button_load = create_elm('button#file-load.main-button').text( get_lang('toolbar-open') ).appendTo(wrapper).addEventListener('click', (e) => {
				open_load_window();
			});
			const button_new = create_elm('button#file-new.main-button').text( get_lang('toolbar-new') ).appendTo(wrapper).addEventListener('click', (e) => {
				let flag = true;
				if (current_file_key && !is_saved) {
					flag = confirm( get_lang('confirm-new') );
				}
				if (flag) {
					make_table(BIOME_PLAINS, DEFAULT_WIDTH, DEFAULT_HEIGHT, false);
					current_file_key = null;
					save_data.last_file_key = null;
					document.getElementById('file-name').classList.remove('enabled');
					document.getElementById('file-save').classList.remove('enabled');
					my_toaster.success( get_lang('toaster-success-new') );
				}
			});
			const button_share = create_elm('button.main-button').text( get_lang('toolbar-share') ).appendTo(wrapper).addEventListener('click', (e) => {
				open_share_window();
			});
			const button_download_image = create_elm('button.main-button').text( get_lang('toolbar-download-image') ).appendTo(wrapper).addEventListener('click', (e) => {
				save_image();
			});
			const button_help = create_elm('button.main-button').text( get_lang('toolbar-help') ).appendTo(wrapper).addEventListener('click', (e) => {
				open_help_window();
			});
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** マップサイズ
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container');
			const h4 = create_elm('h4').text( get_lang('toolbar-map-size') ).appendTo(wrapper);
			['x', 'y'].forEach((dir) => {
				const div = create_elm(`div.map-size-container[dir=${dir}]`);
				const input = create_elm('input.map-size[type=text]');
				input.value = (dir === 'x') ? DEFAULT_WIDTH : DEFAULT_HEIGHT;
				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						input.blur();
					}
				});
				input.addEventListener('change', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val));
					input.value = val;
					change_map_size();
				});
				const button_1 = create_elm('button.input-side-button.map-size-button-1').text('-');
				button_1.addEventListener('click', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val - 1));
					input.value = val;
					change_map_size();
				});
				const button_2 = create_elm('button.input-side-button.map-size-button-2').text('+');
				button_2.addEventListener('click', (e) => {
					let val = parseInt(input.value);
					val = Math.max(1, Math.min(99, val + 1));
					input.value = val;
					change_map_size();
				});
				div.append(input, button_1, button_2);
				wrapper.append(div);
			});
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** グリッド
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container');
			{
				const input = create_elm('input[type=checkbox][id=input-grid]');
				input.addEventListener('change', (e) => {
					if (input.checked) {
						save_data.option.is_enabled_grid = true;
						main_window.classList.add('grid');
					} else {
						save_data.option.is_enabled_grid = false;
						main_window.classList.remove('grid');	
					}
					save_local_storage();
				});
				if (save_data.option.is_enabled_grid) {
					input.checked = true;
					input.trigger('change');
				}
				const label = create_elm('label[for=input-grid]').text( get_lang('toolbar-grid') );
				wrapper.append(input, label);
			}
			wrapper.append(create_elm('div.split'));
			{
				const input = create_elm('input[type=checkbox][id=input-count]');
				input.addEventListener('change', (e) => {
					if (input.checked) {
						save_data.option.is_enabled_count = true;
						count_wrapper.classList.remove('hidden');	
					} else {
						save_data.option.is_enabled_count = false;
						count_wrapper.classList.add('hidden');	
					}
					save_local_storage();
				});
				if (save_data.option.is_enabled_count) {
					input.checked = true;
					input.trigger('change');
				}
				const label = create_elm('label[for=input-count]').text( get_lang('toolbar-count') );
				wrapper.append(input, label);
			}
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
			toolbar.append(create_elm('br'));
		}
		/** 地形パレット
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container.palette-wrapper');
			const h4 = create_elm('h4').text( get_lang('toolbar-grounds') ).appendTo(wrapper);
			const ul = create_elm('ul');
			[
				LAND_NONE,
				LAND_PLAIN,
				LAND_WATER,
				LAND_BRIDGE,
				LAND_TREE,
				LAND_IRON,
				LAND_ROCK,
				// LAND_STEAM,
				// LAND_THORN,
				LAND_STATION_L,
				LAND_STATION_F,
				LAND_COLOR_1,
			].forEach((land_type) => {

				const li = create_elm(`li.palette-item[land-type=${land_type}]`);
				li.setAttribute('title', get_lang('palette-' + land_type));

				// クリック時の動作
				li.addEventListener('click', (e) => {
					document.querySelectorAll('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					if (land_type === LAND_COLOR_1) {
						mouse_state.current_palette_item = LAND_COLOR_1.replace('1', li.getAttribute('color-id'));
					} else {
						mouse_state.current_palette_item = land_type;
					}
					mouse_state.current_palette_type = PALETTE_SELECT_LAND;
				});

				// サブメニューの作成
				switch (land_type) {
				case LAND_COLOR_1:
				{
					// 記号
					li.setAttribute('color-id', 1);
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/color/1.png)`);
					const sub_ul = create_elm('ul');
					sub_ul.style.setProperty('--count-x', '1');
					sub_ul.style.setProperty('--count-y', '10');
					//sub_ul.style.setProperty('left', 'initial');
					//sub_ul.style.setProperty('right', '-26px');
					for (let j = 1; j <= 10; j++) {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/color/${j}.png)`);
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/color/${j}.png)`);
							li.setAttribute('color-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}
				
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 物資パレット
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container.palette-wrapper');
			const h4 = create_elm('h4').text( get_lang('toolbar-items') ).appendTo(wrapper);
			const ul = create_elm('ul');
			[
				RESOURCE_ERASER,
				RESOURCE_C_RAIL,
				RESOURCE_WOOD,
				RESOURCE_IRON,
				RESOURCE_RAIL,
				RESOURCE_AXE,
				RESOURCE_PICKAXE,
				RESOURCE_BACKET,
				RESOURCE_DYNAMITE_1,
				RESOURCE_BOLT,
				RESOURCE_FACE,
			].forEach((resource_type, i) => {

				const dir = (1 <= i && i <= 4) ? 'plains' : 'common';
				const li = create_elm('li.palette-item');
				li.setAttribute('title', get_lang('palette-' + resource_type));
				const file = resource_type + ((resource_type.includes('rail')) ? '-rl' : '');
				li.style.setProperty('background-image', `url(./assets/img/${dir}/${file}.png)`);

				// クリック時の動作
				li.addEventListener('click', (e) => {
					document.querySelectorAll('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					mouse_state.current_palette_type = PALETTE_SELECT_RESOURCE;
					switch (resource_type) {
					case RESOURCE_BACKET:
						mouse_state.current_palette_item = li.getAttribute('backet-state');
						break;
					case RESOURCE_DYNAMITE_1:
						mouse_state.current_palette_item = RESOURCE_DYNAMITE_1.replace('1', li.getAttribute('dynamite-level'));
						break;
					default:
						mouse_state.current_palette_item = resource_type;
						break;
					}
				});

				// サブメニューの作成
				switch (resource_type) {
				case RESOURCE_BACKET:
				{
					// バケツ
					li.setAttribute('backet-state', RESOURCE_BACKET);
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/resource-backet.png)`);
					const sub_ul = create_elm('ul');
					sub_ul.style.setProperty('--count-y', '2');
					[
						RESOURCE_BACKET,
						RESOURCE_BACKET_EMPTY
					].forEach((type) => {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
							li.setAttribute('backet-state', type);
							li.setAttribute('title', get_lang('palette-' + type));
						});
						sub_ul.append(sub_li);
					});
					li.append(sub_ul);
					break;
				}
				case RESOURCE_DYNAMITE_1:
				{
					// ダイナマイト
					li.setAttribute('dynamite-level', 1);
					li.setAttribute('id', 'resource-dynamite');
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/dynamite-1.png)`);
					const sub_ul = create_elm('ul');
					sub_ul.style.setProperty('--count-y', '9');
					for (let j = 1; j <= 9; j++) {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
						sub_li.setAttribute('title', get_lang('palette-resource-dynamite-' + j));
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
							li.setAttribute('dynamite-level', j);
							li.setAttribute('title', get_lang('palette-' + RESOURCE_DYNAMITE_1.replace('1', j)));
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}
				case RESOURCE_FACE:
				{
					// 顔
					li.setAttribute('id', 'palette-face');
					li.setAttribute('face-id', 13);
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/face/face-13.png)`);
					const sub_ul = create_elm('ul');
					sub_ul.style.setProperty('--count-x', '8');
					sub_ul.style.setProperty('--count-y', '6');
					sub_ul.style.setProperty('left', 'initial');
					sub_ul.style.setProperty('right', '-29px');
					for (let j = 1; j <= 41; j++) {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/face/face-${j}.png)`);
							li.setAttribute('face-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 記号パレット
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container.palette-wrapper');
			const h4 = create_elm('h4').text( get_lang('toolbar-symbols') ).appendTo(wrapper);
			const ul = create_elm('ul');
			[
				SYMBOL_ERASER,
				SYMBOL_SYMBOL,
			].forEach((resource_type, i) => {
				const li = create_elm('li.palette-item');
				li.setAttribute('title', get_lang('palette-' + resource_type));
				li.style.setProperty('background-image', `url(./assets/img/common/${resource_type}.png)`);

				// クリック時の動作
				li.addEventListener('click', (e) => {
					document.querySelectorAll('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					mouse_state.current_palette_type = PALETTE_SELECT_SYMBOL;
					switch (resource_type) {
					case RESOURCE_BACKET:
						mouse_state.current_palette_item = li.getAttribute('backet-state');
						break;
					case RESOURCE_DYNAMITE_1:
						mouse_state.current_palette_item = RESOURCE_DYNAMITE_1.replace('1', li.getAttribute('dynamite-level'));
						break;
					default:
						mouse_state.current_palette_item = resource_type;
						break;
					}
				});

				// サブメニューの作成
				switch (resource_type) {
				case SYMBOL_SYMBOL:
				{
					li.setAttribute('id', 'palette-symbol');
					li.setAttribute('symbol-id', 10);
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/symbol/10.png)`);
					const sub_ul = create_elm('ul');
					sub_ul.style.setProperty('--count-x', '10');
					sub_ul.style.setProperty('--count-y', '5');
					sub_ul.style.setProperty('left', 'initial');
					sub_ul.style.setProperty('right', '-31px');
					for (let j = 0; j <= 41; j++) {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/symbol/${j}.png)`);
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/symbol/${j}.png)`);
							li.setAttribute('symbol-id', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
					break;
				}}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}
		/** 採掘パレット
		 -------------------------------*/
		{
			const wrapper = create_elm('div.tool-container.palette-wrapper.mine-palette-wrapper');
			const h4 = create_elm('h4').text( get_lang('toolbar-mine-tools') ).appendTo(wrapper);
			const ul = create_elm('ul');
			[
				MINE_AXE,
				MINE_DYNAMITE,
			].forEach((type, i) => {
				const li = create_elm('li.palette-item');
				li.setAttribute('title', get_lang('palette-' + type));
				li.setAttribute('resource-type', type);
				li.style.setProperty('background-image', `url(./assets/img/common/${type}.png)`);
				li.addEventListener('click', (e) => {
					document.querySelectorAll('.selected-item').forEach((elm) => {
						elm.classList.remove('selected-item');
					});
					li.classList.add('selected-item');
					mouse_state.current_palette_item = type;
					mouse_state.current_palette_type = PALETTE_SELECT_MINE;
				});
				if (type === MINE_DYNAMITE) {
					li.setAttribute('dynamite-level', 1);
					li.setAttribute('id', 'mine-dynamite');
					li.addEventListener('mouseenter', (e) => {
						li.classList.add('hover');
					});
					li.addEventListener('mouseleave', (e) => {
						li.classList.remove('hover');
					});
					li.style.setProperty('background-image', `url(./assets/img/common/dynamite-1.png)`);
					const sub_ul = create_elm('ul');
					for (let j = 1; j <= 9; j++) {
						const sub_li = create_elm('li');
						sub_li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
						sub_li.addEventListener('click', (e) => {
							document.querySelectorAll('.selected-wrapper').forEach((elm) => {
								elm.classList.remove('selected-wrapper');
							});
							li.classList.add('selected-wrapper');
							li.classList.remove('hover');
							li.style.setProperty('background-image', `url(./assets/img/common/dynamite-${j}.png)`);
							li.setAttribute('dynamite-level', j);
						});
						sub_ul.append(sub_li);
					}
					li.append(sub_ul);
				}
				ul.append(li);
			});
			wrapper.append(ul);
			wrapper.append(create_elm('div.split'));
			toolbar.append(wrapper);
		}

		main_window.append(toolbar);

	}


	/** open_map_from_str(origin_str)
	 * 文字列からマップを開きます。
	 */
	function open_map_from_str(origin_str) {

		// 文字列をデコードする
		const map_str = decodeURIComponent(origin_str).inflate() + 'a';

		// バイオーム 横幅 高さ を特定する
		let biome = BIOME_PLAINS;
		let width = DEFAULT_WIDTH;
		let height = DEFAULT_HEIGHT;
		let str = '';
		let mode = '';
		let i;
		for (i = 0; i < map_str.length; i++) {
			const c = map_str.charAt(i);
			let new_mode;
			switch (c) {
			case 'b':
			case 'w':
			case 'h':
			case 'm':
				new_mode = c;
				break;
			default:
				str += c;
				break;
			}
			if (new_mode) {
				if (str) {
					const num = parseInt(str);
					str = '';
					switch (mode) {
					case 'b':
						biome = [
							BIOME_PLAINS,
							BIOME_DESERT,
							BIOME_SNOW,
							BIOME_HELL,
							BIOME_SPACE,
							BIOME_MARS,
						][num - 1];
						break;
					case 'w':
						width = num;
						break;
					case 'h':
						height = num;
						break;
					}
				}
				mode = new_mode;
			}
			if (mode === 'm') {
				i++;
				break;
			}
		}

		// 各セルのデータを特定する
		let arr = [];
		let opt = {};
		let num_str = '';
		for (; i < map_str.length; i++) {
			const c = map_str.charAt(i);
			if (c.match(/[a-z]/)) {
				if (opt.land_char) {
					if (num_str) {
						if (opt.symbol_char) {
							opt.symbol_id = parseInt(num_str);
							num_str = '';
						} else if (opt.resource_char) {
							opt.resource_count = parseInt(num_str);
							num_str = '';
						} else {
							opt.land_num = parseInt(num_str);
							num_str = '';
						}
					}
					arr.push(opt);
				}
				opt = {
					land_char: c
				};
			} else if (c.match(/[A-W]/)) {
				if (num_str) {
					opt.land_num = parseInt(num_str);
					num_str = '';
				}
				opt.resource_char = c;
			} else if (c.match(/[X-Z]/)) {
				if (num_str) {
					if (opt.resource_char) {
						opt.resource_count = parseInt(num_str);
						num_str = '';
					} else {
						opt.land_num = parseInt(num_str);
						num_str = '';
					}
				}
				opt.symbol_char = c;
			} else if (c.match(/[0-9]/)) {
				num_str += c;
			}
		}

		// make_tableに投げる
		make_table(biome, width, height, arr);

	}


	/** map_to_str()
	 */
	function map_to_str() {

		let ret = '';

		// バイオーム
		if (map_biome !== BIOME_PLAINS) {
			ret += 'b';
			switch (map_biome) {
			case BIOME_PLAINS:
				ret += '1';
				break;
			case BIOME_DESERT:
				ret += '2';
				break;
			case BIOME_SNOW:
				ret += '3';
				break;
			case BIOME_HELL:
				ret += '4';
				break;
			case BIOME_SPACE:
				ret += '5';
				break;
			case BIOME_MARS:
				ret += '6';
				break;
			}
		}

		if (map_cell[0].length !== DEFAULT_WIDTH) {
			ret += 'w';
			ret += map_cell[0].length;
		}

		if (map_cell.length !== DEFAULT_HEIGHT) {
			ret += 'h';
			ret += map_cell.length;
		}

		ret += 'm';
		for (let y = 0; y < map_cell.length; y++) {
			for (let x = 0; x < map_cell[0].length; x++) {
				const cell = map_cell[y][x];
				let cell_str = '';
				switch (cell.land_type) {
				case LAND_NONE: cell_str += 'a'; break;
				case LAND_PLAIN: cell_str += 'b'; break;
				case LAND_STATION_L: cell_str += 'c'; break;
				case LAND_STATION_R: cell_str += 'd'; break;
				case LAND_STATION_F: cell_str += 'e'; break;
				case LAND_TREE:
					switch (cell.life) {
					case 3: cell_str += 'f'; break;
					case 2: cell_str += 'g'; break;
					case 1: cell_str += 'h'; break;
					case 0:
						if (cell.resource_type === RESOURCE_WOOD && cell.resource_count === 1) {
							cell_str += 'j';
						} else {
							cell_str += 'i';
						}
						break;
					}
					break;
				case LAND_IRON:
					switch (cell.life) {
					case 3: cell_str += 'k'; break;
					case 2: cell_str += 'l'; break;
					case 1: cell_str += 'm'; break;
					case 0:
						if (cell.resource_type === RESOURCE_IRON && cell.resource_count === 1) {
							cell_str += 'o';
						} else {
							cell_str += 'n';
						}
						break;
					}
					break;
				case LAND_ROCK   : cell_str += 'p'; break;
				case LAND_WATER  : cell_str += 'q'; break;
				case LAND_BRIDGE : cell_str += 'r'; break;
				case LAND_STEAM  : cell_str += 's'; break;
				case LAND_THORN  : cell_str += 't'; break;
				case LAND_COLOR_1: cell_str += 'u1'; break;
				case LAND_COLOR_2: cell_str += 'u2'; break;
				case LAND_COLOR_3: cell_str += 'u3'; break;
				case LAND_COLOR_4: cell_str += 'u4'; break;
				case LAND_COLOR_5: cell_str += 'u5'; break;
				case LAND_COLOR_6: cell_str += 'u6'; break;
				case LAND_COLOR_7: cell_str += 'u7'; break;
				case LAND_COLOR_8: cell_str += 'u8'; break;
				case LAND_COLOR_9: cell_str += 'u9'; break;
				case LAND_COLOR_10: cell_str += 'u10'; break;
				}
				switch (cell.resource_type) {
				case RESOURCE_C_RAIL:
					switch (cell.td.getAttribute('rail-direction')) {
					default:
					case 'rl':
						cell_str += 'A';
						break;
					case 'tb':
						cell_str += 'B';
						break;
					case 'tr':
						cell_str += 'C';
						break;
					case 'rb':
						cell_str += 'D';
						break;
					case 'bl':
						cell_str += 'E';
						break;
					case 'tl':
						cell_str += 'F';
						break;
					}
					break;
				case RESOURCE_RAIL:
					switch (cell.td.getAttribute('rail-direction')) {
					default:
					case 'rl':
						cell_str += 'G';
						break;
					case 'tb':
						cell_str += 'H';
						break;
					case 'tr':
						cell_str += 'I';
						break;
					case 'rb':
						cell_str += 'J';
						break;
					case 'bl':
						cell_str += 'K';
						break;
					case 'tl':
						cell_str += 'L';
						break;
					}
					if (cell.resource_count > 1) {
						cell_str += cell.resource_count;
					}
					break;
				case RESOURCE_WOOD:
					if (cell_str !== 'j') {
						cell_str += 'M';
						if (cell.resource_count > 1) {
							cell_str += cell.resource_count;
						}
					}
					break;
				case RESOURCE_IRON:
					if (cell_str !== 'o') {
						cell_str += 'N';
						if (cell.resource_count > 1) {
							cell_str += cell.resource_count;
						}
					}
					break;
				case RESOURCE_DYNAMITE_1:
					cell_str += 'S';
					break;
				case RESOURCE_DYNAMITE_2:
					cell_str += 'S2';
					break;
				case RESOURCE_DYNAMITE_3:
					cell_str += 'S3';
					break;
				case RESOURCE_DYNAMITE_4:
					cell_str += 'S4';
					break;
				case RESOURCE_DYNAMITE_5:
					cell_str += 'S5';
					break;
				case RESOURCE_DYNAMITE_6:
					cell_str += 'S6';
					break;
				case RESOURCE_DYNAMITE_7:
					cell_str += 'S7';
					break;
				case RESOURCE_DYNAMITE_8:
					cell_str += 'S8';
					break;
				case RESOURCE_DYNAMITE_9:
					cell_str += 'S9';
					break;
				case RESOURCE_AXE:
					cell_str += 'O';
					break;
				case RESOURCE_PICKAXE:
					cell_str += 'P';
					break;
				case RESOURCE_BACKET:
					cell_str += 'Q';
					break;
				case RESOURCE_BACKET_EMPTY:
					cell_str += 'R';
					break;
				case RESOURCE_FACE:
					const face_id = cell.td.getAttribute('face-id');
					cell_str += 'T' + face_id;
					break;
				case RESOURCE_SYMBOL:
					const symbol_id = cell.td.getAttribute('symbol-id');
					cell_str += 'U' + symbol_id;
					break;
				case RESOURCE_BOLT:
					cell_str += 'V';
					break;
				}
				switch (cell.symbol_type) {
				default:
					break;
				case SYMBOL_SYMBOL:
					const symbol_id = cell.td.getAttribute('symbol-id');
					cell_str += 'X' + symbol_id;
					break;
				}
				ret += cell_str;
			}
		}
		return encodeURIComponent(ret.deflate());
	}
	/** copy_str_to_clipboard(str)
	 * 文字列をクリップボードにコピーします。
	 * @see https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
	 */
	function copy_str_to_clipboard(str) {
		var tmp = create_elm('div');
		var pre = document.createElement('pre');
		pre.style.webkitUserSelect = 'auto';
		pre.style.userSelect = 'auto';
		tmp.appendChild(pre).textContent = str;
		var s = tmp.style;
		s.position = 'fixed';
		s.right = '200%';
		document.body.appendChild(tmp);
		document.getSelection().selectAllChildren(tmp);
		var result = document.execCommand('copy');
		document.body.removeChild(tmp);
		return result;
	}


	/** make_table()
	 */
	function make_table(biome, width, height, defs) {

		is_autosave_enabled = false;

		// マップラッパーを空にする
		map_wrapper.innerHTML = '';

		// テーブル要素を新規作成
		const table = create_elm('table#map-table');

		// 変数の初期化
		map_cell = [];
		map_elm = {
			table: table,
			tr: [],
			td: [],
		}

		// セルを作成
		for (let i = 0, y = 0; y < height; y++) {
			const tr = create_elm('tr');
			map_cell[y] = [];
			map_elm.tr[y] = tr;
			map_elm.td[y] = [];
			for (let x = 0; x < width; x++) {
				const def = defs ? defs[i] : null;
				const cell = new Cell(x, y, def);
				map_cell[y][x] = cell;
				map_elm.td[y][x] = cell.td;
				tr.append(cell.td);
				i++;
			}
			table.append(tr);
		}

		// マウスボタンが押されたとき
		table.addEventListener('mousedown', (e) => {
			mouse_state.is_down = true;
		});

		// マウスが動いたとき
		table.addEventListener('mousemove', (e) => {
		});

		// マウスボタンが離されたとき
		table.addEventListener('mouseup', (e) => {
			mouse_state.is_down = false;
		});

		// マウスが離れたとき
		table.addEventListener('mouseleave', (e) => {
			// ハイライトを消す
			highlight_reset();
		});

		// テーブルを挿入
		map_wrapper.append(table);

		count();

		is_autosave_enabled = true;

	}


	/** window <keydown>
	 */
	window.addEventListener('keydown', (e) => {

		// シフトキーが押されたならば
		if (e.key === 'Shift' && !key_state[e.key]) {
			// ルートハイライト(直線)
			highlight_route(false);
		}

		// オルトキーが押されたならば
		if (e.key === 'Alt' && !key_state[e.key]) {
			// ルートハイライト(経路)
			highlight_route(true);
		}

		if (e.key.match(/^F\d$/) && !key_state[e.key]) {
			const num = parseInt(e.key.replace('F', ''));
			if (num <= 8) {
				if	(e.shiftKey) {
					const data = map_to_str();
					state_save_data[num] = data;
					my_console.log(`Saved state save data [F${num}].`);
					my_toaster.success( get_lang('toaster-success-save-state').replace('{num}', num) );
				} else {
					if (state_save_data[num]) {
						my_toaster.success( get_lang('toaster-success-load-state').replace('{num}', num) );
						my_console.log(`Loading state save data [F${num}].`);
						open_map_from_str(state_save_data[num]);
					} else {
						my_toaster.error( get_lang('toaster-success-load-state-error').replace('{num}', num) );
						my_console.error(`No state save data [F${num}] exists.`);
					}
				}
				// ブラウザの挙動をキャンセルする
				e.preventDefault();
			}
		}

		// key_stateの更新
		key_state[e.key] = true;

	}, { passive: false });


	/** window <keyup>
	 */
	window.addEventListener('keyup', (e) => {

		// シフトキーが離されたならば
		if (e.key === 'Shift') {

			// ハイライトのリセット
			highlight_reset();
			last_highlight_cell = null;
			highlight_mouse();

		}

		// オルトキーが離されたならば
		if (e.key === 'Alt') {

			// ハイライトのリセット
			highlight_reset();
			last_highlight_cell = null;
			highlight_mouse();

			// ブラウザの挙動をキャンセルする
			e.preventDefault();

		}

		// key_stateの更新
		key_state[e.key] = false;

	}, { passive: false });


	/** window <mouseup>
	 */
	window.addEventListener('mouseup', (e) => {
		mouse_state.is_down = false;
	});


	/** window <DOMContentLoaded>
	 */
	window.addEventListener('DOMContentLoaded', (e) => {

		my_console.log('Unrailed Map Maker Ver.' + VERSION);
		my_console.log('Thanks, Unrailed!');

		try {

			document.querySelectorAll('[trans-key]').forEach((elm) => {
				const key = elm.getAttribute('trans-key');
				const text = get_lang(key);
				elm.textContent = text;
			});

			my_toaster.init();

			// ローカルストレージの初期化
			// init_local_storage();

			// ローカルストレージの読み取り
			load_local_storage();

			// メインウィンドウとモーダルウィンドウの参照を取得
			main_window = document.getElementById('main-window');
			modal_window = document.getElementById('modal-window');
			count_wrapper = document.getElementById('count-wrapper');
			count_elm['wood'] = document.getElementById('count-wood');
			count_elm['iron'] = document.getElementById('count-iron');
			count_elm['r-wood'] = document.getElementById('count-r-wood');
			count_elm['r-iron'] = document.getElementById('count-r-iron');
			count_elm['r-rail'] = document.getElementById('count-r-rail');
			count_elm['c-rail'] = document.getElementById('count-c-rail');
			count_elm['bridge'] = document.getElementById('count-bridge');

			// モーダルウィンドウのアウターをクリックしたときにモーダルウィンドウを閉じる
			// modal_window.addEventListener('click', (e) => {
			// 	main_window.classList.remove('blur');
			// 	modal_window.classList.add('hidden');
			// 	modal_window.innerHTML = '';
			// });

			// ツールバーを作成する
			create_toolbar();

			// マップのラッパー要素を作成してメインウィンドウに挿入する
			map_wrapper = create_elm('div#map-table-wrapper.hidden').appendTo(main_window);

			// マップのラッパー要素をフェードイン
			setTimeout(() => {
				map_wrapper.classList.remove('hidden');
			}, 200);

			if (url_queries.share) {

				// URLクエリパラメータにshareが指定されているならそれを読み込む
				open_map_from_str(url_queries.share);
				my_toaster.success( get_lang('toaster-load-share-url') );
				my_console.log('Loaded the URL query paramater.');

			} else if (save_data.last_file_key) {

				// 最後に扱ったファイルが存在すればそれを読み込む
				load(save_data.last_file_key);
				my_toaster.gray( get_lang('toaster-init').replace('{num}', VERSION), 4000 );
				my_console.log('Loaded the save data.');

			} else {

				// 存在しなければまっさらなマップを読み込む
				make_table(BIOME_PLAINS, DEFAULT_WIDTH, DEFAULT_HEIGHT, false);
				my_toaster.gray( get_lang('toaster-init').replace('{num}', VERSION), 4000 );
				my_console.log('Initialized the map table.');

			}

		} catch (e) {

			my_console.error('An error occurred during initialization.');
			console.error(e);

		}
	});

	/** END
	 */

})();