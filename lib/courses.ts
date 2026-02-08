export type Season = "春" | "夏" | "秋" | "冬";
export type WeatherStyle = "晴天" | "曇天" | "雨天";
export type Duration = 30 | 60 | 90;

export interface Course {
  id: number;
  name: string;
  duration: Duration;
  distance: number; // 距離（km）
  area: string;
  seasons: Season[];
  weatherStyles: WeatherStyle[];
  description: string;
  startPoint?: string; // スタート地点（住所または場所名）
  endPoint?: string;   // ゴール地点（住所または場所名）
}

// 距離をフォーマットする関数
export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)}km`;
}

// Google Mapsの経路表示URLを生成
export function getGoogleMapsUrl(course: Course): string {
  // スタートとゴールが設定されている場合は経路表示
  if (course.startPoint && course.endPoint) {
    const origin = encodeURIComponent(course.startPoint);
    const destination = encodeURIComponent(course.endPoint);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
  }

  // 設定されていない場合は検索表示
  const query = encodeURIComponent(`${course.name} ${course.area}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

// Google Maps埋め込みURLを生成
export function getGoogleMapsEmbedUrl(course: Course): string {
  const query = encodeURIComponent(`${course.name} ${course.area}`);
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${query}`;
}

export const courses: Course[] = [
  // 春のコース
  {
    id: 1,
    name: "目黒川の桜道",
    duration: 60,
    distance: 4.5,
    area: "中目黒",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "約800本の桜が川沿いに続く人気スポット。春の陽気な散歩に最適です。",
    startPoint: "中目黒駅",
    endPoint: "池尻大橋駅",
  },
  {
    id: 2,
    name: "上野公園の桜散策",
    duration: 90,
    distance: 6.8,
    area: "上野",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な敷地に約1200本の桜。博物館や動物園も楽しめる充実コースです。",
    startPoint: "上野駅",
    endPoint: "鶯谷駅",
  },
  {
    id: 3,
    name: "千鳥ヶ淵の桜トンネル",
    duration: 30,
    distance: 2.3,
    area: "千代田区",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "皇居のお堀沿いに続く桜のトンネル。都心の静かな散歩道です。",
    startPoint: "九段下駅",
    endPoint: "半蔵門駅",
  },

  // 夏のコース
  {
    id: 4,
    name: "等々力渓谷の涼散歩",
    duration: 60,
    distance: 4.2,
    area: "等々力",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "東京23区唯一の渓谷。木陰と川のせせらぎで涼しく過ごせます。",
    startPoint: "等々力駅",
    endPoint: "等々力不動尊",
  },
  {
    id: 5,
    name: "昭和記念公園の緑道",
    duration: 90,
    distance: 7.0,
    area: "立川",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な敷地の木陰道。噴水エリアで涼むこともできる夏の定番コースです。",
    startPoint: "立川駅",
    endPoint: "昭島駅",
  },
  {
    id: 6,
    name: "浜離宮恩賜庭園散策",
    duration: 30,
    distance: 2.0,
    area: "汐留",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "海風が心地よい潮入の池がある庭園。都会のオアシスです。",
    startPoint: "汐留駅",
    endPoint: "築地市場駅",
  },
  {
    id: 7,
    name: "お台場海浜公園の夕涼み",
    duration: 60,
    distance: 4.8,
    area: "お台場",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "レインボーブリッジを眺めながら海沿いを散歩。夕方からがおすすめです。",
    startPoint: "お台場海浜公園駅",
    endPoint: "台場駅",
  },

  // 秋のコース
  {
    id: 8,
    name: "明治神宮外苑のイチョウ並木",
    duration: 30,
    distance: 2.2,
    area: "青山",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "146本のイチョウが作る黄金のトンネル。秋の東京を代表する景色です。",
    startPoint: "青山一丁目駅",
    endPoint: "外苑前駅",
  },
  {
    id: 9,
    name: "六義園の紅葉散策",
    duration: 60,
    distance: 4.5,
    area: "駒込",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "美しい日本庭園で紅葉を楽しむ。ライトアップ時期もおすすめです。",
    startPoint: "駒込駅",
    endPoint: "巣鴨駅",
  },
  {
    id: 10,
    name: "代々木公園の紅葉道",
    duration: 90,
    distance: 6.5,
    area: "代々木",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "広い芝生と色づく木々。ゆったりと秋を感じられる都会のオアシスです。",
    startPoint: "原宿駅",
    endPoint: "代々木公園駅",
  },
  {
    id: 11,
    name: "国営昭和記念公園の銀杏並木",
    duration: 90,
    distance: 7.2,
    area: "立川",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "200mに渡る黄金のイチョウ並木。広大な敷地でゆったり散策できます。",
    startPoint: "西立川駅",
    endPoint: "立川駅",
  },

  // 冬のコース
  {
    id: 12,
    name: "皇居東御苑の静寂散歩",
    duration: 60,
    distance: 4.3,
    area: "大手町",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "冬の凛とした空気の中、江戸城跡を巡る歴史散歩が楽しめます。",
    startPoint: "大手町駅",
    endPoint: "竹橋駅",
  },
  {
    id: 13,
    name: "築地場外市場の食べ歩き散歩",
    duration: 30,
    distance: 2.1,
    area: "築地",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "温かい食べ物を楽しみながら散策。冬の寒さも忘れる美味しい散歩です。",
    startPoint: "築地市場駅",
    endPoint: "築地駅",
  },
  {
    id: 14,
    name: "丸の内イルミネーション散策",
    duration: 60,
    distance: 4.0,
    area: "丸の内",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "美しいイルミネーションが街を彩る冬の夜の散歩コース。",
    startPoint: "東京駅",
    endPoint: "有楽町駅",
  },

  // オールシーズン（晴天）
  {
    id: 15,
    name: "浅草寺と仲見世通り散策",
    duration: 60,
    distance: 4.5,
    area: "浅草",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "東京を代表する観光スポット。下町情緒あふれる散歩が楽しめます。",
    startPoint: "浅草駅",
    endPoint: "東京スカイツリー",
  },
  {
    id: 16,
    name: "谷中銀座の下町散歩",
    duration: 30,
    distance: 2.3,
    area: "谷中",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "昭和レトロな商店街と猫がいる街。ゆったりとした時間が流れます。",
    startPoint: "日暮里駅",
    endPoint: "根津駅",
  },
  {
    id: 17,
    name: "表参道・原宿ストリート散歩",
    duration: 90,
    distance: 6.8,
    area: "表参道",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "最新トレンドとおしゃれなカフェが並ぶ街を散策。",
    startPoint: "原宿駅",
    endPoint: "表参道駅",
  },

  // 雨天対応コース
  {
    id: 18,
    name: "東京駅地下街探検",
    duration: 30,
    distance: 2.0,
    area: "東京駅",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "広大な地下街を探検。雨を気にせず、グルメやショッピングを楽しめます。",
    startPoint: "東京駅八重洲口",
    endPoint: "東京駅丸の内口",
  },
  {
    id: 19,
    name: "新宿地下街散策",
    duration: 60,
    distance: 4.0,
    area: "新宿",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "迷宮のような地下街を散策。雨の日でも快適に歩き回れます。",
    startPoint: "新宿駅西口",
    endPoint: "新宿三丁目駅",
  },
  {
    id: 20,
    name: "渋谷スクランブルスクエア周辺",
    duration: 30,
    distance: 2.2,
    area: "渋谷",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "屋内施設が充実。展望台や商業施設を巡る都市型散歩。",
    startPoint: "渋谷駅",
    endPoint: "渋谷ヒカリエ",
  },
  {
    id: 21,
    name: "六本木ヒルズ・ミッドタウン散策",
    duration: 60,
    distance: 4.3,
    area: "六本木",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "アートと商業施設を楽しむ雨天対応コース。屋内移動が中心です。",
    startPoint: "六本木駅",
    endPoint: "乃木坂駅",
  },
  {
    id: 22,
    name: "アメ横商店街散策",
    duration: 30,
    distance: 2.1,
    area: "上野",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "屋根のあるアーケード街。雨でも活気ある下町の雰囲気を楽しめます。",
    startPoint: "上野駅",
    endPoint: "御徒町駅",
  },

  // 追加の季節限定コース
  {
    id: 23,
    name: "井の頭公園の新緑散歩",
    duration: 60,
    distance: 4.6,
    area: "吉祥寺",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "池の周りを新緑が彩る季節。ボートに乗るのもおすすめです。",
    startPoint: "吉祥寺駅",
    endPoint: "井の頭公園駅",
  },
  {
    id: 24,
    name: "隅田川テラスの夏夕涼み",
    duration: 90,
    distance: 7.5,
    area: "浅草・スカイツリー",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "川沿いを歩きながらスカイツリーを眺める。夕方からがベストです。",
    startPoint: "浅草駅",
    endPoint: "とうきょうスカイツリー駅",
  },
  {
    id: 25,
    name: "新宿御苑の紅葉巡り",
    duration: 90,
    distance: 6.7,
    area: "新宿",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な庭園で多様な紅葉を楽しむ。都会とは思えない静けさです。",
    startPoint: "新宿御苑前駅",
    endPoint: "新宿三丁目駅",
  },
  {
    id: 26,
    name: "深大寺の初詣散歩",
    duration: 60,
    distance: 4.4,
    area: "調布",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "厳かな雰囲気の古刹と蕎麦屋巡り。冬の澄んだ空気が心地よいコースです。",
    startPoint: "調布駅",
    endPoint: "深大寺",
  },

  // 追加コース（春）
  {
    id: 27,
    name: "小石川後楽園の桜と庭園",
    duration: 60,
    distance: 4.1,
    area: "後楽園",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "江戸時代の大名庭園で桜と新緑を楽しむ。水戸黄門ゆかりの地です。",
    startPoint: "後楽園駅",
    endPoint: "飯田橋駅",
  },
  {
    id: 28,
    name: "神楽坂の石畳散歩",
    duration: 30,
    distance: 2.4,
    area: "神楽坂",
    seasons: ["春", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "情緒ある石畳の坂道と路地裏を散策。隠れ家的なカフェやレストランが魅力です。",
    startPoint: "飯田橋駅",
    endPoint: "神楽坂駅",
  },

  // 追加コース（夏）
  {
    id: 29,
    name: "清澄庭園の涼散歩",
    duration: 60,
    distance: 4.3,
    area: "清澄白河",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "池と石が美しい回遊式庭園。木陰で涼みながらゆったり散策できます。",
    startPoint: "清澄白河駅",
    endPoint: "門前仲町駅",
  },
  {
    id: 30,
    name: "二子玉川河川敷散歩",
    duration: 90,
    distance: 6.9,
    area: "二子玉川",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "多摩川沿いの広々とした河川敷。川風が心地よい夏の散歩コースです。",
    startPoint: "二子玉川駅",
    endPoint: "二子新地駅",
  },

  // 追加コース（秋）
  {
    id: 31,
    name: "小金井公園の紅葉散策",
    duration: 90,
    distance: 7.3,
    area: "小金井",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "都内屈指の広さを誇る公園。紅葉の木々が美しく、ゆったり散策できます。",
    startPoint: "武蔵小金井駅",
    endPoint: "花小金井駅",
  },
  {
    id: 32,
    name: "自由が丘の街歩き",
    duration: 60,
    distance: 4.4,
    area: "自由が丘",
    seasons: ["春", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "おしゃれなショップやカフェが並ぶ街。落ち着いた雰囲気の散歩が楽しめます。",
    startPoint: "自由が丘駅",
    endPoint: "奥沢駅",
  },

  // 追加コース（冬）
  {
    id: 33,
    name: "恵比寿ガーデンプレイス散策",
    duration: 30,
    distance: 2.5,
    area: "恵比寿",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "冬のイルミネーションが美しい複合施設。おしゃれなレストランも充実です。",
    startPoint: "恵比寿駅",
    endPoint: "代官山駅",
  },
  {
    id: 34,
    name: "品川シーサイド散歩",
    duration: 60,
    distance: 4.7,
    area: "品川",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "運河沿いの遊歩道を散策。近代的なビル群と水辺の景色が楽しめます。",
    startPoint: "品川駅",
    endPoint: "天王洲アイル駅",
  },

  // オールシーズン追加
  {
    id: 35,
    name: "下北沢の古着屋巡り",
    duration: 60,
    distance: 4.2,
    area: "下北沢",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "個性的なショップやライブハウスが並ぶサブカルチャーの街。散策が楽しい街です。",
    startPoint: "下北沢駅",
    endPoint: "世田谷代田駅",
  },
  {
    id: 36,
    name: "吉祥寺サンロード商店街",
    duration: 30,
    distance: 2.2,
    area: "吉祥寺",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "アーケード商店街で雨の日でも快適。グルメやショッピングが楽しめます。",
    startPoint: "吉祥寺駅",
    endPoint: "吉祥寺駅北口",
  },
];
