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

// 资源根据其类型聚合
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

// 时间工具
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

  let score = resource.rating; // 基础分：资源本身评分
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

  // 季节加成
  return score;
}

// ===================== 季节适配函数 =====================
export function getSeasonStartEnd(season: Season): {
  outdoorStart: string;
  outdoorEnd: string;
  indoorStart: string; // 夏季中午室内/冬季午休时段开始
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

// 夏季中午（11:30-15:30）避免户外活动
export function isSummerHotZone(timeStr: string, season: Season): boolean {
  if (season !== "summer") return false;
  const t = timeToMinutes(timeStr);
  return t >= timeToMinutes("11:30") && t < timeToMinutes("15:30");
}

// 冬季早晨（9点前）避免户外活动
export function isWinterColdZone(timeStr: string, season: Season): boolean {
  if (season !== "winter") return false;
  const t = timeToMinutes(timeStr);
  return t < timeToMinutes("09:30");
}

// 季节性美食推荐
export function getSeasonalFoods(season: Season): Food[] {
  return foods.filter((f) =>
    f.seasonalDishes.some((sd) => sd.season === season)
  );
}

// 季节性景点推荐
export function getSeasonalAttractions(season: Season): Attraction[] {
  return attractions.filter((a) => a.bestSeasons.includes(season));
}

// ===================== 路线优化：按行政区聚类 + 最近邻贪心 =====================
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
  // 1. 先按行政区聚类
  const byDistrict = new Map<District, T[]>();
  items.forEach((it) => {
    if (!byDistrict.has(it.district)) byDistrict.set(it.district, []);
    byDistrict.get(it.district)!.push(it);
  });

  // 2. 决定行政区访问顺序（从起始点最近的区开始）
  const origin = start ?? { lat: 32.04, lng: 118.78 }; // 新街口默认中心
  const districts = Array.from(byDistrict.keys());
  districts.sort((a, b) => {
    const aCenter = centroid(byDistrict.get(a)!);
    const bCenter = centroid(byDistrict.get(b)!);
    return (
      haversine(origin.lat, origin.lng, aCenter.lat, aCenter.lng) -
      haversine(origin.lat, origin.lng, bCenter.lat, bCenter.lng)
    );
  });

  // 3. 每区内部用最近邻贪心
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

// ===================== 主生成器 =====================
export function generateItinerary(input: PlannerInput): Itinerary {
  const { interests, days, season } = input;
  const seasonConf = getSeasonStartEnd(season);
  const daysNum = Math.max(1, Math.min(10, days));

  // === Step 1: 选择候选资源 ===
  // 景点 + 山岳 + 购物 + 美食，按兴趣打分排序
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

  // 根据天数决定每天选多少个主要景点（2-4个主活动/天）
  const totalMainSlots = daysNum * (interests.includes("hiking") ? 2 : 3);
  const selectedMain = scored
    .slice(0, Math.min(totalMainSlots + 5, scored.length))
    .map((x) => x.r);

  // 路线优化
  const optimized = optimizeRoute(selectedMain);

  // 选出当季美食
  const seasonalFoods = getSeasonalFoods(season);
  const generalFoods = foods.filter((f) =>
    ["lunch", "dinner"].some((mt) => f.mealTime.includes(mt as never))
  );
  const allFoodPool = [...seasonalFoods, ...generalFoods];

  // === Step 2: 分配到每天 ===
  const daysPlans: DayPlan[] = [];
  // 将优化后的景点粗略均分到每天
  const perDay = Math.ceil(optimized.length / daysNum);
  for (let d = 0; d < daysNum; d++) {
    const dayMain = optimized.slice(d * perDay, (d + 1) * perDay);
    const dayPlan = buildSingleDay(
      d + 1,
      daysNum,
      dayMain,
      allFoodPool,
      season,
      seasonConf,
      interests
    );
    daysPlans.push(dayPlan);
  }

  // === Step 3: 生成总结 & Tips ===
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
  mains: (Attraction | Mountain | ShoppingMall)[],
  foodPool: Food[],
  season: Season,
  conf: ReturnType<typeof getSeasonStartEnd>,
  interests: Interest[]
): DayPlan {
  const activities: Activity[] = [];
  const districtSet = new Set<District>();
  let cursor = conf.wakeUp;

  // 起床+早餐
  activities.push({
    time: cursor,
    duration: 30,
    type: "rest",
    name: "起床洗漱、酒店早餐",
    description: "起床洗漱，酒店享用早餐，为一天的行程充满电",
    location: "所住酒店",
    district: "秦淮区",
    tips: season === "summer" ? "记得涂好防晒霜，带好遮阳帽" : "冬天注意保暖，围巾手套",
  });
  cursor = addMinutes(cursor, 30);

  // 交通前往第一个景点
  if (mains.length > 0) {
    cursor = addMinutes(cursor, 10); // 缓冲
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

  // 逐个主景点插入，同时处理午餐/晚餐
  let lunchInserted = false;
  let hikingMode = mains.some((m) => m.category === "mountain");

  for (let i = 0; i < mains.length; i++) {
    const main = mains[i];
    districtSet.add(main.district);

    // 夏季中午：插入室内活动或午休代替户外
    if (isSummerHotZone(cursor, season) && isOutdoor(main)) {
      // 找个室内替代/商场/博物馆午休
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
          tips: "推荐德基广场、金鹰世界、虹悦城等有空调的商场",
        });
        cursor = addMinutes(cursor, 90);
      }
    }

    // 冬季早晨太冷，先安排早餐/室内
    if (isWinterColdZone(cursor, season) && isOutdoor(main)) {
      activities.push({
        time: cursor,
        duration: 60,
        type: "food",
        name: "❄️ 寒冬暖胃早茶",
        description: "冬季早晨寒冷，先喝碗热腾腾的牛肉馄饨/鸭血粉丝汤暖胃",
        location: "附近早餐店",
        district: main.district,
        tips: "推荐：李记清真馆、鸭得堡鸭血粉丝汤",
        cost: "人均20-30元",
      });
      cursor = addMinutes(cursor, 60);
    }

    // 主活动
    const mainDuration = hikingMode && main.category === "mountain"
      ? (main as Mountain).hikingDuration
      : main.recommendedDuration;

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

    // 到午餐时间了（11:30-13:00之间）
    if (!lunchInserted && timeToMinutes(cursor) >= timeToMinutes("11:30") && timeToMinutes(cursor) < timeToMinutes("14:00")) {
      const lunchFood = pickFood(foodPool, main.district, "lunch");
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

      // 如果是夏季并且刚好吃过午饭，午休一下
      if (season === "summer") {
        activities.push({
          time: cursor,
          duration: 60,
          type: "rest",
          name: "☀️ 午后小憩",
          description: "饭后休息，避开一天中最热的时段",
          location: "咖啡馆/商场/酒店",
          district: main.district,
          tips: "可以在附近的星巴克或商场歇歇脚",
        });
        cursor = addMinutes(cursor, 60);
      }
    }

    // 交通去下一个
    if (i < mains.length - 1) {
      const next = mains[i + 1];
      const distKm = haversine(
        main.location.lat,
        main.location.lng,
        next.location.lat,
        next.location.lng
      );
      const transportMin = Math.max(15, Math.round(distKm * 8)); // 地铁约8分钟/公里
      activities.push({
        time: cursor,
        duration: transportMin,
        type: "transport",
        name: `🚇 前往下一站：${next.name}`,
        description: main.district === next.district
          ? `同区域内前往，距离约${distKm.toFixed(1)}公里，可步行/骑行`
          : `跨区前往【${next.district}】，距离约${distKm.toFixed(1)}公里`,
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
    const dinnerFood = pickFood(foodPool, lastDistrict, "dinner");
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
      tips: dinnerFood?.tips?.join("，") ?? "晚餐推荐：南京大牌档、夫子庙小吃街",
      cost: dinnerFood?.ticketPrice ?? "人均60-100元",
    });
    cursor = addMinutes(cursor, 90);
  }

  // 冬季加夜景/泡温泉，夏季加夜游
  if (
    timeToMinutes(cursor) < timeToMinutes("22:00") &&
    interests.includes("photo")
  ) {
    if (season === "summer") {
      activities.push({
        time: cursor,
        duration: 90,
        type: "attraction",
        name: "🌙 夜游秦淮河夫子庙",
        description:
          "夏季夜凉如水，秦淮河画舫夜游，体验'夜泊秦淮近酒家'的诗意",
        location: "夫子庙秦淮河",
        district: "秦淮区",
        tips: "推荐19:30后去，21点左右最美",
        cost: "画舫夜游约80-100元",
      });
    } else if (season === "winter" && totalDays >= 2) {
      // 给有2天以上的行程加汤山温泉
      activities.push({
        time: cursor,
        duration: 120,
        type: "rest",
        name: "♨️ 汤山温泉",
        description:
          "冬日养生：千年圣汤汤山温泉，暖身暖心，洗去一天的疲惫",
        location: "汤山温泉度假区",
        district: "江宁区",
        tips: "推荐：颐尚温泉、紫清湖（有熊猫）",
        cost: "人均150-300元",
      });
    } else {
      activities.push({
        time: cursor,
        duration: 60,
        type: "attraction",
        name: "🌃 1912街区夜游",
        description:
          "民国风情的酒吧街，灯光璀璨，夜生活开始，体验南京夜晚的魅力",
        location: "南京1912街区",
        district: "玄武区",
        tips: "总统府旁边，民国建筑+酒吧+餐厅",
      });
    }
  }

  // 计算步行距离
  const mainMountain = mains.find((m) => m.category === "mountain") as Mountain | undefined;
  const walkingMountain = mainMountain && hikingMode ? mainMountain.altitude / 100 : 0;
  const totalWalkingKm = mains.length * 1.5 + walkingMountain;

  // 每日主题
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
  meal: "lunch" | "dinner"
): Food | undefined {
  const match1 = pool.filter(
    (f) => f.district === district && f.mealTime.includes(meal)
  );
  if (match1.length) return match1[Math.floor(Math.random() * match1.length)];
  const match2 = pool.filter((f) => f.mealTime.includes(meal));
  if (match2.length) return match2[Math.floor(Math.random() * match2.length)];
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
  mains: (Attraction | Mountain | ShoppingMall)[],
  interests: Interest[],
  season: Season
): string {
  const hasMountain = mains.some((m) => m.category === "mountain");
  const hasShopping = mains.some((m) => m.category === "shopping");
  const historical = mains.filter(
    (m) => m.category === "attraction" && (m as Attraction).historical
  ).length;
  const photo = mains.filter(
    (m) => m.category === "attraction" && (m as Attraction).photoFriendly
  ).length;

  const seasonWord: Record<Season, string> = {
    spring: "春日寻芳",
    summer: "夏日清凉",
    autumn: "金秋寻韵",
    winter: "冬日暖行",
  };

  if (hasMountain) {
    return `第${dayNum}天 · ${seasonWord[season]}·登山揽胜之旅`;
  }
  if (hasShopping && !historical) {
    return `第${dayNum}天 · ${seasonWord[season]}·时尚购物美食日`;
  }
  if (historical >= 2) {
    return `第${dayNum}天 · ${seasonWord[season]}·六朝历史文化深度游`;
  }
  if (photo >= 2) {
    return `第${dayNum}天 · ${seasonWord[season]}·拍照打卡出片日`;
  }
  if (interests.includes("food")) {
    return `第${dayNum}天 · ${seasonWord[season]}·逛吃金陵美食日`;
  }
  return `第${dayNum}天 · ${seasonWord[season]}·南京精华游`;
}

