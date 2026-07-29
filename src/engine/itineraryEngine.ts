import type {
  PlannerInput,
  Itinerary,
  DayPlan,
  Activity,
  Season,
  Interest,
  Resource,
  District,
  Attraction,
  Food,
  ShoppingMall,
  Mountain,
} from "@/types";
import { attractions } from "@/data/attractions";
import { foods } from "@/data/foods";
import { cultures } from "@/data/cultures";
import { shoppings, mountains } from "@/data/shoppings";

// ===================== 工具函数 =====================
const genId = () => Math.random().toString(36).slice(2, 10);

// Haversine 距离计算（公里）
export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const allResources: Resource[] = [
  ...attractions,
  ...foods,
  ...cultures,
  ...shoppings,
  ...mountains,
];

export function getResourceById(id: string): Resource | undefined {
  return allResources.find((r) => r.id === id);
}

function addMinutes(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// ===================== 兴趣权重打分 =====================
export function scoreResourceByInterest(
  resource: Resource,
  interests: Interest[]
): number {
  if (interests.length === 0) return resource.rating;

  let score = resource.rating;
  const interestWeights: Record<Interest, number> = {} as Record<
    Interest,
    number
  >;
  const perWeight = 1 / interests.length;
  interests.forEach((i) => (interestWeights[i] = perWeight));

  if (interestWeights.history) {
    const w = interestWeights.history;
    if (resource.category === "culture") score += 3 * w;
    if (resource.category === "attraction") {
      const att = resource as Attraction;
      if (att.historical) score += 2.5 * w;
      if (/明|陵|宫|寺|博物馆|六朝|民国|城墙|碑/.test(resource.name))
        score += 1.5 * w;
    }
  }

  if (interestWeights.food) {
    const w = interestWeights.food;
    if (resource.category === "food") score += 4 * w;
  }

  if (interestWeights.photo) {
    const w = interestWeights.photo;
    if (resource.category === "attraction") {
      const att = resource as Attraction;
      if (att.photoFriendly) score += 3 * w;
    }
    if (/樱花|枫|银杏|秋|春|花|湖|夜景|塔|古|街/.test(resource.name))
      score += 1.5 * w;
  }

  if (interestWeights.hiking) {
    const w = interestWeights.hiking;
    if (resource.category === "mountain") score += 4 * w;
    if (/山|峰|登山|爬|紫金山|栖霞|牛首|老山/.test(resource.name))
      score += 2 * w;
  }

  if (interestWeights.shopping) {
    const w = interestWeights.shopping;
    if (resource.category === "shopping") score += 4 * w;
  }

  return score;
}

// ===================== 季节适配 =====================
export function getSeasonStartEnd(season: Season): {
  outdoorStart: string;
  outdoorEnd: string;
  indoorStart: string;
  indoorEnd: string;
  wakeUp: string;
  sleep: string;
} {
  switch (season) {
    case "summer":
      return {
        outdoorStart: "07:30",
        outdoorEnd: "11:30",
        indoorStart: "11:30",
        indoorEnd: "15:30",
        wakeUp: "07:00",
        sleep: "22:30",
      };
    case "winter":
      return {
        outdoorStart: "09:30",
        outdoorEnd: "16:30",
        indoorStart: "12:00",
        indoorEnd: "13:30",
        wakeUp: "08:30",
        sleep: "22:00",
      };
    case "spring":
    case "autumn":
    default:
      return {
        outdoorStart: "08:30",
        outdoorEnd: "17:30",
        indoorStart: "12:00",
        indoorEnd: "13:30",
        wakeUp: "07:30",
        sleep: "22:30",
      };
  }
}

export function isSummerHotZone(timeStr: string, season: Season): boolean {
  if (season !== "summer") return false;
  const t = timeToMinutes(timeStr);
  return t >= timeToMinutes("11:30") && t < timeToMinutes("15:30");
}

export function isWinterColdZone(timeStr: string, season: Season): boolean {
  if (season !== "winter") return false;
  const t = timeToMinutes(timeStr);
  return t < timeToMinutes("09:30");
}

export function getSeasonalFoods(season: Season): Food[] {
  return foods.filter((f) =>
    f.seasonalDishes.some((sd) => sd.season === season)
  );
}

export function getSeasonalAttractions(season: Season): Attraction[] {
  return attractions.filter((a) => a.bestSeasons.includes(season));
}

// ===================== 夜间活动池（轮换，避免重复秦淮河） =====================
const NIGHT_ACTIVITIES_BY_SEASON: Record<
  Season,
  Array<{ name: string; description: string; location: string; district: District; duration: number; tips: string; cost?: string; category: string }>
> = {
  summer: [
    {
      name: "🌙 夜游秦淮河夫子庙",
      description: "夏季夜凉如水，秦淮河画舫夜游，灯影桨声，体验'夜泊秦淮近酒家'的诗意",
      location: "夫子庙秦淮河",
      district: "秦淮区",
      duration: 90,
      tips: "推荐19:30后去，21:00-22:00最美",
      cost: "画舫夜游约80-100元",
      category: "summer-qinhuai",
    },
    {
      name: "🎆 老门东夜游+金陵寻味",
      description: "青砖黛瓦的老门东夜晚灯火如星，逛文创小店+街头小吃，比夫子庙更地道",
      location: "老门东历史街区",
      district: "秦淮区",
      duration: 90,
      tips: "推荐19:00后去，蒋有记、小郑酥烧饼、陆氏梅花糕夜场更热闹",
      cost: "免费，小吃人均50元",
      category: "summer-laomendong",
    },
    {
      name: "🎇 南京眼步行桥夜景",
      description: "青奥文化公园南京眼+双子塔，现代南京的绝美夜景，江风习习降温",
      location: "南京眼步行桥",
      district: "建邺区",
      duration: 60,
      tips: "建议日落半小时后去，灯光全开，桥上可拍双子塔+江心洲",
      cost: "免费",
      category: "summer-nanjing-eye",
    },
    {
      name: "🍢 南湖夜宵文化广场",
      description: "南京本地人的深夜食堂，南湖砂锅、烧烤、炸鸡，烟火气十足",
      location: "南湖美食广场",
      district: "建邺区",
      duration: 90,
      tips: "20:00后最热闹，推荐: 金陵杨家馄饨、金原鸭血粉丝总店、胖子砂锅",
      cost: "人均60-80元",
      category: "summer-nanhu",
    },
  ],
  winter: [
    {
      name: "♨️ 汤山温泉夜泡",
      description: "冬日养生：千年圣汤汤山温泉，星空下泡汤，洗去一天疲惫",
      location: "汤山温泉度假区",
      district: "江宁区",
      duration: 150,
      tips: "推荐颐尚温泉、紫清湖温泉（有熊猫馆），记得先冲澡再泡",
      cost: "人均150-300元",
      category: "winter-hotspring",
    },
    {
      name: "🏮 老门东灯会/年味",
      description: "南京的春节气息最浓处：秦淮灯彩、糖画、捏面人，满满的年味",
      location: "老门东历史街区",
      district: "秦淮区",
      duration: 90,
      tips: "12月-2月有灯会，晚上亮灯5点后最漂亮，可和夫子庙秦淮灯会连起来",
      cost: "街区免费，灯会约80元",
      category: "winter-laomendong-lantern",
    },
    {
      name: "🌙 夜游秦淮河（冬装船）",
      description: "冬季画舫船上有空调，人少清净，两岸灯火更美，不用排队",
      location: "夫子庙秦淮河",
      district: "秦淮区",
      duration: 90,
      tips: "冬季船票约7折，人少体验好，多穿一件衣服",
      cost: "画舫夜游约80元",
      category: "winter-qinhuai",
    },
  ],
  spring: [
    {
      name: "🌃 1912民国风情夜游",
      description: "百年民国建筑改建的酒吧餐饮街区，总统府旁边，灯火阑珊",
      location: "南京1912街区",
      district: "玄武区",
      duration: 90,
      tips: "推荐从长江路步行前往，与江宁织造博物馆、总统府夜景一起看",
      cost: "免费，餐饮人均80-150元",
      category: "spring-1912",
    },
    {
      name: "🌙 夜游秦淮河夫子庙",
      description: "春日秦淮河畔柳绿花红，乘画舫赏两岸花灯，春意盎然",
      location: "夫子庙秦淮河",
      district: "秦淮区",
      duration: 90,
      tips: "19:00后，避开周末高峰，可在泮池码头排队",
      cost: "画舫夜游约80-100元",
      category: "spring-qinhuai",
    },
    {
      name: "🌸 玄武湖夜樱/花灯",
      description: "3-4月鸡鸣寺路夜樱延伸到解放门玄武湖段，夜色下的樱花别有风味",
      location: "玄武湖解放门-鸡鸣寺",
      district: "玄武区",
      duration: 60,
      tips: "3月中下旬樱花季最佳，解放门入园17:30后免票",
      cost: "免费",
      category: "spring-xuanwu-sakura",
    },
  ],
  autumn: [
    {
      name: "🌃 颐和路公馆区夜游",
      description: "秋日梧桐、民国公馆、昏黄的路灯，一条颐和路半部民国史的夜之美",
      location: "颐和路民国公馆区",
      district: "鼓楼区",
      duration: 60,
      tips: "18:30-20:30最佳，路灯下的梧桐叶超级出片，路面安静",
      cost: "免费",
      category: "autumn-yihelu",
    },
    {
      name: "🍁 栖霞山夜枫（如果有）/ 阅江楼夜景",
      description: "登阅江楼看长江夜景，远眺长江大桥灯火，俯瞰金陵一江两岸",
      location: "阅江楼风景区",
      district: "鼓楼区",
      duration: 90,
      tips: "17:30后亮灯，登楼门票40元，一楼的朱元璋壁画值得看",
      cost: "40元",
      category: "autumn-yuejianglou",
    },
    {
      name: "🌙 夜游秦淮河夫子庙",
      description: "秋高气爽，夜泊秦淮听导游讲六朝金粉往事，桂花飘香",
      location: "夫子庙秦淮河",
      district: "秦淮区",
      duration: 90,
      tips: "19:00后，桂花季船上可闻到桂花香",
      cost: "画舫夜游约80-100元",
      category: "autumn-qinhuai",
    },
  ],
};

// ===================== 路线优化 + 分天聚类（解决珍珠泉↔佘村问题） =====================
interface Locatable {
  location: { lat: number; lng: number };
  district: District;
  id: string;
}

export function optimizeRoute<T extends Locatable>(
  items: T[],
  start?: { lat: number; lng: number }
): T[] {
  if (items.length <= 1) return items;
  const byDistrict = new Map<District, T[]>();
  items.forEach((it) => {
    if (!byDistrict.has(it.district)) byDistrict.set(it.district, []);
    byDistrict.get(it.district)!.push(it);
  });

  const origin = start ?? { lat: 32.04, lng: 118.78 };
  const districts = Array.from(byDistrict.keys());
  districts.sort((a, b) => {
    const aCenter = centroid(byDistrict.get(a)!);
    const bCenter = centroid(byDistrict.get(b)!);
    return (
      haversine(origin.lat, origin.lng, aCenter.lat, aCenter.lng) -
      haversine(origin.lat, origin.lng, bCenter.lat, bCenter.lng)
    );
  });

  const result: T[] = [];
  let cursor = origin;
  for (const d of districts) {
    let pool = [...byDistrict.get(d)!];
    while (pool.length) {
      pool.sort(
        (a, b) =>
          haversine(cursor.lat, cursor.lng, a.location.lat, a.location.lng) -
          haversine(cursor.lat, cursor.lng, b.location.lat, b.location.lng)
      );
      const nxt = pool.shift()!;
      result.push(nxt);
      cursor = nxt.location;
    }
  }
  return result;
}

function centroid<T extends Locatable>(items: T[]): {
  lat: number;
  lng: number;
} {
  const n = items.length;
  return {
    lat: items.reduce((s, i) => s + i.location.lat, 0) / n,
    lng: items.reduce((s, i) => s + i.location.lng, 0) / n,
  };
}

/**
 * 把优化后的景点列表按「天」聚类，避免珍珠泉（浦口区）+佘村（江宁区）这种
 * 地理跨度 >25km 的组合被硬塞到同一天
 */
function splitIntoDayClusters<T extends Locatable & { recommendedDuration: number }>(
  ordered: T[],
  days: number
): T[][] {
  if (days <= 1) return [ordered];
  if (ordered.length <= days) {
    // 景点比天数还少，每天一个
    const res: T[][] = [];
    let idx = 0;
    for (let i = 0; i < days; i++) {
      res.push(ordered[idx] ? [ordered[idx++]] : []);
    }
    let roundRobin = 0;
    while (idx < ordered.length) {
      res[roundRobin % res.length].push(ordered[idx++]);
      roundRobin++;
    }
    return res.filter((c) => c.length > 0);
  }

  const MAX_CLUSTER_SPAN_KM = 22; // 同一天景点最大跨度（新街口→汤山约20km、→珍珠泉约15km），超了容易"南辕北辙"
  const clusters: T[][] = [];
  const targetPerDay = Math.ceil(ordered.length / days);
  let current: T[] = [];
  let farthestInCluster: T | null = null;

  const pushAndReset = () => {
    if (current.length) clusters.push(current);
    current = [];
    farthestInCluster = null;
  };

  for (let i = 0; i < ordered.length; i++) {
    const item = ordered[i];
    if (current.length === 0) {
      current.push(item);
      farthestInCluster = item;
      continue;
    }
    // 候选item距离当前簇质心的距离
    const c = centroid(current);
    const distC = haversine(c.lat, c.lng, item.location.lat, item.location.lng);
    // 候选item和簇中最远景点的距离（避免珍珠泉-佘村）
    const distF = farthestInCluster
      ? haversine(farthestInCluster.location.lat, farthestInCluster.location.lng, item.location.lat, item.location.lng)
      : 0;

    const sizeOk = current.length < targetPerDay + 1;
    const spanOk = distC <= MAX_CLUSTER_SPAN_KM && distF <= MAX_CLUSTER_SPAN_KM;

    if (sizeOk && spanOk) {
      current.push(item);
      if (farthestInCluster && distF > haversine(c.lat, c.lng, farthestInCluster.location.lat, farthestInCluster.location.lng)) {
        farthestInCluster = item;
      }
    } else {
      pushAndReset();
      current.push(item);
      farthestInCluster = item;
    }
  }
  pushAndReset();

  // 如果簇比天数多（贪心切多了），合并最近的小簇直到簇数=天数
  while (clusters.length > days) {
    // 找相邻两个簇合并后总质心距离最小的一对
    let minIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < clusters.length - 1; i++) {
      const ca = centroid(clusters[i]);
      const cb = centroid(clusters[i + 1]);
      const d = haversine(ca.lat, ca.lng, cb.lat, cb.lng);
      if (d < minDist) {
        minDist = d;
        minIdx = i;
      }
    }
    clusters[minIdx] = clusters[minIdx].concat(clusters[minIdx + 1]);
    clusters.splice(minIdx + 1, 1);
  }
  // 如果簇比天数少，挑规模最大的簇，从中间切开（按顺序），直到簇数=天数
  while (clusters.length < days) {
    let maxIdx = 0;
    for (let i = 0; i < clusters.length; i++) {
      if (clusters[i].length > clusters[maxIdx].length) maxIdx = i;
    }
    const c = clusters[maxIdx];
    if (c.length <= 1) break; // 没法切了
    const half = Math.floor(c.length / 2);
    clusters[maxIdx] = c.slice(0, half);
    clusters.splice(maxIdx + 1, 0, c.slice(half));
  }
  return clusters;
}

