import { useMemo } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTravelStore } from "@/store/travelStore";
import { attractions } from "@/data/attractions";
import { foods } from "@/data/foods";
import { cultures } from "@/data/cultures";
import { shoppings, mountains } from "@/data/shoppings";
import type { Resource, ResourceCategory, District } from "@/types";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  SEASON_EMOJI,
  SEASON_LABEL,
} from "@/types";
import { cn } from "@/lib/utils";

const allData: Record<ResourceCategory, Resource[]> = {
  attraction: attractions,
  food: foods,
  culture: cultures,
  shopping: shoppings,
  mountain: mountains,
};

export default function ResourcesPage() {
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const store = useTravelStore();

  const tabFromUrl = (sp.get("tab") as ResourceCategory) ?? "attraction";
  const activeTab: ResourceCategory = ["attraction", "food", "culture", "shopping", "mountain"].includes(tabFromUrl)
    ? tabFromUrl
    : "attraction";

  const currentData = allData[activeTab];
  const search = store.resourceSearch;
  const districtFilter = store.resourceDistrict;

  const districts: string[] = useMemo(() => {
    const s = new Set<string>();
    currentData.forEach((r) => s.add(r.district));
    return ["全部", ...Array.from(s)];
  }, [currentData]);

  const filtered = useMemo(() => {
    return currentData.filter((r) => {
      if (
        search &&
        !(
          r.name.includes(search) ||
          r.description.includes(search) ||
          r.tags.some((t) => t.includes(search))
        )
      )
        return false;
      if (districtFilter !== "全部" && r.district !== districtFilter) return false;
      return true;
    });
  }, [currentData, search, districtFilter]);

  const tabs: ResourceCategory[] = [
    "attraction",
    "food",
    "culture",
    "shopping",
    "mountain",
  ];

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      <div className="container pt-10">
        {/* 页头 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-jinling-500" />
            <h1 className="font-serif text-4xl font-bold text-moyu-900">
              南京旅游资源速查库
            </h1>
            <span className="h-px w-10 bg-jinling-500" />
          </div>
          <p className="font-kai text-celadon-700">
            {CATEGORY_EMOJI[activeTab]} {CATEGORY_LABEL[activeTab]}
            大全 · 共 {filtered.length} 条精选资源
          </p>
        </div>

        {/* Tab切换 */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSp({ tab: t });
                store.setResourceTab(t);
                store.setResourceDistrict("全部");
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-kai transition-all border-2",
                activeTab === t
                  ? "bg-cinnabar-600 text-white border-jinling-400 shadow-seal"
                  : "bg-white text-moyu-800 border-jinling-200 hover:border-jinling-400 hover:bg-jinling-50"
              )}
            >
              <span className="text-lg">{CATEGORY_EMOJI[t]}</span>
              <span>{CATEGORY_LABEL[t]}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === t
                    ? "bg-jinling-400 text-moyu-900"
                    : "bg-xuanzhi-200 text-moyu-700"
                )}
              >
                {allData[t].length}
              </span>
            </button>
          ))}
        </div>

        {/* 搜索+筛选栏 */}
        <div className="bg-white rounded-2xl p-5 shadow-classic border border-jinling-200/60 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-celadon-600" />
            <input
              value={search}
              onChange={(e) => store.setResourceSearch(e.target.value)}
              placeholder={`搜索${CATEGORY_LABEL[activeTab]}名称、标签…`}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-xuanzhi-50 border-2 border-xuanzhi-200 focus:border-jinling-500 focus:bg-white outline-none font-kai transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-celadon-600" />
            <span className="font-kai text-moyu-700 shrink-0">行政区：</span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => store.setResourceDistrict(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-kai transition",
                    districtFilter === d
                      ? "bg-cinnabar-600 text-white"
                      : "bg-xuanzhi-100 text-moyu-700 hover:bg-jinling-100"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 卡片网格 */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-celadon-600 font-kai">
            暂无符合条件的{CATEGORY_LABEL[activeTab]}，试试换个条件吧～
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, idx) => (
              <button
                key={r.id}
                onClick={() =>
                  nav(`/resources/${activeTab}/${r.id}`, { state: { resource: r } })
                }
                className="group text-left bg-white rounded-2xl overflow-hidden shadow-classic hover:shadow-gold transition-all duration-500 border border-jinling-200/60 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* 图片 */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-moyu-900/85 via-moyu-900/10 to-transparent" />
                  {/* 评分徽章 */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-jinling-400/95 backdrop-blur text-moyu-900 text-xs font-bold font-kai">
                    <Star className="w-3.5 h-3.5 fill-cinnabar-700 text-cinnabar-700" />
                    {r.rating.toFixed(1)}
                  </div>
                  {/* 分类emoji角标 */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-cinnabar-600/95 flex items-center justify-center shadow-seal border-2 border-jinling-400">
                    <span className="text-lg">{CATEGORY_EMOJI[r.category]}</span>
                  </div>
                  {/* 底部名称 */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl font-bold mb-1 flex items-center justify-between">
                      <span>{r.name}</span>
                      <ChevronRight className="w-5 h-5 text-jinling-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-kai text-white/85">
                      <MapPin className="w-3.5 h-3.5" />
                      {r.district}
                      <span className="mx-1">·</span>
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round(r.recommendedDuration / 60 * 10) / 10}小时
                    </div>
                  </div>
                </div>
                {/* 描述区 */}
                <div className="p-4">
                  <p className="font-kai text-sm text-moyu-700 line-clamp-2 mb-3 min-h-[42px]">
                    {r.description}
                  </p>
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-jinling-100 text-cinnabar-700 text-xs font-kai border border-jinling-200"
                      >
                        <Tag className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                    {/* 最佳季节 */}
                    {r.bestSeasons.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-celadon-100 text-celadon-700 text-xs font-kai border border-celadon-200"
                        title={SEASON_LABEL[s]}
                      >
                        {SEASON_EMOJI[s]}
                        {s === "spring"
                          ? "春"
                          : s === "summer"
                          ? "夏"
                          : s === "autumn"
                          ? "秋"
                          : "冬"}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export type _District = District;
