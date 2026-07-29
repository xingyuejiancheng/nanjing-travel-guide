import { Link } from "react-router-dom";
import {
  BookOpen,
  Scroll,
  Crown,
  Sword,
  Sparkles,
  Star,
} from "lucide-react";
import { cultures } from "@/data/cultures";
import { attractions } from "@/data/attractions";
import { foods } from "@/data/foods";
import { mountains } from "@/data/shoppings";
import { CATEGORY_EMOJI } from "@/types";

export default function LibraryPage() {
  const dynasties = [
    {
      name: "六朝金粉",
      time: "229-589",
      color: "from-emerald-500 to-teal-600",
      content:
        "东吴、东晋、宋、齐、梁、陈六个朝代相继建都建康（今南京），建康是当时世界上最大的城市，人口超过百万，与古罗马城并称为'世界古典文明两大中心'。",
      highlights: ["六朝博物馆", "乌衣巷王谢故居", "顾恺之·王羲之", "陶渊明·谢灵运"],
    },
    {
      name: "南唐词韵",
      time: "937-975",
      color: "from-pink-500 to-rose-600",
      content:
        "五代十国时期的南唐定都金陵，国力富庶文化繁荣，后主李煜是词中之帝，'问君能有几多愁？恰似一江春水向东流'开宋词豪放婉约之先河。",
      highlights: ["李煜·虞美人", "南唐二陵", "韩熙载夜宴图", "董源山水画"],
    },
    {
      name: "大明王朝",
      time: "1368-1421",
      color: "from-cinnabar-600 to-cinnabar-800",
      content:
        "1368年朱元璋在应天府（南京）称帝建立明朝，修城墙、建宫城、孝陵，南京第一次成为大一统王朝的首都，也是当时世界上最大的城市。",
      highlights: ["明孝陵·世界遗产", "南京明城墙", "明故宫遗址", "郑和下西洋"],
    },
    {
      name: "太平天国",
      time: "1853-1864",
      color: "from-amber-500 to-orange-600",
      content:
        "1853年太平军攻克南京，改名天京，建立与清廷对峙的太平天国农民政权，留下了天朝田亩制度和资政新篇等近代化尝试。",
      highlights: ["瞻园（东王府）", "堂子街壁画", "天朝宫殿遗址", "资政新篇"],
    },
    {
      name: "中华民国",
      time: "1912-1949",
      color: "from-sky-600 to-blue-700",
      content:
        "1912年1月1日孙中山在南京就任临时大总统，建立中华民国；1927-1937年南京国民政府'黄金十年'，1949年4月23日南京解放。",
      highlights: ["中山陵", "总统府", "美龄宫", "1912街区"],
    },
  ];

  const timelines: { year: string; event: string; dynasty: string }[] = [
    { year: "前333年", event: "楚威王筑金陵邑，南京得名金陵", dynasty: "战国·楚" },
    { year: "229年", event: "吴大帝孙权建都建业，六朝古都开端", dynasty: "东吴" },
    { year: "317年", event: "司马睿建东晋，衣冠南渡，北人南迁", dynasty: "东晋" },
    { year: "589年", event: "隋灭陈，建康城被平毁为田", dynasty: "隋" },
    { year: "937年", event: "徐知诰（李昪）建南唐，都金陵", dynasty: "南唐" },
    { year: "1368年", event: "朱元璋建明朝，定都应天府", dynasty: "明" },
    { year: "1421年", event: "明成祖迁都北京，南京为留都", dynasty: "明" },
    { year: "1853年", event: "太平天国定都天京", dynasty: "太平天国" },
    { year: "1912年", event: "孙中山就任临时大总统，民国成立", dynasty: "中华民国" },
    { year: "1927年", event: "国民政府定都南京，黄金十年开始", dynasty: "中华民国" },
    { year: "1937年", event: "日军南京大屠杀，30万同胞遇难", dynasty: "中华民国" },
    { year: "1949年", event: "4月23日南京解放，红旗插上总统府", dynasty: "中华人民共和国" },
  ];

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen pb-20">
      <div className="container pt-10">
        {/* 页头 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-jinling-500" />
            <h1 className="font-serif text-4xl md:text-5xl font-black text-moyu-900">
              🏯 金陵文化百科
            </h1>
            <span className="h-px w-10 bg-jinling-500" />
          </div>
          <p className="font-kai text-celadon-700 text-lg max-w-2xl mx-auto">
            一条颐和路，半部民国史；一座栖霞山，半部金陵史。
            <br />
            了解南京，从她的历史开始。
          </p>
        </div>

        {/* 朝代卡片 */}
        <div className="mb-16">
          <SectionTitle icon={<Crown className="w-6 h-6" />} title="六朝古都 · 朝代更迭" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {dynasties.map((d, i) => (
              <div
                key={d.name}
                className="relative rounded-2xl overflow-hidden shadow-classic border-2 border-white/50 group hover:-translate-y-1 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-95`}
                />
                <div className="absolute inset-0 bg-paper-texture opacity-20 mix-blend-overlay" />
                <div className="relative p-5 text-white h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-serif text-2xl font-black">{d.name}</div>
                    <Crown className="w-5 h-5 text-jinling-300" />
                  </div>
                  <div className="text-xs font-kai text-white/80 mb-4">
                    {d.time}
                  </div>
                  <p className="font-kai text-sm leading-relaxed text-white/90 mb-4 min-h-[120px]">
                    {d.content}
                  </p>
                  <div className="space-y-1.5">
                    {d.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-1.5 text-xs font-kai bg-white/10 backdrop-blur border border-white/20 rounded-md px-2 py-1"
                      >
                        <Sparkles className="w-3 h-3 text-jinling-200 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 历史时间轴 */}
        <div className="mb-16">
          <SectionTitle
            icon={<Scroll className="w-6 h-6" />}
            title="金陵大事记 · 历史时间轴"
          />
          <div className="relative pl-6 md:pl-10 max-w-3xl mx-auto">
            <div className="absolute top-0 bottom-0 left-2 md:left-4 w-0.5 bg-gradient-to-b from-jinling-500 via-cinnabar-500 to-jinling-400" />
            {timelines.map((t, i) => (
              <div
                key={i}
                className="relative mb-5 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute -left-[22px] md:-left-[30px] top-3 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-cinnabar-600 to-cinnabar-700 border-4 border-jinling-300 shadow-seal z-10" />
                <div className="bg-white rounded-2xl shadow-classic border border-jinling-200/60 p-5 hover:shadow-gold transition">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinnabar-100 text-cinnabar-700 font-serif font-bold text-sm">
                      {t.year}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-jinling-100 text-moyu-700 font-kai text-xs border border-jinling-200">
                      {t.dynasty}
                    </span>
                  </div>
                  <div className="font-kai text-moyu-800 text-lg leading-relaxed pl-1">
                    {t.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 历史人物故事 */}
        <div className="mb-16">
          <SectionTitle
            icon={<BookOpen className="w-6 h-6" />}
            title="名人典故 · 历史文化故事精选"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cultures.slice(0, 9).map((c, i) => (
              <Link
                key={c.id}
                to={`/resources/culture/${c.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-classic border border-jinling-200/60 hover:shadow-gold hover:-translate-y-1 transition-all"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-moyu-900/85 to-transparent" />
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-jinling-400/95 backdrop-blur text-moyu-900 text-xs font-bold font-kai">
                    <Star className="w-3 h-3 fill-cinnabar-700 text-cinnabar-700" />
                    {c.rating}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="font-kai text-xs text-jinling-200 mb-1">
                      📜 {c.dynasty}
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-tight line-clamp-2">
                      {c.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-kai text-sm text-moyu-700 leading-relaxed line-clamp-3 mb-3">
                    {c.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-xuanzhi-100 text-moyu-600 text-xs font-kai border border-xuanzhi-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/resources?tab=culture"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-jinling-400 font-kai text-cinnabar-700 hover:bg-jinling-50 shadow-classic"
            >
              {CATEGORY_EMOJI.culture} 查看全部 {cultures.length} 个历史故事
            </Link>
          </div>
        </div>

        {/* 快速浏览区 */}
        <div>
          <SectionTitle
            icon={<Sword className="w-6 h-6" />}
            title="资源速查 · 总数一览"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: "🏛️",
                n: attractions.length,
                t: "精华景点",
                d: attractions.map((a) => a.name).slice(0, 5).join("、"),
                tab: "attraction",
                color: "from-cinnabar-500 to-cinnabar-700",
              },
              {
                icon: "🍜",
                n: foods.length,
                t: "地道美食",
                d: foods.map((a) => a.name).slice(0, 5).join("、"),
                tab: "food",
                color: "from-jinling-500 to-amber-600",
              },
              {
                icon: "🛍️",
                n: 8,
                t: "购物商圈",
                d: "德基广场、新街口、金鹰世界、虹悦城...",
                tab: "shopping",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: "⛰️",
                n: mountains.length,
                t: "名山胜地",
                d: mountains.map((a) => a.name).slice(0, 5).join("、"),
                tab: "mountain",
                color: "from-emerald-600 to-teal-700",
              },
            ].map((s, i) => (
              <Link
                key={s.t}
                to={`/resources?tab=${s.tab}`}
                className="group relative overflow-hidden rounded-2xl p-5 shadow-classic border border-white/60 text-white hover:scale-[1.02] transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-95`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-5xl">{s.icon}</div>
                    <div className="font-serif text-5xl font-black text-white/25">
                      {s.n}
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold mb-2">
                    {s.t}
                  </div>
                  <div className="font-kai text-sm text-white/85 leading-relaxed min-h-[48px]">
                    {s.d}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-kai text-jinling-200 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition">
                    点击查看全部 →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-classic border-2 border-jinling-300/50">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <h3 className="font-serif text-2xl font-bold text-moyu-900 mb-1 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cinnabar-600" />
                  规划属于您自己的金陵之旅
                </h3>
                <p className="font-kai text-celadon-700">
                  告诉我们您的兴趣、天数、季节，为您量身定制最人性化的南京深度游攻略
                </p>
              </div>
              <Link
                to="/planner"
                className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cinnabar-600 to-cinnabar-700 text-white font-kai text-lg shadow-gold hover:scale-105 transition border-2 border-jinling-400"
              >
                <Sparkles className="w-5 h-5" />
                立即生成攻略
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-11 h-11 rounded-xl bg-cinnabar-600 text-jinling-100 flex items-center justify-center shadow-seal border-2 border-jinling-400 shrink-0">
        {icon}
      </div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-moyu-900">
        {title}
      </h2>
      <span className="h-px flex-1 bg-jinling-200" />
    </div>
  );
}

// 结束标记，无未使用