// ===================== 主生成器 =====================
export function generateItinerary(input: PlannerInput): Itinerary {
  const { interests, days, season } = input;
  const seasonConf = getSeasonStartEnd(season);
  const daysNum = Math.max(1, Math.min(10, days));

  // Step 1: 选资源
  const mainResources: (Attraction | Mountain | ShoppingMall)[] = [
    ...attractions,
    ...mountains,
    ...shoppings,
  ];
  const scored = mainResources
    .map((r) => ({
      r,
      s:
        scoreResourceByInterest(r, interests) *
        (r.bestSeasons.includes(season) ? 1.3 : 1.0),
    }))
    .sort((a, b) => b.s - a.s);

  const totalMainSlots = daysNum * (interests.includes("hiking") ? 2 : 3);
  const selectedMain = scored
    .slice(0, Math.min(totalMainSlots + 5, scored.length))
    .map((x) => x.r);

  const optimized = optimizeRoute(selectedMain);

  const seasonalFoods = getSeasonalFoods(season);
  const generalFoods = foods.filter((f) =>
    ["lunch", "dinner"].some((mt) => f.mealTime.includes(mt as never))
  );
  const allFoodPool = [...seasonalFoods, ...generalFoods];

  // Step 2: 分天（地理聚类切分，避免南辕北辙）
  const durational: Array<(Attraction | Mountain | ShoppingMall) & { recommendedDuration: number }> = optimized.map((o) => {
    const rd =
      o.category === "mountain"
        ? (o as Mountain).hikingDuration
        : o.recommendedDuration;
    return Object.assign({}, o, { recommendedDuration: rd });
  });
  const clusters = splitIntoDayClusters(durational, daysNum);

  // ===== 夜间活动：跨天共用 usedNightCategories，保证不重复 =====
  const usedNightCategories = new Set<string>();
  const winterSpringSummerAutumn = season; // 引用避免lint误报

  const daysPlans: DayPlan[] = [];
  for (let d = 0; d < daysNum; d++) {
    const dayMain = clusters[d] ?? [];
    const dayPlan = buildSingleDay(
      d + 1,
      daysNum,
      dayMain,
      allFoodPool,
      winterSpringSummerAutumn,
      seasonConf,
      interests,
      usedNightCategories
    );
    daysPlans.push(dayPlan);
  }

  const summary = buildSummary(input, daysPlans);
  const tips = buildTips(input, daysPlans);
  const budget = estimateBudget(input, daysPlans);

  return {
    id: genId(),
    generatedAt: new Date().toISOString(),
    input,
    summary,
    days: daysPlans,
    totalBudgetEstimate: budget,
    tips,
  };
}

