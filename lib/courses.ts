export type Season = "春" | "夏" | "秋" | "冬";
export type WeatherStyle = "晴天" | "曇天" | "雨天";
export type Duration = 30 | 60 | 90;

export interface Course {
  id: number;
  name: string;
  duration: Duration;
  area: string;
  seasons: Season[];
  weatherStyles: WeatherStyle[];
  description: string;
}

export const courses: Course[] = [
  // 春のコース
  {
    id: 1,
    name: "目黒川の桜道",
    duration: 60,
    area: "中目黒",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "約800本の桜が川沿いに続く人気スポット。春の陽気な散歩に最適です。",
  },
  {
    id: 2,
    name: "上野公園の桜散策",
    duration: 90,
    area: "上野",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な敷地に約1200本の桜。博物館や動物園も楽しめる充実コースです。",
  },
  {
    id: 3,
    name: "千鳥ヶ淵の桜トンネル",
    duration: 30,
    area: "千代田区",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "皇居のお堀沿いに続く桜のトンネル。都心の静かな散歩道です。",
  },

  // 夏のコース
  {
    id: 4,
    name: "等々力渓谷の涼散歩",
    duration: 60,
    area: "等々力",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "東京23区唯一の渓谷。木陰と川のせせらぎで涼しく過ごせます。",
  },
  {
    id: 5,
    name: "昭和記念公園の緑道",
    duration: 90,
    area: "立川",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な敷地の木陰道。噴水エリアで涼むこともできる夏の定番コースです。",
  },
  {
    id: 6,
    name: "浜離宮恩賜庭園散策",
    duration: 30,
    area: "汐留",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "海風が心地よい潮入の池がある庭園。都会のオアシスです。",
  },
  {
    id: 7,
    name: "お台場海浜公園の夕涼み",
    duration: 60,
    area: "お台場",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "レインボーブリッジを眺めながら海沿いを散歩。夕方からがおすすめです。",
  },

  // 秋のコース
  {
    id: 8,
    name: "明治神宮外苑のイチョウ並木",
    duration: 30,
    area: "青山",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "146本のイチョウが作る黄金のトンネル。秋の東京を代表する景色です。",
  },
  {
    id: 9,
    name: "六義園の紅葉散策",
    duration: 60,
    area: "駒込",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "美しい日本庭園で紅葉を楽しむ。ライトアップ時期もおすすめです。",
  },
  {
    id: 10,
    name: "代々木公園の紅葉道",
    duration: 90,
    area: "代々木",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "広い芝生と色づく木々。ゆったりと秋を感じられる都会のオアシスです。",
  },
  {
    id: 11,
    name: "国営昭和記念公園の銀杏並木",
    duration: 90,
    area: "立川",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "200mに渡る黄金のイチョウ並木。広大な敷地でゆったり散策できます。",
  },

  // 冬のコース
  {
    id: 12,
    name: "皇居東御苑の静寂散歩",
    duration: 60,
    area: "大手町",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "冬の凛とした空気の中、江戸城跡を巡る歴史散歩が楽しめます。",
  },
  {
    id: 13,
    name: "築地場外市場の食べ歩き散歩",
    duration: 30,
    area: "築地",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "温かい食べ物を楽しみながら散策。冬の寒さも忘れる美味しい散歩です。",
  },
  {
    id: 14,
    name: "丸の内イルミネーション散策",
    duration: 60,
    area: "丸の内",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "美しいイルミネーションが街を彩る冬の夜の散歩コース。",
  },

  // オールシーズン（晴天）
  {
    id: 15,
    name: "浅草寺と仲見世通り散策",
    duration: 60,
    area: "浅草",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "東京を代表する観光スポット。下町情緒あふれる散歩が楽しめます。",
  },
  {
    id: 16,
    name: "谷中銀座の下町散歩",
    duration: 30,
    area: "谷中",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "昭和レトロな商店街と猫がいる街。ゆったりとした時間が流れます。",
  },
  {
    id: 17,
    name: "表参道・原宿ストリート散歩",
    duration: 90,
    area: "表参道",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "最新トレンドとおしゃれなカフェが並ぶ街を散策。",
  },

  // 雨天対応コース
  {
    id: 18,
    name: "東京駅地下街探検",
    duration: 30,
    area: "東京駅",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "広大な地下街を探検。雨を気にせず、グルメやショッピングを楽しめます。",
  },
  {
    id: 19,
    name: "新宿地下街散策",
    duration: 60,
    area: "新宿",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "迷宮のような地下街を散策。雨の日でも快適に歩き回れます。",
  },
  {
    id: 20,
    name: "渋谷スクランブルスクエア周辺",
    duration: 30,
    area: "渋谷",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "屋内施設が充実。展望台や商業施設を巡る都市型散歩。",
  },
  {
    id: 21,
    name: "六本木ヒルズ・ミッドタウン散策",
    duration: 60,
    area: "六本木",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "アートと商業施設を楽しむ雨天対応コース。屋内移動が中心です。",
  },
  {
    id: 22,
    name: "アメ横商店街散策",
    duration: 30,
    area: "上野",
    seasons: ["春", "夏", "秋", "冬"],
    weatherStyles: ["雨天", "曇天"],
    description: "屋根のあるアーケード街。雨でも活気ある下町の雰囲気を楽しめます。",
  },

  // 追加の季節限定コース
  {
    id: 23,
    name: "井の頭公園の新緑散歩",
    duration: 60,
    area: "吉祥寺",
    seasons: ["春"],
    weatherStyles: ["晴天", "曇天"],
    description: "池の周りを新緑が彩る季節。ボートに乗るのもおすすめです。",
  },
  {
    id: 24,
    name: "隅田川テラスの夏夕涼み",
    duration: 90,
    area: "浅草・スカイツリー",
    seasons: ["夏"],
    weatherStyles: ["晴天", "曇天"],
    description: "川沿いを歩きながらスカイツリーを眺める。夕方からがベストです。",
  },
  {
    id: 25,
    name: "新宿御苑の紅葉巡り",
    duration: 90,
    area: "新宿",
    seasons: ["秋"],
    weatherStyles: ["晴天", "曇天"],
    description: "広大な庭園で多様な紅葉を楽しむ。都会とは思えない静けさです。",
  },
  {
    id: 26,
    name: "深大寺の初詣散歩",
    duration: 60,
    area: "調布",
    seasons: ["冬"],
    weatherStyles: ["晴天", "曇天"],
    description: "厳かな雰囲気の古刹と蕎麦屋巡り。冬の澄んだ空気が心地よいコースです。",
  },
];
