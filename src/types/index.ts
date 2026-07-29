// 季节类型
export type Season = "spring" | "summer" | "autumn" | "winter";

// 兴趣偏好类型
export type Interest = "history" | "food" | "photo" | "hiking" | "shopping";

// 资源分类
export type ResourceCategory =
  | "attraction"
  | "food"
  | "culture"
  | "shopping"
  | "mountain";

// 南京行政区
export type District =
  | "玄武区"
  | "秦淮区"
  | "鼓楼区"
  | "建邺区"
  | "雨花台区"
  | "栖霞区"
  | "江宁区"
  | "浦口区"
  | "六合区"
  | "溧水区"
  | "高淳区";

// 坐标
export interface GeoLocation {
  lat: number;
  lng: number;
}

// 资源基础类型
export interface BaseResource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  fullContent: string;
  imageUrl: string;
  tags: string[];
  district: District;
  rating: number; // 1-5
  location: GeoLocation;
  bestSeasons: Season[];
  recommendedDuration: number; // 分钟
  openingHours?: string;
  ticketPrice?: string;
  transportation?: string;
  tips?: string[];
}

// 景点
export interface Attraction extends BaseResource {
  category: "attraction";
  photoFriendly: boolean;
  historical: boolean;
  indoorOutdoor: "indoor" | "outdoor" | "mixed";
  crowdLevel: "low" | "medium" | "high";
}

// 美食
export interface Food extends BaseResource {
  category: "food";
  cuisineType: string;
  priceRange: "cheap" | "medium" | "expensive";
  seasonalDishes: { season: Season; dishes: string[] }[];
  mealTime: ("breakfast" | "lunch" | "dinner" | "snack")[];
}

// 历史文化故事
export interface CultureStory extends BaseResource {
  category: "culture";
  dynasty: string;
  relatedAttractionIds: string[];
  storyType: "legend" | "history" | "person" | "event";
}

// 商场
export interface ShoppingMall extends BaseResource {
  category: "shopping";
  level: "luxury" | "mid-range" | "popular";
  hasFoodCourt: boolean;
  indoorOutdoor: "indoor" | "mixed";
}

// 山岳
export interface Mountain extends BaseResource {
  category: "mountain";
  difficulty: "easy" | "medium" | "hard";
  altitude: number;
  hikingDuration: number;
  hasCableCar: boolean;
  scenicPoints: string[];
}

export type Resource =
  | Attraction
  | Food
  | CultureStory
  | ShoppingMall
  | Mountain;

// 攻略输入
export interface PlannerInput {
  interests: Interest[];
  days: number; // 1-10
  season: Season;
  startLocation?: string;
  budgetLevel?: "budget" | "medium" | "luxury";
}

// 活动类型
export type ActivityType =
  | "attraction"
  | "food"
  | "transport"
  | "rest"
  | "shopping"
  | "hiking"
  | "culture";

// 单个活动
export interface Activity {
  time: string; // "08:30"
  duration: number; // 分钟
  type: ActivityType;
  resourceId?: string;
  name: string;
  description: string;
  location: string;
  district: District | "交通中";
  transportation?: string;
  tips?: string;
  cost?: string;
}

// 单日计划
export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
  totalWalkingKm: number;
  districtFocus: District[];
}

// 完整攻略
export interface Itinerary {
  id: string;
  generatedAt: string;
  input: PlannerInput;
  summary: string;
  days: DayPlan[];
  totalBudgetEstimate: string;
  tips: string[];
}

// 兴趣中文映射
export const INTEREST_LABEL: Record<Interest, string> = {
  history: "历史文化",
  food: "美食探索",
  photo: "拍照出片",
  hiking: "爬山远足",
  shopping: "逛街购物",
};

export const INTEREST_EMOJI: Record<Interest, string> = {
  history: "🏯",
  food: "🍜",
  photo: "📸",
  hiking: "⛰️",
  shopping: "🛍️",
};

export const SEASON_LABEL: Record<Season, string> = {
  spring: "春季 (3-5月)",
  summer: "夏季 (6-8月)",
  autumn: "秋季 (9-11月)",
  winter: "冬季 (12-2月)",
};

export const SEASON_EMOJI: Record<Season, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍁",
  winter: "❄️",
};

export const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  attraction: "景点",
  food: "美食",
  culture: "历史文化",
  shopping: "购物",
  mountain: "山岳",
};

export const CATEGORY_EMOJI: Record<ResourceCategory, string> = {
  attraction: "🏛️",
  food: "🍲",
  culture: "📜",
  shopping: "🏬",
  mountain: "🗻",
};
