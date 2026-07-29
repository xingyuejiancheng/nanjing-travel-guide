import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  Bus,
  Lightbulb,
  Star,
  Calendar,
  BookOpen,
  Tag,
  Landmark,
  BookMarked,
  Share2,
  Mountain as MountainIcon,
  Utensils,
  ShoppingBag,
} from "lucide-react";
import { attractions } from "@/data/attractions";
import { foods } from "@/data/foods";
import { cultures } from "@/data/cultures";
import { shoppings, mountains } from "@/data/shoppings";
import { allResources, getResourceById } from "@/engine/itineraryEngine";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  SEASON_EMOJI,
  SEASON_LABEL,
  type Resource,
  type ResourceCategory,
  type Food,
  type Mountain,
  type CultureStory,
  type ShoppingMall,
  type Attraction,
} from "@/types";

const dataByCategory: Record<ResourceCategory, Resource[]> = {
  attraction: attractions,
  food: foods,
  culture: cultures,
  shopping: shoppings,
  mountain: mountains,
};

const catIcons = {
  attraction: Landmark,
  food: Utensils,
  culture: BookMarked,
  shopping: ShoppingBag,
  mountain: MountainIcon,
};

export default function ResourceDetailPage() {
  const { type, id } = useParams<{ type: ResourceCategory; id: string }>();
  const loc = useLocation();
  const nav = useNavigate();
  const cat = (["attraction", "food", "culture", "shopping", "mountain"].includes(
    type as ResourceCategory
  )
    ? type
    : "attraction") as ResourceCategory;

  const resource: Resource | undefined = useMemo(() => {
    return (
      (loc.state as { resource?: Resource })?.resource ??
      getResourceById(id ?? "") ??
      dataByCategory[cat].find((r) => r.id === id)
    );
  }, [loc.state, id, cat]);

  if (!resource) {
    return (
      <div className="min-h-screen bg-xuanzhi-100 py-20 text-center font-kai">
        <p className="text-xl text-celadon-700 mb-4">未找到该资源…</p>
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-white rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          返回资源库
        </Link>
      </div>
    );
  }

  const CatIcon = catIcons[resource.category];

  // 推荐相关
  const related = allResources
    .filter(
      (r) =>
        r.id !== resource.id &&
        (r.district === resource.district ||
          r.category === resource.category ||
          r.tags.some((t) => resource.tags.includes(t)))
    )
    .slice(0, 4);

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      <div className="container pt-8">
        {/* 返回 */}
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-white shadow-classic font-kai text-moyu-700 hover:bg-jinling-50 border border-jinling-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          返回资源库
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主体内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 大图 */}
            <div className="relative rounded-3xl overflow-hidden shadow-classic border-2 border-jinling-300/50">
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="w-full h-80 md:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-moyu-900/90 via-moyu-900/20 to-transparent" />
              <div className="absolute top-5 left-5 flex gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cinnabar-600/95 backdrop-blur text-white font-kai shadow-seal border-2 border-jinling-400">
                  <CatIcon className="w-4 h-4" />
                  {CATEGORY_EMOJI[resource.category]} {CATEGORY_LABEL[resource.category]}
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-jinling-400/95 backdrop-blur text-moyu-900 font-bold font-kai">
                  <Star className="w-4 h-4 fill-cinnabar-700 text-cinnabar-700" />
                  {resource.rating.toFixed(1)} 分
                </div>
              </div>
              <button className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-classic hover:scale-110 transition text-cinnabar-700">
                <Share2 className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="font-serif text-4xl md:text-5xl font-black mb-2 drop-shadow-lg">
                  {resource.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 font-kai text-sm md:text-base text-white/90">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-jinling-300" />
                    {resource.district}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-jinling-300" />
                    建议游玩 {Math.round(resource.recommendedDuration / 60 * 10) / 10} 小时
                  </span>
                  {resource.openingHours && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-jinling-300" />
                      {resource.openingHours}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 描述卡片 */}
            <div className="bg-white rounded-2xl shadow-classic p-6 md:p-8 border border-jinling-200/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-cinnabar-600 rounded-full" />
                <h2 className="font-serif text-2xl font-bold text-moyu-900">详细介绍</h2>
              </div>
              <p className="font-kai text-moyu-800 leading-loose text-lg whitespace-pre-line">
                {resource.fullContent}
              </p>
            </div>

            {/* 分类特定内容 */}
            {resource.category === "food" && (
              <FoodExtra food={resource as Food} />
            )}
            {resource.category === "mountain" && (
              <MountainExtra mt={resource as Mountain} />
            )}
            {resource.category === "culture" && (
              <CultureExtra cu={resource as CultureStory} />
            )}
            {resource.category === "shopping" && (
              <ShoppingExtra sm={resource as ShoppingMall} />
            )}
            {resource.category === "attraction" && (
              <AttractionExtra a={resource as Attraction} />
            )}

            {/* Tips */}
            {resource.tips && resource.tips.length > 0 && (
              <div className="bg-gradient-to-br from-jinling-50 to-cinnabar-50 rounded-2xl p-6 md:p-8 border-2 border-jinling-300/50 shadow-classic">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cinnabar-600 flex items-center justify-center shadow-seal">
                    <Lightbulb className="w-5 h-5 text-jinling-300" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-moyu-900">
                    实用贴士 · 避坑指南
                  </h2>
                </div>
                <ul className="space-y-3">
                  {resource.tips.map((t, i) => (
                    <li
                      key={i}
                      className="flex gap-3 font-kai text-moyu-800 text-lg leading-relaxed pl-2"
                    >
                      <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-cinnabar-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 信息卡 */}
            <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 text-white p-5">
                <h3 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-jinling-300" />
                  基本信息
                </h3>
              </div>
              <div className="divide-y divide-xuanzhi-200">
                {[
                  { icon: MapPin, label: "所在区域", value: resource.district },
                  {
                    icon: Clock,
                    label: "建议游玩时长",
                    value: `${Math.round(resource.recommendedDuration / 60 * 10) / 10} 小时`,
                  },
                  resource.openingHours && {
                    icon: Calendar,
                    label: "开放时间",
                    value: resource.openingHours,
                  },
                  resource.ticketPrice && {
                    icon: Ticket,
                    label: "门票信息",
                    value: resource.ticketPrice,
                  },
                  resource.transportation && {
                    icon: Bus,
                    label: "交通指南",
                    value: resource.transportation,
                  },
                ]
                  .filter(Boolean)
                  .map(
                    (row, i) =>
                      row && (
                        <div
                          key={i}
                          className="p-4 flex gap-3 hover:bg-xuanzhi-50 transition"
                        >
                          <row.icon className="w-5 h-5 text-cinnabar-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-kai text-celadon-600 mb-1">
                              {row.label}
                            </div>
                            <div className="font-kai text-moyu-800 leading-relaxed">
                              {row.value}
                            </div>
                          </div>
                        </div>
                      )
                  )}
              </div>
            </div>

            {/* 标签 */}
            <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-cinnabar-600" />
                <h3 className="font-serif text-lg font-bold text-moyu-900">
                  特色标签
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-lg bg-jinling-100 text-cinnabar-700 text-sm font-kai border border-jinling-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* 最佳季节 */}
            <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-cinnabar-600" />
                <h3 className="font-serif text-lg font-bold text-moyu-900">
                  最佳游览季节
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["spring", "summer", "autumn", "winter"] as const).map((s) => {
                  const best = resource.bestSeasons.includes(s);
                  return (
                    <div
                      key={s}
                      className={`px-3 py-2.5 rounded-xl text-center font-kai text-sm transition ${
                        best
                          ? "bg-cinnabar-600 text-white shadow-seal"
                          : "bg-xuanzhi-100 text-moyu-600"
                      }`}
                    >
                      <span className="text-lg mr-1">{SEASON_EMOJI[s]}</span>
                      {SEASON_LABEL[s].split(" ")[0]}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 生成攻略CTA */}
            <Link
              to="/planner"
              className="block text-center px-6 py-5 rounded-2xl bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 text-white shadow-gold hover:scale-[1.02] transition border-2 border-jinling-400"
            >
              <div className="font-serif text-xl font-bold mb-1">✨ 定制专属攻略</div>
              <div className="font-kai text-sm text-jinling-100">
                把 {resource.name} 加入您的行程
              </div>
            </Link>
          </div>
        </div>

        {/* 相关推荐 */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-jinling-500" />
              <h2 className="font-serif text-2xl font-bold text-moyu-900">
                为您推荐 · 相关资源
              </h2>
              <span className="h-px flex-1 bg-jinling-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/resources/${r.category}/${r.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-classic border border-jinling-200/50 hover:shadow-gold hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-moyu-900/80 to-transparent" />
                    <span className="absolute top-2 right-2 text-lg">{CATEGORY_EMOJI[r.category]}</span>
                    <span className="absolute bottom-2 left-3 text-white font-serif font-bold">
                      {r.name}
                    </span>
                  </div>
                  <div className="p-3 flex items-center gap-2 text-xs font-kai text-moyu-600">
                    <MapPin className="w-3 h-3" />
                    {r.district}
                    <span className="mx-1">·</span>
                    <Star className="w-3 h-3 fill-jinling-500 text-jinling-500" />
                    {r.rating.toFixed(1)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ======== 分类特定组件 ========
function AttractionExtra({ a }: { a: Attraction }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "适合拍照", value: a.photoFriendly ? "📸 非常出片" : "普通", ok: a.photoFriendly },
        { label: "历史底蕴", value: a.historical ? "🏯 深厚历史" : "现代景点", ok: a.historical },
        { label: "室内户外", value: a.indoorOutdoor === "indoor" ? "🏠 全室内" : a.indoorOutdoor === "outdoor" ? "🌳 全户外" : "🏞️ 室内外结合", ok: true },
        { label: "人流密度", value: a.crowdLevel === "high" ? "🔥 热门拥挤" : a.crowdLevel === "medium" ? "👥 适中" : "🧘 人少舒适", ok: a.crowdLevel !== "high" },
      ].map((x, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl border-2 font-kai text-center ${
            x.ok
              ? "bg-jinling-50 border-jinling-300"
              : "bg-white border-xuanzhi-200"
          }`}
        >
          <div className="text-xs text-celadon-600 mb-1">{x.label}</div>
          <div className="text-moyu-800 font-bold">{x.value}</div>
        </div>
      ))}
    </div>
  );
}

function FoodExtra({ food }: { food: Food }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoCell label="菜系类型" value={food.cuisineType} />
        <InfoCell
          label="人均消费"
          value={
            food.priceRange === "cheap"
              ? "💰 亲民"
              : food.priceRange === "medium"
              ? "💰💰 中等"
              : "💰💰💰 高档"
          }
        />
        <InfoCell
          label="推荐时段"
          value={food.mealTime
            .map((m) =>
              m === "breakfast"
                ? "早餐"
                : m === "lunch"
                ? "午餐"
                : m === "dinner"
                ? "晚餐"
                : "小吃"
            )
            .join("/")}
        />
        <InfoCell label="综合评分" value={`⭐ ${food.rating} / 5`} />
      </div>
      {food.seasonalDishes.length > 0 && (
        <div className="bg-gradient-to-br from-xuanzhi-50 to-jinling-50 rounded-2xl p-5 border border-jinling-200">
          <h3 className="font-serif text-lg font-bold text-moyu-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cinnabar-600" />
            季节限定菜
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {food.seasonalDishes.map((sd, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/80 border border-jinling-200/70 font-kai"
              >
                <div className="text-cinnabar-700 font-bold mb-1 flex items-center gap-2">
                  {SEASON_EMOJI[sd.season]} {SEASON_LABEL[sd.season].split(" ")[0]}
                </div>
                <div className="text-moyu-700 text-sm">
                  {sd.dishes.map((d, j) => (
                    <span
                      key={j}
                      className="inline-block mr-2 mb-1 px-2 py-0.5 rounded bg-jinling-100 border border-jinling-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MountainExtra({ mt }: { mt: Mountain }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoCell label="海拔高度" value={`⛰️ ${mt.altitude} 米`} />
        <InfoCell
          label="登山难度"
          value={
            mt.difficulty === "easy"
              ? "😊 轻松"
              : mt.difficulty === "medium"
              ? "💪 中等"
              : "🔥 挑战"
          }
        />
        <InfoCell label="建议登山时长" value={`⏱️ ${Math.round(mt.hikingDuration / 60 * 10) / 10} 小时`} />
        <InfoCell label="索道缆车" value={mt.hasCableCar ? "🚡 有索道" : "🚶 全程步行"} />
      </div>
      <div className="bg-gradient-to-br from-celadon-50 to-xuanzhi-50 rounded-2xl p-5 border border-celadon-200/60">
        <h3 className="font-serif text-lg font-bold text-moyu-900 mb-3">
          🗺️ 主要景观节点
        </h3>
        <div className="flex flex-wrap gap-2">
          {mt.scenicPoints.map((p, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full bg-white/80 border border-celadon-200 text-moyu-700 font-kai text-sm"
            >
              {i + 1}. {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CultureExtra({ cu }: { cu: CultureStory }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoCell label="历史朝代" value={`📜 ${cu.dynasty}`} />
        <InfoCell
          label="故事类型"
          value={
            cu.storyType === "legend"
              ? "📖 传说故事"
              : cu.storyType === "history"
              ? "📚 真实历史"
              : cu.storyType === "person"
              ? "👤 历史人物"
              : "⚔️ 重大事件"
          }
        />
        <InfoCell label="综合评分" value={`⭐ ${cu.rating} / 5`} />
        <InfoCell label="关联景点数" value={`📍 ${cu.relatedAttractionIds.length} 处`} />
      </div>
    </div>
  );
}

function ShoppingExtra({ sm }: { sm: ShoppingMall }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <InfoCell
        label="商场档次"
        value={
          sm.level === "luxury"
            ? "👑 顶奢高端"
            : sm.level === "mid-range"
            ? "💎 中高端"
            : "🛍️ 亲民大众"
        }
      />
      <InfoCell label="餐饮配套" value={sm.hasFoodCourt ? "🍽️ 配套完善" : "餐饮较少"} />
      <InfoCell
        label="室内外"
        value={sm.indoorOutdoor === "indoor" ? "🏬 全室内" : "🏙️ 街区结合"}
      />
      <InfoCell label="综合评分" value={`⭐ ${sm.rating} / 5`} />
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border-2 bg-white border-jinling-200/60 text-center">
      <div className="text-xs text-celadon-600 font-kai mb-1">{label}</div>
      <div className="font-bold text-moyu-800 font-kai">{value}</div>
    </div>
  );
}
