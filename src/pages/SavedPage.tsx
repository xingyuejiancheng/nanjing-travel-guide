import { Link, useNavigate } from "react-router-dom";
import { useTravelStore } from "@/store/travelStore";
import {
  Calendar,
  Heart,
  Sparkles,
  FolderOpen,
  Trash2,
  ArrowRight,
  MapPin,
  Wallet,
} from "lucide-react";
import {
  INTEREST_EMOJI,
  INTEREST_LABEL,
  SEASON_EMOJI,
  SEASON_LABEL,
} from "@/types";

export default function SavedPage() {
  const nav = useNavigate();
  const { savedItineraries, deleteItinerary, setCurrentItinerary } =
    useTravelStore();

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      <div className="container pt-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-jinling-500" />
            <h1 className="font-serif text-4xl font-bold text-moyu-900">
              📂 我的攻略收藏
            </h1>
            <span className="h-px w-10 bg-jinling-500" />
          </div>
          <p className="font-kai text-celadon-700">
            已保存 {savedItineraries.length} 份专属南京定制攻略
          </p>
        </div>

        {savedItineraries.length === 0 ? (
          <div className="max-w-xl mx-auto py-20 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-jinling-100 flex items-center justify-center border-4 border-jinling-200">
              <FolderOpen className="w-16 h-16 text-cinnabar-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-moyu-900 mb-2">
              还没有生成过攻略
            </h2>
            <p className="font-kai text-celadon-700 mb-8">
              告诉我们您的兴趣和出行计划，立即为您定制专属的南京深度游攻略
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 text-white font-kai text-lg shadow-gold hover:scale-[1.02] transition border-2 border-jinling-400"
            >
              <Sparkles className="w-5 h-5 text-jinling-300" />
              立即生成第一份攻略
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedItineraries.map((it, idx) => (
              <div
                key={it.id}
                className="group relative bg-white rounded-2xl shadow-classic border-2 border-jinling-200/70 overflow-hidden hover:shadow-gold hover:border-jinling-400 transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-44 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cinnabar-600 via-cinnabar-700 to-cinnabar-800" />
                  <div className="absolute top-0 right-0 w-64 h-64 -mt-28 -mr-28 rounded-full bg-jinling-400/15 blur-3xl" />
                  <div className="absolute bottom-0 left-1/2 w-56 h-56 -mb-28 rounded-full bg-cinnabar-400/10 blur-3xl" />
                  <div className="relative p-5 text-white h-full flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-kai">
                        <Calendar className="w-3.5 h-3.5 text-jinling-300" />
                        {new Date(it.generatedAt).toLocaleDateString("zh-CN")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-jinling-400/20 border border-jinling-300/40 text-xs font-kai">
                        {SEASON_EMOJI[it.input.season]} {SEASON_LABEL[it.input.season].split(" ")[0]}
                      </span>
                      {it.input.interests.map((i) => (
                        <span
                          key={i}
                          title={INTEREST_LABEL[i]}
                          className="w-7 h-7 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-sm"
                        >
                          {INTEREST_EMOJI[i]}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold leading-snug line-clamp-3 mb-2">
                      {it.summary}
                    </h3>
                    <div className="mt-auto flex items-center gap-4 text-xs font-kai text-white/85">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {it.input.days} 天行程
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {
                          new Set(
                            it.days.flatMap((d) => d.districtFocus)
                          ).size
                        }{" "}
                        个行政区
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {it.days.reduce((s, d) => s + d.activities.length, 0)} 项活动
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-t border-xuanzhi-100">
                  <div>
                    <div className="text-xs text-celadon-600 font-kai mb-1">
                      <Wallet className="inline w-3.5 h-3.5 mr-1" />
                      预算参考
                    </div>
                    <div className="font-bold text-moyu-800 font-serif">
                      {it.totalBudgetEstimate.slice(0, 22)}
                      {it.totalBudgetEstimate.length > 22 ? "..." : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm("删除这份攻略？")) {
                          deleteItinerary(it.id);
                        }
                      }}
                      className="w-11 h-11 rounded-xl bg-white border-2 border-cinnabar-200 text-cinnabar-700 flex items-center justify-center hover:bg-cinnabar-50 transition"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentItinerary(it);
                        nav(`/itinerary/${it.id}`);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cinnabar-600 text-white font-kai shadow-seal hover:bg-cinnabar-700 transition border-2 border-jinling-400"
                    >
                      查看详情
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {savedItineraries.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-jinling-400 font-kai text-cinnabar-700 hover:bg-jinling-50 shadow-classic"
            >
              <Sparkles className="w-5 h-5" />
              生成一份新的攻略
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
