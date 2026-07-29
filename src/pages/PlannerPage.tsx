import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  CalendarDays,
  CalendarClock,
  MapPin,
  Wallet,
  Loader2,
  Heart,
  Camera,
  Mountain,
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  Sun,
  Snowflake,
  Flower2,
  Leaf,
  AlertCircle,
} from "lucide-react";
import { useTravelStore } from "@/store/travelStore";
import type { Interest, PlannerInput, Season } from "@/types";
import {
  INTEREST_LABEL,
  INTEREST_EMOJI,
  SEASON_LABEL,
  SEASON_EMOJI,
} from "@/types";
import { cn } from "@/lib/utils";

const interestList: Interest[] = [
  "history",
  "food",
  "photo",
  "hiking",
  "shopping",
];

const interestIcons = {
  history: Heart,
  food: UtensilsCrossed,
  photo: Camera,
  hiking: Mountain,
  shopping: ShoppingBag,
};

const seasonList: Season[] = ["spring", "summer", "autumn", "winter"];
const seasonIcons = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

export default function PlannerPage() {
  const nav = useNavigate();
  const { generateAndSetItinerary, isGenerating } = useTravelStore();
  const [interests, setInterests] = useState<Interest[]>(["history", "food"]);
  const [days, setDays] = useState(3);
  const [season, setSeason] = useState<Season>("autumn");
  const [startLocation, setStartLocation] = useState("新街口");
  const [budget, setBudget] =
    useState<PlannerInput["budgetLevel"]>("medium");
  const [error, setError] = useState("");

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const canSubmit = interests.length > 0 && days >= 1 && days <= 10;

  const handleGenerate = async () => {
    if (!canSubmit) {
      setError("请至少选择一项兴趣偏好，天数需在1-10天之间");
      return;
    }
    setError("");
    const input: PlannerInput = {
      interests,
      days,
      season,
      startLocation: startLocation || "新街口",
      budgetLevel: budget,
    };
    const result = await generateAndSetItinerary(input);
    nav(`/itinerary/${result.id}`);
  };

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      <div className="container pt-10">
        {/* 页头 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-cinnabar-500" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-moyu-900">
              ✨ 定制我的专属攻略
            </h1>
            <span className="h-px w-10 bg-cinnabar-500" />
          </div>
          <p className="font-kai text-celadon-700 text-lg">
            选择您的偏好，为您量身规划最适合的南京深度之旅
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 表单区 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 兴趣偏好 */}
            <FormSection
              icon={<Heart className="w-6 h-6" />}
              title="第一步：选择您的兴趣偏好"
              hint="可以多选，我们将根据权重智能安排行程内容"
              badge="必选"
              badgeColor="cinnabar"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {interestList.map((i) => {
                  const Icon = interestIcons[i];
                  const selected = interests.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={cn(
                        "relative p-5 rounded-2xl text-left transition-all border-2 group",
                        selected
                          ? "bg-cinnabar-600 text-white border-jinling-400 shadow-seal scale-[1.02]"
                          : "bg-white text-moyu-800 border-jinling-200 hover:border-jinling-400 hover:bg-jinling-50"
                      )}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-jinling-400 flex items-center justify-center text-moyu-900 text-sm font-bold shadow-seal">
                          ✓
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition",
                          selected
                            ? "bg-jinling-400/25 text-jinling-100"
                            : "bg-jinling-100 text-cinnabar-700 group-hover:bg-jinling-200"
                        )}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                        <span className="text-2xl">{INTEREST_EMOJI[i]}</span>
                        {INTEREST_LABEL[i]}
                      </div>
                      <div
                        className={cn(
                          "font-kai text-sm leading-relaxed",
                          selected ? "text-white/85" : "text-moyu-600"
                        )}
                      >
                        {i === "history" &&
                          "六朝、明朝、民国历史遗迹，博物馆深度游"}
                        {i === "food" &&
                          "鸭血粉丝汤、盐水鸭、皮肚面、小吃街一路逛吃"}
                        {i === "photo" &&
                          "樱花、枫叶、民国风、夜景、古寺、湖泊出片点"}
                        {i === "hiking" &&
                          "紫金山、栖霞山、牛首山、老山登高揽胜"}
                        {i === "shopping" &&
                          "德基广场、新街口、金鹰、先锋书店购物血拼"}
                      </div>
                    </button>
                  );
                })}
              </div>
              {interests.length === 0 && (
                <div className="mt-4 flex items-center gap-2 text-cinnabar-700 font-kai text-sm">
                  <AlertCircle className="w-4 h-4" />
                  请至少选择一项兴趣偏好
                </div>
              )}
            </FormSection>

            {/* 天数 */}
            <FormSection
              icon={<CalendarDays className="w-6 h-6" />}
              title="第二步：设置出行天数"
              hint="支持1-10天灵活安排，短至周末特种兵，长至深度文化游"
            >
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 7, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setDays(n)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl font-serif font-bold transition border-2",
                        days === n
                          ? "bg-cinnabar-600 text-white border-jinling-400 shadow-seal"
                          : "bg-white text-moyu-700 border-jinling-200 hover:border-jinling-400"
                      )}
                    >
                      {n} 天
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-5">
                  <span className="font-kai text-moyu-600 shrink-0">自定义：</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="flex-1 accent-cinnabar-600 h-2"
                  />
                  <div className="w-28 shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jinling-100 border-2 border-jinling-300">
                    <Clock className="w-5 h-5 text-cinnabar-700" />
                    <span className="font-serif text-2xl font-bold text-cinnabar-700">
                      {days}
                    </span>
                    <span className="font-kai text-cinnabar-700">天</span>
                  </div>
                </div>
                {/* 天数建议 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-kai text-sm">
                  {[
                    { d: "1天", c: "特种兵打卡 · 5-6个精华点", i: "⚡" },
                    { d: "2-3天", c: "经典深度游 · 主要景点+美食", i: "🎒" },
                    { d: "4-6天", c: "全景深度游 · 含周边+山岳", i: "🗺️" },
                    { d: "7-10天", c: "慢游深度体验 · 含高淳/汤山/慢城", i: "🌿" },
                  ].map((x) => (
                    <div
                      key={x.d}
                      className="p-3 rounded-xl bg-white border border-jinling-200/70"
                    >
                      <div className="text-2xl mb-1">{x.i}</div>
                      <div className="font-bold text-moyu-800">{x.d}</div>
                      <div className="text-moyu-600 text-xs leading-relaxed">
                        {x.c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* 季节 */}
            <FormSection
              icon={<CalendarClock className="w-6 h-6" />}
              title="第三步：选择出行季节"
              hint="智能避坑：夏季避开中午高温，冬季推迟早起，推荐季节性美食和风景"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {seasonList.map((s) => {
                  const Icon = seasonIcons[s];
                  const selected = s === season;
                  return (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={cn(
                        "relative p-5 rounded-2xl text-center transition-all border-2",
                        selected
                          ? "bg-gradient-to-br from-cinnabar-600 to-cinnabar-700 text-white border-jinling-400 shadow-seal scale-[1.02]"
                          : "bg-white text-moyu-800 border-jinling-200 hover:border-jinling-400 hover:bg-jinling-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center transition",
                          selected
                            ? "bg-white/20 text-jinling-100"
                            : "bg-jinling-100 text-cinnabar-700"
                        )}
                      >
                        <Icon className="w-9 h-9" />
                      </div>
                      <div className="font-serif font-bold text-lg mb-1 flex items-center justify-center gap-2">
                        <span>{SEASON_EMOJI[s]}</span>
                        {SEASON_LABEL[s].split(" ")[0]}
                      </div>
                      <div
                        className={cn(
                          "text-xs font-kai leading-relaxed",
                          selected ? "text-white/85" : "text-moyu-600"
                        )}
                      >
                        {s === "spring" && "樱花海棠·踏青尝鲜"}
                        {s === "summer" && "智能避高温·室内+夜游·莲蓬龙虾"}
                        {s === "autumn" && "赏枫银杏·大闸蟹·桂花飘香"}
                        {s === "winter" && "温泉·赏梅·雪景·牛羊肉暖锅"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormSection>

            {/* 可选配置 */}
            <FormSection
              icon={<MapPin className="w-6 h-6" />}
              title="第四步：补充信息（可选）"
              hint="帮助我们更精准规划路线与预算"
              optional
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-kai text-moyu-700 mb-2">
                    🚇 起始位置（酒店/地铁站）
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-celadon-600" />
                    <input
                      type="text"
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      placeholder="如：新街口、南京南站、夫子庙…"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-xuanzhi-200 focus:border-jinling-500 outline-none font-kai transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-kai text-moyu-700 mb-2">
                    💰 预算水平
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["budget", "穷游", "💵"],
                      ["medium", "舒适", "💰"],
                      ["luxury", "奢华", "💎"],
                    ] as const).map(([l, n, i]) => (
                      <button
                        key={l}
                        onClick={() => setBudget(l)}
                        className={cn(
                          "px-3 py-3 rounded-xl font-kai transition border-2",
                          budget === l
                            ? "bg-cinnabar-600 text-white border-jinling-400 shadow-seal"
                            : "bg-white text-moyu-700 border-jinling-200 hover:border-jinling-400"
                        )}
                      >
                        <div className="text-2xl mb-0.5">{i}</div>
                        <div className="text-sm font-bold">{n}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>
          </div>

          {/* 侧边栏：当前配置总览 + 提交 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* 配置总览 */}
              <div className="bg-white rounded-2xl shadow-classic border-2 border-jinling-300/60 overflow-hidden">
                <div className="bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 p-5 text-white">
                  <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-jinling-300" />
                    本次行程配置总览
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <ConfigRow
                    icon={<Heart className="w-4 h-4 text-cinnabar-600" />}
                    label="兴趣偏好"
                    value={
                      interests.length
                        ? interests.map((i) => INTEREST_EMOJI[i] + INTEREST_LABEL[i]).join("、")
                        : "未选择"
                    }
                    warning={interests.length === 0}
                  />
                  <ConfigRow
                    icon={<CalendarDays className="w-4 h-4 text-cinnabar-600" />}
                    label="出行天数"
                    value={`${days} 天 ${days === 1 ? "(特种兵)" : days <= 3 ? "(经典行程)" : days <= 6 ? "(深度游)" : "(超深度慢游)"}`}
                  />
                  <ConfigRow
                    icon={
                      <span className="text-base">
                        {SEASON_EMOJI[season]}
                      </span>
                    }
                    label="出行季节"
                    value={SEASON_LABEL[season]}
                  />
                  <ConfigRow
                    icon={<MapPin className="w-4 h-4 text-cinnabar-600" />}
                    label="起始位置"
                    value={startLocation || "默认新街口"}
                  />
                  <ConfigRow
                    icon={<Wallet className="w-4 h-4 text-cinnabar-600" />}
                    label="预算等级"
                    value={
                      budget === "budget"
                        ? "💵 穷游党"
                        : budget === "medium"
                        ? "💰 舒适游"
                        : "💎 奢华游"
                    }
                  />
                </div>
                <div className="px-5 pb-5">
                  <div className="p-3 rounded-xl bg-jinling-50 border border-jinling-200">
                    <div className="font-kai text-xs text-moyu-600 mb-1">
                      💡 小贴士
                    </div>
                    <div className="font-kai text-sm text-moyu-700 leading-relaxed">
                      {season === "summer" &&
                        "夏季将自动避开11:30-15:30高温时段，安排室内景点+商场午休。"}
                      {season === "winter" &&
                        "冬季09:30前不安排户外活动，推荐汤山温泉暖身。"}
                      {season === "spring" &&
                        "春季将重点推荐鸡鸣寺樱花、玄武湖海棠、牛首山花海。"}
                      {season === "autumn" &&
                        "秋季必安排栖霞山赏枫、明孝陵石象路银杏、固城湖大闸蟹。"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 生成按钮 */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 font-kai text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !canSubmit}
                className={cn(
                  "w-full py-5 rounded-2xl font-serif text-xl font-bold shadow-gold transition-all border-2 flex items-center justify-center gap-3",
                  canSubmit && !isGenerating
                    ? "bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 text-white border-jinling-400 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-xuanzhi-200 text-moyu-500 border-xuanzhi-300 cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    攻略智能生成中…请稍候
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-jinling-300" />
                    一键生成我的专属攻略
                  </>
                )}
              </button>
              <div className="grid grid-cols-3 gap-2 text-center font-kai text-xs text-celadon-700">
                <div className="p-2 rounded-lg bg-white border border-jinling-200">
                  🚶 路线优化
                </div>
                <div className="p-2 rounded-lg bg-white border border-jinling-200">
                  🌤️ 季节适配
                </div>
                <div className="p-2 rounded-lg bg-white border border-jinling-200">
                  ⚖️ 兴趣权重
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({
  icon,
  title,
  hint,
  badge,
  badgeColor = "jinling",
  optional,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  badge?: string;
  badgeColor?: "cinnabar" | "jinling";
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-5 border-b border-jinling-100">
        <div className="w-11 h-11 rounded-xl bg-cinnabar-600 text-jinling-100 flex items-center justify-center shadow-seal border-2 border-jinling-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-moyu-900">
              {title}
            </h2>
            {badge && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold font-kai",
                  badgeColor === "cinnabar"
                    ? "bg-cinnabar-600 text-white"
                    : "bg-jinling-400 text-moyu-900"
                )}
              >
                {badge}
              </span>
            )}
            {optional && (
              <span className="px-2 py-0.5 rounded text-xs font-kai bg-xuanzhi-200 text-moyu-600">
                选填
              </span>
            )}
          </div>
          {hint && (
            <p className="font-kai text-sm text-celadon-700 leading-relaxed">
              {hint}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function ConfigRow({
  icon,
  label,
  value,
  warning,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-jinling-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-kai text-celadon-600 mb-1">{label}</div>
        <div
          className={cn(
            "font-kai text-sm leading-relaxed break-words",
            warning ? "text-cinnabar-700 font-bold" : "text-moyu-800"
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