function buildSingleDay(
  dayNum: number,
  totalDays: number,
  mains: Array<(Attraction | Mountain | ShoppingMall) & { recommendedDuration: number }>,
  foodPool: Food[],
  season: Season,
  conf: ReturnType<typeof getSeasonStartEnd>,
  interests: Interest[],
  usedNightCategories: Set<string>
): DayPlan {
  const activities: Activity[] = [];
  const districtSet = new Set<District>();
  let cursor = conf.wakeUp;

  activities.push({
    time: cursor,
    duration: 30,
    type: "rest",
    name: "起床洗漱、酒店早餐",
    description: "起床洗漱，酒店享用早餐，为一天的行程充满电",
    location: "所住酒店",
    district: "秦淮区",
    tips: season === "summer" ? "记得涂好防晒霜，带好遮阳帽和迷你电风扇" : "冬天注意保暖，围巾手套备好",
  });
  cursor = addMinutes(cursor, 30);

  if (mains.length > 0) {
    cursor = addMinutes(cursor, 10);
    activities.push({
      time: cursor,
      duration: 30,
      type: "transport",
      name: "出发前往第一个目的地",
      description: `建议地铁/网约车出行，前往【${mains[0].name}所在的${mains[0].district}】`,
      location: "地铁/网约车",
      district: "交通中",
      transportation: "地铁+步行，或网约车约20-30元",
    });
    cursor = addMinutes(cursor, 30);
  }

  let lunchInserted = false;
  const hikingMode = mains.some((m) => m.category === "mountain");

  for (let i = 0; i < mains.length; i++) {
    const main = mains[i];
    districtSet.add(main.district);

    if (isSummerHotZone(cursor, season) && isOutdoor(main)) {
      const indoorAlt = attractions.find(
        (a) =>
          a.indoorOutdoor === "indoor" &&
          a.district === main.district &&
          !activities.some((ac) => ac.name.includes(a.name))
      );
      if (indoorAlt) {
        activities.push({
          time: cursor,
          duration: 120,
          type: "attraction",
          resourceId: indoorAlt.id,
          name: `☀️ 中午避暑：${indoorAlt.name}`,
          description: `夏季高温时段，改走室内：${indoorAlt.description}`,
          location: indoorAlt.name,
          district: indoorAlt.district,
          tips: "室内有空调凉爽，也可以在商场咖啡馆休息",
          cost: indoorAlt.ticketPrice,
        });
        cursor = addMinutes(cursor, 120);
      } else {
        activities.push({
          time: cursor,
          duration: 90,
          type: "rest",
          name: "☀️ 午休避暑：商场午餐+小憩",
          description: "夏季中午太阳烈，建议就近商场吃饭、休息避暑",
          location: "附近商场/咖啡馆",
          district: main.district,
          tips: "推荐德基广场、金鹰世界、虹悦城等有空调的商场，或KFC/麦当劳午休",
        });
        cursor = addMinutes(cursor, 90);
      }
    }

    if (isWinterColdZone(cursor, season) && isOutdoor(main)) {
      activities.push({
        time: cursor,
        duration: 60,
        type: "food",
        name: "❄️ 寒冬暖胃早茶",
        description: "冬季早晨寒冷，先喝碗热腾腾的牛肉馄饨/鸭血粉丝汤暖胃",
        location: "附近早餐店",
        district: main.district,
        tips: "推荐：李记清真馆（评事街）、鸭得堡鸭血粉丝汤",
        cost: "人均20-30元",
      });
      cursor = addMinutes(cursor, 60);
    }

    const mainDuration = main.recommendedDuration;
    activities.push({
      time: cursor,
      duration: mainDuration,
      type:
        main.category === "mountain"
          ? "hiking"
          : main.category === "shopping"
          ? "shopping"
          : "attraction",
      resourceId: main.id,
      name: main.name,
      description: main.description,
      location: main.name,
      district: main.district,
      transportation: main.transportation,
      tips: main.tips?.[0],
      cost: main.ticketPrice,
    });
    cursor = addMinutes(cursor, mainDuration);

    // 午餐时间
    if (!lunchInserted && timeToMinutes(cursor) >= timeToMinutes("11:30") && timeToMinutes(cursor) < timeToMinutes("14:00")) {
      const lunchFood = pickFood(foodPool, main.district, "lunch", activities);
      activities.push({
        time: cursor,
        duration: 60,
        type: "food",
        resourceId: lunchFood?.id,
        name: lunchFood ? `🍜 午餐：${lunchFood.name}` : "🍜 午餐",
        description: lunchFood
          ? lunchFood.description
          : "午餐时间，就近品尝当地特色",
        location: lunchFood?.name ?? "附近餐厅",
        district: lunchFood?.district ?? main.district,
        tips: lunchFood?.tips?.[0] ?? "午餐推荐：鸭血粉丝汤、盐水鸭、牛肉锅贴",
        cost: lunchFood?.ticketPrice ?? "人均30-60元",
      });
      cursor = addMinutes(cursor, 60);
      lunchInserted = true;

      if (season === "summer") {
        activities.push({
          time: cursor,
          duration: 60,
          type: "rest",
          name: "☀️ 午后小憩",
          description: "饭后休息，避开一天中最热的时段",
          location: "咖啡馆/商场/酒店",
          district: main.district,
          tips: "可以在附近的星巴克或商场歇歇脚，或直接回酒店午休",
        });
        cursor = addMinutes(cursor, 60);
      }
    }

    if (i < mains.length - 1) {
      const next = mains[i + 1];
      const distKm = haversine(
        main.location.lat,
        main.location.lng,
        next.location.lat,
        next.location.lng
      );
      const transportMin = Math.max(15, Math.round(distKm * 8));
      activities.push({
        time: cursor,
        duration: transportMin,
        type: "transport",
        name: `🚇 前往下一站：${next.name}`,
        description: main.district === next.district
          ? `同区域内前往，距离约${distKm.toFixed(1)}公里，可步行/骑行`
          : `跨区前往【${next.district}】，距离约${distKm.toFixed(1)}公里（若>20km建议打车）`,
        location: main.district === next.district ? "步行/共享单车" : "地铁/网约车",
        district: "交通中",
        transportation: main.district === next.district
          ? "共享单车约10分钟"
          : `地铁约${transportMin}分钟，或打车约${Math.round(distKm * 3)}元`,
      });
      cursor = addMinutes(cursor, transportMin);
    }
  }

  // 晚餐
  if (timeToMinutes(cursor) < timeToMinutes("21:00")) {
    const lastDistrict =
      mains[mains.length - 1]?.district ?? ("秦淮区" as District);
    const dinnerFood = pickFood(foodPool, lastDistrict, "dinner", activities);
    activities.push({
      time: cursor,
      duration: 90,
      type: "food",
      resourceId: dinnerFood?.id,
      name: dinnerFood ? `🍲 晚餐：${dinnerFood.name}` : "🍲 晚餐",
      description: dinnerFood
        ? dinnerFood.description
        : "晚餐时间，品尝南京特色美食",
      location: dinnerFood?.name ?? "附近餐厅",
      district: dinnerFood?.district ?? lastDistrict,
      tips: dinnerFood?.tips?.join("，") ?? "晚餐推荐：南京大牌档、章云板鸭、李记清真馆",
      cost: dinnerFood?.ticketPrice ?? "人均60-100元",
    });
    cursor = addMinutes(cursor, 90);
  }

  // 夜间活动：优先安排，保证不重复秦淮河（按usedNightCategories去重）
  if (timeToMinutes(cursor) < timeToMinutes("22:00")) {
    const pool = NIGHT_ACTIVITIES_BY_SEASON[season];
    const candidates = pool.filter((p) => !usedNightCategories.has(p.category));
    let chosen = candidates[0] ?? pool[0];
    // 有兴趣偏好的话优先选匹配的
    if (interests.includes("photo")) {
      const photo = candidates.find((c) => /eye|yihelu|yuejiang|sakura|laomendong|lantern/.test(c.category));
      if (photo) chosen = photo;
    }
    if (interests.includes("food")) {
      const food = candidates.find((c) => /nanhu|laomendong/.test(c.category));
      if (food) chosen = food;
    }
    if (season === "winter" && interests.includes("hiking") && dayNum === totalDays) {
      const spring = candidates.find((c) => c.category === "winter-hotspring");
      if (spring) chosen = spring;
    }
    usedNightCategories.add(chosen.category);
    // 温泉尽量安排在行程最后一天，避免之后还要赶路
    if (chosen.category === "winter-hotspring" && dayNum !== totalDays) {
      const another = candidates.find((c) => c.category !== "winter-hotspring");
      if (another) chosen = another;
    }

    activities.push({
      time: cursor,
      duration: chosen.duration,
      type: (chosen.category.startsWith("winter-hotspring") ? "rest" : "attraction") as Activity["type"],
      name: chosen.name,
      description: chosen.description,
      location: chosen.location,
      district: chosen.district,
      tips: chosen.tips,
      cost: chosen.cost,
    });
  }

  // 步行距离
  const mainMountain = mains.find((m) => m.category === "mountain") as (Mountain & { altitude: number }) | undefined;
  const walkingMountain = mainMountain && hikingMode ? mainMountain.altitude / 100 : 0;
  const totalWalkingKm = mains.length * 1.5 + walkingMountain;

  const districtList = Array.from(districtSet);
  const theme = buildDayTheme(dayNum, mains, interests, season);

  return {
    day: dayNum,
    theme,
    activities,
    totalWalkingKm: Math.round(totalWalkingKm * 10) / 10,
    districtFocus: districtList,
  };
}