function buildSummary(input: PlannerInput, days: DayPlan[]): string {
  const { interests, days: daysNum, season } = input;
  const seasonZh: Record<Season, string> = {
    spring: "春日",
    summer: "盛夏",
    autumn: "金秋",
    winter: "寒冬",
  };
  const themes = days.map((d) => `「${d.theme.split("·")[1]?.trim() ?? ""}」`).join(" + ");
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

  return `${seasonZh[season]} ${daysNum} 日南京深度定制之旅：${themes}。${interestZh}，共覆盖 ${
    new Set(days.flatMap((d) => d.districtFocus)).size
  } 个行政区，精心规划路线减少折返，按季节科学安排室内外活动，最大化游玩效率和舒适度。`;
}

function buildTips(input: PlannerInput, _days: DayPlan[]): string[] {
  const tips: string[] = [];
  const { season, interests } = input;
  tips.push(
    "交通首选：南京地铁覆盖广，推荐使用'南京地铁'APP或支付宝-出行-地铁乘车码。"
  );
  tips.push(
    "热门景点（中山陵、总统府、南京博物院）务必提前1-3天在官方公众号预约。"
  );
  tips.push(
    "住宿建议：新街口、夫子庙、大行宫一带最方便，地铁枢纽出行无忧。"
  );

  if (season === "summer") {
    tips.push(
      "☀️ 夏季南京高温（7-8月可达37-40℃）：本攻略已自动将11:30-15:30调整为室内/商场/午休，防晒用品（帽子、墨镜、防晒霜、小电风扇）必备，多喝水防中暑。"
    );
    tips.push(
      "夏季美食：冰镇赤豆元宵、冰镇鸭血粉丝、莲蓬、菱角、鸡头果、桂花糖芋苗当季最宜。"
    );
  } else if (season === "winter") {
    tips.push(
      "❄️ 冬季南京湿冷：9点前不安排户外活动。羽绒服+围巾+手套全副武装，室内暖气足可穿脱方便的外套。"
    );
    tips.push(
      "冬季养生：强烈推荐汤山温泉泡汤（人均150-300元），品尝热乎乎的牛肉火锅、盐水鸭、羊肉汤。"
    );
    tips.push("2月底-3月初梅花山赏梅，石象路和玄武湖雪景绝美。");
  } else if (season === "spring") {
    tips.push(
      "🌸 3月中下旬-4月上旬：鸡鸣寺樱花、南林大樱花、玄武湖海棠、桃花漫山，是南京最美季节。"
    );
    tips.push("春季野菜上市：马兰头、芦蒿、菊花脑，是金陵春味。");
  } else if (season === "autumn") {
    tips.push(
      "🍁 10月底-12月初：栖霞山红叶、明孝陵石象路银杏+乌桕、南师大随园银杏、毗卢寺秋景，是'秋栖霞'最佳期。"
    );
    tips.push(
      "秋季必吃：固城湖大闸蟹（九雌十雄）、桂花鸭、桂花糖芋苗、美龄粥。"
    );
  }

  if (interests.includes("hiking")) {
    tips.push("🥾 登山装备：舒适的登山鞋、运动服、登山杖、充足的水和零食。");
    tips.push(
      "紫金山、栖霞山、牛首山是最推荐的三座山，难度依次降低。"
    );
  }
  if (interests.includes("photo")) {
    tips.push(
      "📸 最佳拍照时间：日出后1小时（6-7点）、日落前1小时（17-18点），人少光线好。"
    );
    tips.push(
      "推荐机位：鸡鸣寺樱花大道6点前、颐和路民国公馆、老门东青砖黛瓦、美龄宫项链航拍视角、音乐台白鸽。"
    );
  }
  if (interests.includes("food")) {
    tips.push(
      "🍜 南京必吃清单：鸭血粉丝汤、盐水鸭、牛肉锅贴、鸡汁汤包、皮肚面、赤豆元宵、梅花糕、鸭油酥烧饼、固城湖大闸蟹。"
    );
    tips.push(
      "推荐美食街区：老门东（地道+文艺）、湖南路狮子桥（老字号）、明瓦廊（皮肚面）、科巷（市井小吃）。"
    );
  }
  if (interests.includes("shopping")) {
    tips.push(
      "🛍️ 购物天堂：新街口德基广场（顶奢）、金鹰世界（网红书店+全景）、虹悦城（亲子+喷泉）、景枫KINGMO（江宁顶流）。"
    );
    tips.push(
      "先锋书店五店各有特色：五台山总店（必打卡）、老门东骏惠书屋、颐和书馆、永丰诗舍。"
    );
  }
  tips.push(
    "伴手礼推荐：韩复兴盐水鸭（真空装）、桂花鸭、雨花茶、云锦围巾、雨花石、夫子庙文创。"
  );
  return tips;
}

function estimateBudget(input: PlannerInput, days: DayPlan[]): string {
  const daysNum = days.length;
  const budget = input.budgetLevel ?? "medium";
  let perDay = 500;
  if (budget === "budget") perDay = 300;
  if (budget === "luxury") perDay = 1200;

  // 加上兴趣消费
  if (input.interests.includes("hiking")) perDay += 100; // 索道/温泉
  if (input.interests.includes("shopping")) perDay += 500; // 购物
  if (input.interests.includes("food")) perDay += 150;

  const accommodationPerDay = budget === "budget"
    ? 200
    : budget === "luxury"
    ? 800
    : 400;
  const total = (perDay + accommodationPerDay) * daysNum;
  return `约 ¥${total.toLocaleString("zh-CN")} 元/人（含${daysNum}晚住宿、餐饮、门票、市内交通；购物费用丰俭由人）`;
}
