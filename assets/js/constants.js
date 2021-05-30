export const VERSION = '1.4';
export const DEFAULT_WIDTH  = 40;
export const DEFAULT_HEIGHT = 20;
export const AUTOSAVE_DELAY = 1000;
export const UNDO_STACK_LENGTH_MAX = 100;

export const BIOME_PLAINS = 'plains';
export const BIOME_DESERT = 'desert';
export const BIOME_SNOW   = 'snow';
export const BIOME_HELL   = 'hell';
export const BIOME_SPACE  = 'space';
export const BIOME_MARS   = 'mars';

export const LAND_NONE      = 'none';
export const LAND_PLAIN     = 'plain';
export const LAND_WATER     = 'water';
export const LAND_IRON      = 'iron';
export const LAND_TREE      = 'tree';
export const LAND_ROCK      = 'rock';
export const LAND_BRIDGE    = 'bridge';
export const LAND_STEAM     = 'steam';
export const LAND_THORN     = 'thorn';
export const LAND_STATION_L = 'station-l';
export const LAND_STATION_R = 'station-r';
export const LAND_STATION_F = 'station-f';
export const LAND_COLOR     = 'color';
export const LAND_COLOR_1    = 'color-1';
export const LAND_COLOR_2    = 'color-2';
export const LAND_COLOR_3    = 'color-3';
export const LAND_COLOR_4    = 'color-4';
export const LAND_COLOR_5    = 'color-5';
export const LAND_COLOR_6    = 'color-6';
export const LAND_COLOR_7    = 'color-7';
export const LAND_COLOR_8    = 'color-8';
export const LAND_COLOR_9    = 'color-9';
export const LAND_COLOR_10   = 'color-10';

export const RESOURCE_NONE         = 'none';
export const RESOURCE_C_RAIL       = 'c-rail';
export const RESOURCE_RAIL         = 'rail';
export const RESOURCE_WOOD         = 'resource-wood';
export const RESOURCE_IRON         = 'resource-iron';
export const RESOURCE_DYNAMITE_1   = 'resource-dynamite-1';
export const RESOURCE_DYNAMITE_2   = 'resource-dynamite-2';
export const RESOURCE_DYNAMITE_3   = 'resource-dynamite-3';
export const RESOURCE_DYNAMITE_4   = 'resource-dynamite-4';
export const RESOURCE_DYNAMITE_5   = 'resource-dynamite-5';
export const RESOURCE_DYNAMITE_6   = 'resource-dynamite-6';
export const RESOURCE_DYNAMITE_7   = 'resource-dynamite-7';
export const RESOURCE_DYNAMITE_8   = 'resource-dynamite-8';
export const RESOURCE_DYNAMITE_9   = 'resource-dynamite-9';
export const RESOURCE_BACKET       = 'resource-backet';
export const RESOURCE_BACKET_EMPTY = 'resource-backet-empty';
export const RESOURCE_AXE          = 'resource-axe';
export const RESOURCE_PICKAXE      = 'resource-pickaxe';
export const RESOURCE_BOLT         = 'resource-bolt';
export const RESOURCE_ERASER       = 'resource-eraser';
export const RESOURCE_FACE         = 'resource-face';
export const RESOURCE_SYMBOL       = 'resource-symbol';

export const SYMBOL_ERASER         = 'symbol-eraser';
export const SYMBOL_SYMBOL         = 'symbol-symbol';
export const SYMBOL_FACE           = 'symbol-face';
export const SYMBOL_NONE           = 'symbol-none';

export const MINE_AXE      = 'mine-axe-and-pickaxe';
export const MINE_DYNAMITE = 'mine-dynamite';

export const PALETTE_SELECT_LAND     = 'land';
export const PALETTE_SELECT_RESOURCE = 'resource';
export const PALETTE_SELECT_SYMBOL   = 'symbol';
export const PALETTE_SELECT_MINE     = 'mine';
export const PALETTE_SELECT_TRAIN    = 'train';

export const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
export const DIR_NONE = -1;
export const DIR_TOP = 0;
export const DIR_RIGHT = 1;
export const DIR_BOTTOM = 2;
export const DIR_LEFT = 3;

