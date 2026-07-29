import { useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Copy,
  Printer,
  Check,
  Trash2,
  Coffee,
  Train,
  Mountain,
  BookOpen,
  ShoppingBag,
  UtensilsCrossed,
  Landmark,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Heart,
  ChevronDown,
  ChevronRight,
  Calendar,
  Wallet,
  Lightbulb,
  Bus,
  Ticket,
  Camera,
  Download,
  Save,
  Loader2,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { useTravelStore } from "@/store/travelStore";
import type { Activity, DayPlan, Itinerary, ActivityType } from "@/types";
import {
  SEASON_EMOJI,
  SEASON_LABEL,
  INTEREST_EMOJI,
  INTEREST_LABEL,
} from "@/types";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  ActivityType,
  { label: string; emoji: string; Icon: typeof Landmark; color: string }
> = {
  attraction: {
    label: "景点",
    emoji: "🏛️",
    Icon: Landmark,
    color: "from-cinnabar-500",
  },
  food: {
    label: "美食",
    emoji: "🍜",
    Icon: UtensilsCrossed,
    color: "from-jinling-500",
  },
  transport: {
    label: "交通",
    emoji: "🚇",
    Icon: Train,
    color: "from-celadon-500",
  },
  rest: {
    label: "休息",
    emoji: "☕",
    Icon: Coffee,
    color: "from-slate-400",
  },
  shopping: {
    label: "购物",
    emoji: "🛍️",
    Icon: ShoppingBag,
    color: "from-pink-500",
  },
  hiking: {
    label: "登山",
    emoji: "⛰️",
    Icon: Mountain,
    color: "from-emerald-600",
  },
  culture: {
    label: "文化",
    emoji: "📜",
    Icon: BookOpen,
    color: "from-indigo-500",
  },
};

function getTimeStage(time: string) {
  const h = Number(time.split(":")[0]);
  if (h < 8) return { label: "清晨", Icon: Sunrise, color: "text-blue-500" };
  if (h < 11) return { label: "上午", Icon: Sun, color: "text-amber-500" };
  if (h < 14) return { label: "午间", Icon: Sun, color: "text-orange-500" };
  if (h < 18) return { label: "下午", Icon: Sun, color: "text-yellow-600" };
  if (h < 21) return { label: "傍晚", Icon: Sunset, color: "text-cinnabar-600" };
  return { label: "夜晚", Icon: Moon, color: "text-indigo-700" };
}

/** 简易Toast */
function Toast({
  msg,
  type,
}: {
  msg: string;
  type: "success" | "error" | "info";
}) {
  const color =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
      ? "bg-cinnabar-700"
      : "bg-moyu-800";
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`${color} text-white px-6 py-3 rounded-xl shadow-seal font-kai text-sm border border-white/20 backdrop-blur flex items-center gap-2`}
      >
        {type === "success" && <Check className="w-4 h-4" />}
        {type === "info" && <Sparkles className="w-4 h-4" />}
        {msg}
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const store = useTravelStore();
  const [dayTab, setDayTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const itinerary: Itinerary | null = useMemo(() => {
    return (
      store.currentItinerary ??
      store.savedItineraries.find((i) => i.id === id) ??
      null
    );
  }, [store.currentItinerary, store.savedItineraries, id]);

  const alreadySaved = itinerary
    ? store.savedItineraries.some((x) => x.id === itinerary.id)
    : false;

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-xuanzhi-100 py-20 text-center px-4">
        <div className="mx-auto max-w-md">
          <div className="text-6xl mb-6 animate-float">🧭</div>
          <p className="text-2xl text-moyu-800 mb-4 font-kai">
            这条攻略好像走丢啦…
          </p>
          <p className="text-moyu-500 font-kai mb-8">
            可能是本地缓存被清除，也可能是攻略ID有误。别担心，重新生成一份全新的南京深度游攻略吧！
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cinnabar-600 text-white rounded-xl font-kai shadow-seal hover:scale-105 transition"
            >
              <Sparkles className="w-4 h-4" />
              去生成攻略
            </Link>
            <Link
              to="/saved"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-moyu-800 rounded-xl font-kai shadow-classic hover:bg-jinling-50 border border-jinling-200"
            >
              <Heart className="w-4 h-4" />
              查看我的攻略
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const days = itinerary.days;
  const activeDay = days[dayTab] ?? days[0];

  const copyText = async () => {
    try {
      const txt = buildText(itinerary);
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      showToast("✅ 攻略全文已复制到剪贴板");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      showToast("复制失败，请手动复制", "error");
    }
  };

  const saveThis = async () => {
    if (!itinerary || alreadySaved) {
      showToast("已经在我的攻略里啦，去「我的攻略」查看~", "info");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    store.saveItinerary(itinerary);
    setSaving(false);
    showToast("💚 已保存到「我的攻略」，永不丢失");
  };

  const deleteIt = () => {
    if (confirm("确定要删除这条攻略吗？删除后无法恢复。")) {
      store.deleteItinerary(itinerary.id);
      showToast("已删除这条攻略");
      nav("/saved");
    }
  };

  /**
   * PDF 导出：
   * 1. 用 html2canvas 截整个 printRef（A4 比例的内容区）
   * 2. jsPDF 按 A4 分页拼成多页 PDF
   */
  const exportPDF = async () => {
    if (!printRef.current) return;
    setExportingPDF(true);
    showToast("📄 正在生成 PDF，请稍候…（内容较多时约需5-10秒）", "info");
    try {
      const node = printRef.current;
      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#faf3e3",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const fileName = `南京${SEASON_LABEL[itinerary.input.season]}${itinerary.input.days}日攻略_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      pdf.save(fileName);
      showToast(`✅ PDF 已下载：${fileName}`);
    } catch (err) {
      console.error(err);
      showToast("PDF导出失败，请稍后重试或用'打印视图'保存", "error");
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="container pt-8">
        {/* 顶部操作栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => nav(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-classic font-kai text-moyu-700 hover:bg-jinling-50 border border-jinling-200"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </button>
            <Link
              to="/planner"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-classic font-kai text-moyu-700 hover:bg-jinling-50 border border-jinling-200"
            >
              <RefreshCw className="w-4 h-4" />
              换个参数再生成
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveThis}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-kai shadow-classic border transition",
                alreadySaved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-seal hover:scale-[1.02]"
              )}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : alreadySaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {alreadySaved ? "已保存" : saving ? "保存中" : "保存攻略"}
            </button>
            <button
              onClick={copyText}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-classic font-kai text-moyu-700 hover:bg-jinling-50 border border-jinling-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制全文
                </>
              )}
            </button>
            <button
              onClick={exportPDF}
              disabled={exportingPDF}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-kai shadow-classic border text-white transition hover:scale-[1.02]",
                exportingPDF
                  ? "bg-moyu-700 border-moyu-700 cursor-wait"
                  : "bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 border-cinnabar-600 shadow-seal"
              )}
            >
              {exportingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exportingPDF ? "导出中…" : "一键导出PDF"}
            </button>
            <button
              onClick={() => window.print()}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-classic font-kai text-moyu-700 hover:bg-jinling-50 border border-jinling-200"
            >
              <Printer className="w-4 h-4" />
              打印视图
            </button>
            <button
              onClick={deleteIt}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-classic font-kai text-cinnabar-700 hover:bg-cinnabar-50 border border-cinnabar-200"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>

        {/* 要渲染/截图的主体区域（包裹给 PDF 导出用） */}
        <div ref={printRef}>
          {/* 头部大卡片 */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cinnabar-600 via-cinnabar-700 to-cinnabar-800 text-white p-8 md:p-10 mb-8 shadow-gold border-2 border-jinling-400/50">
            <div className="absolute top-0 right-0 w-96 h-96 -mt-40 -mr-40 rounded-full bg-jinling-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-80 h-80 -mb-40 rounded-full bg-cinnabar-400/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-kai">
                  <Sparkles className="w-4 h-4 text-jinling-300" />
                  金陵文旅通 · 智能定制攻略
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jinling-400/20 border border-jinling-300/40 text-sm font-kai">
                  {SEASON_EMOJI[itinerary.input.season]}
                  {SEASON_LABEL[itinerary.input.season]}
                </span>
                {itinerary.input.interests.map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-kai"
                  >
                    {INTEREST_EMOJI[i]} {INTEREST_LABEL[i]}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-black mb-4 leading-tight">
                {itinerary.summary}
              </h1>
              <p className="text-white/80 font-kai text-sm md:text-base mb-6 max-w-3xl">
                生成时间：
                {new Date(itinerary.generatedAt).toLocaleString("zh-CN")}
                {" · 路线采用经纬度Haversine地理聚类分天，避免南辕北辙；每日夜间活动自动轮换，不重复逛秦淮河。"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <Stat Icon={Calendar} label="行程天数" value={`${itinerary.input.days} 天`} />
                <Stat
                  Icon={MapPin}
                  label="覆盖区域"
                  value={`${new Set(days.flatMap((d) => d.districtFocus)).size} 个行政区`}
                />
                <Stat
                  Icon={Wallet}
                  label="预估预算"
                  value={itinerary.totalBudgetEstimate.split("（")[0].slice(0, 12)}
                  small
                />
                <Stat
                  Icon={Camera}
                  label="活动总数"
                  value={`${days.reduce((s, d) => s + d.activities.length, 0)} 项`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 左侧：Tab + 日视图 */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-3 flex flex-wrap gap-2">
                {days.map((d, idx) => (
                  <button
                    key={d.day}
                    onClick={() => setDayTab(idx)}
                    className={cn(
                      "flex-1 min-w-[120px] px-4 py-3 rounded-xl transition-all font-kai text-left",
                      dayTab === idx
                        ? "bg-cinnabar-600 text-white shadow-seal"
                        : "bg-xuanzhi-50 text-moyu-700 hover:bg-jinling-50"
                    )}
                  >
                    <div className="text-xs opacity-80 mb-1">第 {d.day} 天</div>
                    <div className="font-bold text-sm leading-tight line-clamp-1">
                      {d.theme.split("·")[1]?.trim() ?? d.theme}
                    </div>
                  </button>
                ))}
              </div>

              <DayPlanView day={activeDay} />
            </div>

            {/* 右侧：预算 + Tips + 重新生成 */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-jinling-400 to-jinling-500 p-4 text-moyu-900">
                  <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    预估预算参考
                  </h3>
                </div>
                <div className="p-5 font-kai text-moyu-800 leading-relaxed text-sm">
                  {itinerary.totalBudgetEstimate}
                </div>
              </div>

              <div className="bg-gradient-to-br from-xuanzhi-50 to-jinling-50 rounded-2xl shadow-classic border-2 border-jinling-300/50 overflow-hidden">
                <div className="p-5 border-b border-jinling-200 bg-white/80">
                  <h3 className="font-serif text-xl font-bold flex items-center gap-2 text-moyu-900">
                    <Lightbulb className="w-5 h-5 text-cinnabar-600" />
                    实用贴士 · 避坑指南
                  </h3>
                </div>
                <ul className="p-5 space-y-3 max-h-[520px] overflow-auto print:max-h-none">
                  {itinerary.tips.map((t, i) => (
                    <li
                      key={i}
                      className="flex gap-3 font-kai text-moyu-800 text-sm leading-relaxed pl-2"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cinnabar-600 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/planner"
                className="block text-center px-6 py-5 rounded-2xl bg-gradient-to-r from-moyu-900 to-moyu-800 text-white shadow-gold hover:scale-[1.02] transition border-2 border-jinling-400/40"
              >
                <div className="font-serif text-lg font-bold mb-1 flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5 text-jinling-300" />
                  调整参数重新生成
                </div>
                <div className="font-kai text-sm text-white/70">
                  换个季节、天数或兴趣偏好
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-moyu-400 font-kai print:hidden">
            金陵文旅通 · 南京深度旅游速查与攻略定制 · 感谢使用本工具，祝您在南京玩得愉快！
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  Icon,
  label,
  value,
  small,
}: {
  Icon: typeof Calendar;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-jinling-300" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-white/70 font-kai">{label}</div>
        <div className={`font-bold font-serif ${small ? "text-lg" : "text-xl"} text-white truncate`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function DayPlanView({ day }: { day: DayPlan }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (k: string) => setExpanded((e) => ({ ...e, [k]: !e[k] }));
  const totalHours = day.activities.reduce((s, a) => s + a.duration, 0) / 60;
  return (
    <div className="space-y-5">
      {/* 主题头部 */}
      <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinnabar-100 text-cinnabar-700 font-kai text-xs font-bold mb-3">
            Day {day.day}
          </div>
          <h2 className="font-serif text-3xl font-bold text-moyu-900 mb-1">
            {day.theme}
          </h2>
          <div className="flex flex-wrap gap-4 font-kai text-sm text-celadon-700">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              重点区域：{day.districtFocus.join("、") || "全城"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              总活动时长约 {totalHours.toFixed(1)} 小时
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Train className="w-4 h-4" />
              步行约 {day.totalWalkingKm} 公里
            </span>
          </div>
        </div>
        <div className="hidden md:block w-24 h-24 rounded-2xl bg-gradient-to-br from-cinnabar-600 to-cinnabar-700 text-white flex flex-col items-center justify-center shadow-seal border-2 border-jinling-400">
          <div className="font-serif text-4xl font-black">{day.day}</div>
          <div className="font-kai text-xs opacity-80">DAY</div>
        </div>
      </div>

      {/* 空状态 */}
      {day.activities.length === 0 && (
        <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-12 text-center">
          <div className="text-5xl mb-4 animate-float">🌿</div>
          <p className="font-kai text-moyu-600">
            今天安排的活动较少，是难得的悠闲放空日，走走逛逛吃点好吃的吧！
          </p>
        </div>
      )}

      {/* 时间轴 */}
      <div className="relative pl-8 md:pl-10">
        <div className="absolute top-0 bottom-0 left-3 md:left-4 w-0.5 bg-gradient-to-b from-jinling-400 via-cinnabar-500 to-jinling-300" />
        {day.activities.map((a, i) => {
          const cfg = typeConfig[a.type] ?? typeConfig.attraction;
          const stage = getTimeStage(a.time);
          const isOpen = expanded[String(i)] ?? true;
          return (
            <div
              key={i}
              className="relative mb-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => toggle(String(i))}
                className="absolute -left-[30px] md:-left-[38px] top-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br shadow-seal border-2 border-xuanzhi-100 flex items-center justify-center shrink-0 z-10"
              >
                <span className="text-sm md:text-base">{cfg.emoji}</span>
              </button>

              <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 overflow-hidden hover:shadow-gold transition-all">
                <button
                  onClick={() => toggle(String(i))}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  <div
                    className={`shrink-0 w-24 rounded-xl bg-gradient-to-br text-white py-2.5 text-center shadow-sm ${cfg.color}`}
                  >
                    <div className="font-serif font-black text-lg leading-tight">
                      {a.time}
                    </div>
                    <div className={`text-[10px] font-kai opacity-90`}>
                      {Math.round((a.duration / 60) * 10) / 10}h · {stage.label}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-serif text-xl font-bold text-moyu-900">
                        {a.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-kai bg-xuanzhi-100 text-moyu-600 border border-xuanzhi-200`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-kai text-celadon-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {a.location} · {a.district}
                      </span>
                      {a.cost && (
                        <span className="inline-flex items-center gap-1 text-cinnabar-700">
                          <Ticket className="w-3.5 h-3.5" />
                          {a.cost}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 ml-2 mt-1.5 text-moyu-400">
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 border-t border-xuanzhi-100">
                    <div className="pt-4 space-y-3">
                      <p className="font-kai text-moyu-700 leading-relaxed">
                        {a.description || (
                          <span className="text-moyu-400">
                            （暂无详细描述，按经验安排即可）
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {a.transportation && (
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-celadon-50 border border-celadon-200 text-sm font-kai text-celadon-700">
                            <Bus className="w-4 h-4" />
                            {a.transportation}
                          </div>
                        )}
                        {a.tips && (
                          <div className="inline-flex items-start gap-2 px-3 py-2 rounded-lg bg-jinling-50 border border-jinling-200 text-sm font-kai text-moyu-700 max-w-full">
                            <Lightbulb className="w-4 h-4 text-cinnabar-600 shrink-0 mt-0.5" />
                            <span className="break-words">{a.tips}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildText(it: Itinerary): string {
  let t = "";
  t += `【金陵文旅通 · 南京定制旅游攻略】\n`;
  t += `${it.summary}\n\n`;
  t += `生成时间：${new Date(it.generatedAt).toLocaleString("zh-CN")}\n`;
  t += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  it.days.forEach((d) => {
    t += `📅 ${d.theme}\n`;
    t += `📍 区域：${d.districtFocus.join("、") || "全城"}\n`;
    t += `🚶 今日步行约 ${d.totalWalkingKm} 公里\n\n`;
    d.activities.forEach((a) => {
      t += `  ⏰ ${a.time}  ${a.name}\n`;
      t += `     ${a.description || ""}\n`;
      t += `     📍 ${a.location} · ${a.district}\n`;
      if (a.transportation) t += `     🚇 ${a.transportation}\n`;
      if (a.cost) t += `     💰 ${a.cost}\n`;
      if (a.tips) t += `     💡 ${a.tips}\n`;
      t += `\n`;
    });
    t += `\n`;
  });
  t += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  t += `💸 预算参考：${it.totalBudgetEstimate}\n\n`;
  t += `💡 实用贴士：\n`;
  it.tips.forEach((tip, i) => {
    t += `  ${i + 1}. ${tip}\n`;
  });
  t += `\n—— 金陵文旅通 祝您在六朝古都玩得愉快！ ——`;
  return t;
}