function pickFood(
  pool: Food[],
  district: District,
  meal: "lunch" | "dinner",
  activities: Activity[]
): Food | undefined {
  const usedIds = new Set(activities.map((a) => a.resourceId));
  const match1 = pool.filter(
    (f) => f.district === district && f.mealTime.includes(meal) && !usedIds.has(f.id)
  );
  if (match1.length) return match1[Math.floor(Math.random() * match1.length)];
  const match2 = pool.filter((f) => f.mealTime.includes(meal) && !usedIds.has(f.id));
  if (match2.length) return match2[Math.floor(Math.random() * match2.length)];
  const match3 = pool.filter((f) => f.mealTime.includes(meal));
  if (match3.length) return match3[Math.floor(Math.random() * match3.length)];
  return pool[0];
}

function isOutdoor(r: Resource): boolean {
  if (r.category === "mountain") return true;
  if (r.category === "attraction") {
    return (r as Attraction).indoorOutdoor === "outdoor";
  }
  if (r.category === "shopping") {
    return (r as ShoppingMall).indoorOutdoor === "mixed";
  }
  return false;
}

function buildDayTheme(
  dayNum: number,
  mains: Array<{ category: string; name: string }>,
  interests: Interest[],
  season: Season
): string {
  const hasMountain = mains.some((m) => m.category === "mountain");
  const hasShopping = mains.some((m) => m.category === "shopping");
  const historical = mains.filter(
    (m) => m.category === "attraction" && /明|陵|宫|寺|博物馆|六朝|民国|城墙|纪念馆|旧址|书院/.test(m.name)
  ).length;
  const photo = mains.filter(
    (m) => m.category === "attraction" && /樱花|枫|银杏|湖|塔|古|园|街|森林|湿地|滨江|滨江/.test(m.name)
  ).length;

  const seasonWord: Record<Season, string> = {
    spring: "春日寻芳",
    summer: "夏日清凉",
    autumn: "金秋寻韵",
    winter: "冬日暖行",
  };
  const sw = seasonWord[season];

  if (hasMountain) return `第${dayNum}天 · ${sw}·登山揽胜之旅`;
  if (hasShopping && historical === 0) return `第${dayNum}天 · ${sw}·时尚购物美食日`;
  if (historical >= 2) return `第${dayNum}天 · ${sw}·六朝历史文化深度游`;
  if (photo >= 2) return `第${dayNum}天 · ${sw}·拍照打卡出片日`;
  if (interests.includes("food")) return `第${dayNum}天 · ${sw}·逛吃金陵美食日`;
  return `第${dayNum}天 · ${sw}·南京精华游`;
}