export const TRAIN_ENGINE_LENGTH = 2;
export const TRAIN_WAGON_LENGTH = 1.65;
export const WAGON_NAMES = [
	'CraftingWagon',
	'StorageWagon',
	'TankWagon',
	'DynamiteWagon',
	'SuperchargerWagon',
	'CollectorWagon',
	'BrakeWagon',
	'GhostWagon',
	'BuckinatorWagon',
	'MilkWagon',
	'MinerWagon',
	'TransformerWagon',
	'SlotMachineWagon',
	'LightWagon',
	'CompassWagon',
	'CannonWagon',
];

/** 定数定義 - ダイナマイト
 */
export const DYNAMITE_RANGE_STR_DEF = {
	'○': 3,
	'■': 3,
	'１': 2,
	'２': 1,
	'３': 0,
};
export const DYNAMITE_RANGE_STR = [
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
export const DYNAMITE_RANGE = (() => {
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
export const LANG_DEF = `
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
palette-symbol-face|キャラクター|Character
palette-mine-axe-and-pickaxe|斧とつるはしで採掘する|Mine with axe and pickaxe
palette-mine-dynamite|ダイナマイトで採掘する|Mine with dynamite
palette-train|列車を置く|Put train
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
toolbar-mine-tools|採掘|Mine
toolbar-train|列車|Train
toolbar-map-size|マップサイズ|Map Size
toolbar-grid|罫線|Grid
toolbar-count|カウンター|Counter
toolbar-download-image|画像を保存|Download Image
toolbar-share|共有|Share
toolbar-share-url|共有URL|Share URL
toolbar-embed-tag|埋め込み用タグ|Embet Tag
toolbar-copy|コピー|Copy
toolbar-close|閉じる|Close
toolbar-train|列車|Train
toolbar-delete|削除|Delete
toolbar-undo|戻す|Undo
toolbar-redo|進む|Redo
toolbar-train-edit|編集|Edit
toolbar-train-reverse|反転|Reverse
toolbar-train-remove|削除|Remove
train-edit-description-1|ワゴンの追加 ⋯ パレットのワゴンをクリック|Add wagon ... Click on the wagon in the palette
train-edit-description-2|ワゴンの変更 ⋯ パレットのワゴンを列車のワゴンにドラッグ＆ドロップ|Change wagon ... drag and drop pallet wagon to train wagon
train-edit-description-3|ワゴンの並べ替え ⋯ 列車のワゴンをドラッグ＆ドロップ|Rearrange wagons ... Drag and drop train wagons
train-edit-description-4|ワゴンの削除 ⋯ 列車のワゴンをゴミ箱または列車の外側にドラッグ＆ドロップ|Remove wagons ... Drag and drop train wagons to the trash or outside the train
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
count-sup|※駅の下3マスを除く|*Excluding under stations.
open-table-title|ファイル名|Title
open-table-created|作成日時|Created
open-table-modified|更新日時|Modified
open-table-open|開く|Open
open-table-delete|削除|Delete
confirm-delete|「{name}」を削除します。よろしいですか？|Delete "{name}". Are you sure?
confirm-new|現在編集中の内容は失われます。よろしいですか？|Any content currently being edited will be lost. Are you sure?
CraftingWagon    |クラフトワゴン        |Crafting Wagon
StorageWagon     |貨物ワゴン            |Storage Wagon
TankWagon        |タンクワゴン          |Tank Wagon
DynamiteWagon    |ダイナマイトワゴン    |Dynamite Wagon
SuperchargerWagon|スーパーチャージワゴン|Supercharger Wagon
CollectorWagon   |バキュームワゴン      |Collector Wagon
BrakeWagon       |ブレーキワゴン        |Brake Wagon
GhostWagon       |ゴーストワゴン        |Ghost Wagon
BuckinatorWagon  |バッキネーター        |Buckinator Wagon
MilkWagon        |ミルクワゴン          |Milk Wagon
MinerWagon       |採掘ワゴン            |Miner Wagon
TransformerWagon |変換ワゴン            |Transformer Wagon
SlotMachineWagon |スロットワゴン        |SlotMachine Wagon
LightWagon       |照明ワゴン            |Light Wagon
CompassWagon     |コンパスワゴン        |Compass Wagon
CannonWagon      |大砲ワゴン            |Cannon Wagon
`;
export const LANG = (() => {
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