function buildSummary(input: PlannerInput, days: DayPlan[]): string {
  const { interests, days: daysNum, season } = input;
  const seasonZh: Record<Season, string> = {
    spring: "春日",
    summer: "盛夏",
    autumn: "金秋",
    winter: "寒冬",
  };
  const themes = days
    .map((d) => {
      const parts = d.theme.split("·");
      return `「${parts[1]?.trim() ?? parts[0]}」`;
    })
    .join(" + ");
  const interestZh = interests.length
    ? "偏爱" +
      interests
        .map((i) => ({
          history: "历史文化",
          food: "美食探索",
          photo: "拍照出片",
          hiking: "爬山远足",
          shopping: "购物血拼",
        }[i]))
        .join("、")
    : "";
  const districts = new Set(days.flatMap((d) => d.districtFocus));

  return `${seasonZh[season]} ${daysNum} 日南京深度定制之旅：${themes}。${interestZh}，共覆盖 ${districts.size} 个行政区，基于经纬度真实地理聚类分区（避免南辕北辙），按季节智能安排室内外（夏季避高温/冬季推晨起），夜间活动每天精心轮换不重复，最大化游玩效率与舒适度。`;
}

function buildTips(input: PlannerInput, _days: DayPlan[]): string[] {
  const tips: string[] = [];
  const { season, interests } = input;
  tips.push(
    "🚇 交通首选：'南京地铁'APP或支付宝→出行→地铁乘车码；跨江（去浦口/桥北）推荐S8号线；去江宁/汤山推荐S1/S6号线。"
  );
  tips.push(
    "🎫 预约必看：中山陵、总统府、南京博物院、牛首山、大报恩寺务必提前1-3天在官方公众号预约，否则现场进不去。"
  );
  tips.push(
    "🏨 住宿建议：新街口（交通枢纽）>大行宫/珠江路（景点多）>夫子庙（美食多但闹），河西建邺（新城区安静贵）。"
  );

  if (season === "summer") {
    tips.push(
      "☀️ 夏季南京高温（7-8月可达37-40℃）：本攻略已强制11:30-15:30改室内/午休，防晒霜SPF50+、帽子、墨镜、迷你电风扇、补水必备！"
    );
    tips.push(
      "夏季限定：冰镇赤豆元宵、冰镇杨梅汤、莲蓬、菱角、鸡头果、桂花糖芋苗；夜宵去南湖/三牌楼。"
    );
  } else if (season === "winter") {
    tips.push(
      "❄️ 冬季南京湿冷魔法攻击：本攻略9点前不安排户外。外穿羽绒服，内搭毛衣+秋衣秋裤，围巾手套口罩帽子全套。"
    );
    tips.push(
      "冬季限定：汤山温泉（推荐行程最后一天去最划算！）；固城湖/高邮湖大闸蟹；梅花山（2月底-3月初）；雪景玄武湖+石象路绝美。"
    );
  } else if (season === "spring") {
    tips.push(
      "🌸 3/中-4/上：鸡鸣寺路→解放门玄武湖（樱花）、南林大樱花、总统府海棠、雨花台梅岗；清明前后吃马兰头/芦蒿/菊花脑。"
    );
  } else if (season === "autumn") {
    tips.push(
      "🍁 赏秋时间轴：10/下栖霞山红叶；11/中明孝陵石象路(乌桕+银杏)；11/下朝天宫千年银杏；12/初毗卢寺银杏、南师大随园银杏大道。"
    );
    tips.push("秋季必吃：固城湖大闸蟹（九雌十雄）、桂花鸭、桂花糖芋苗、美龄粥、桂花糯米藕。");
  }

  if (interests.includes("hiking")) {
    tips.push("🥾 登山装备：防滑徒步鞋、速干运动服、登山杖（紫金山/牛首山可现场买20元）、2L水+能量棒。");
    tips.push("三座必爬：紫金山（头陀岭448米，3小时登顶看全南京）、牛首山（好走不累，佛顶宫壮观）、栖霞山（秋景绝）。");
  }
  if (interests.includes("photo")) {
    tips.push("📸 黄金拍照时段：日出后1小时（6-7点）、日落前1小时（17-18点）；蓝调时刻（日落后20分钟）拍夜景最美。");
    tips.push("小众出片机位：朝天宫银杏（11月）、颐和路公馆区（梧桐+公馆）、浦口火车站（民国风）、金陵小城（汉服）。");
  }
  if (interests.includes("food")) {
    tips.push("🍜 地道老字号别去夫子庙挤！去：老门东（蒋有记/陆氏梅花糕）、科巷（德州扒鸡/草鸡蛋糕）、三牌楼（夜宵）、明瓦廊（皮肚面）。");
    tips.push("鸭子必买带走：韩复兴（新街口总店）、章云板鸭（升州路）、金宏兴鸭子店（明瓦廊）。");
  }
  if (interests.includes("shopping")) {
    tips.push("🛍️ 新街口德基广场（全国顶奢第二，厕所都成网红）、金鹰世界（52F观景台）、景枫KINGMO（江宁年轻人顶流）。");
    tips.push("先锋书店五店：五台山总店必去→老门东骏惠书屋→颐和书馆→永丰诗舍→先锋虫子书店。");
  }
  tips.push("🎁 伴手礼：盐水鸭真空装、雨花茶（中山陵茶厂正品）、云锦围巾（宜贡坊）、雨花石（六合原产地）。");
  return tips;
}

function estimateBudget(input: PlannerInput, days: DayPlan[]): string {
  const daysNum = days.length;
  const budget = input.budgetLevel ?? "medium";
  let perDay = 500;
  if (budget === "budget") perDay = 300;
  if (budget === "luxury") perDay = 1200;

  if (input.interests.includes("hiking")) perDay += 100;
  if (input.interests.includes("shopping")) perDay += 500;
  if (input.interests.includes("food")) perDay += 150;

  const accommodationPerDay = budget === "budget"
    ? 200
    : budget === "luxury"
    ? 800
    : 400;
  const total = (perDay + accommodationPerDay) * daysNum;
  return `约 ¥${total.toLocaleString("zh-CN")} 元/人（含${daysNum}晚住宿、餐饮、门票、市内交通，购物费用丰俭由人）`;
}
