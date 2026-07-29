import { Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  Sparkles,
  Camera,
  Mountain,
  ShoppingBag,
  UtensilsCrossed,
  Landmark,
} from "lucide-react";
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  type ResourceCategory,
} from "@/types";
import { attractions } from "@/data/attractions";
import { foods } from "@/data/foods";
import { cultures } from "@/data/cultures";
import { shoppings, mountains } from "@/data/shoppings";

const counts: Record<ResourceCategory, number> = {
  attraction: attractions.length,
  food: foods.length,
  culture: cultures.length,
  shopping: shoppings.length,
  mountain: mountains.length,
};

export default function HomePage() {
  const categories: {
    key: ResourceCategory;
    desc: string;
    img: string;
    Icon: typeof Landmark;
  }[] = [
    {
      key: "attraction",
      desc: "中山陵、明孝陵、夫子庙、总统府、秦淮河、栖霞山…",
      Icon: Landmark,
      img:
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京明孝陵石象路秋景%20银杏%20红叶%20石象%20古道%20唯美风景&image_size=landscape_4_3",
    },
    {
      key: "food",
      desc: "鸭血粉丝汤、盐水鸭、牛肉锅贴、小笼包、大闸蟹、活珠子…",
      Icon: UtensilsCrossed,
      img:
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京美食%20鸭血粉丝汤%20盐水鸭%20小笼包%20锅贴%20满桌美食&image_size=landscape_4_3",
    },
    {
      key: "culture",
      desc: "六朝、明朝、民国、朱元璋、孙中山、红楼梦、乌衣巷…",
      Icon: Camera,
      img:
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京六朝历史文化%20乌衣巷%20古建筑%20水墨风格%20诗意画卷&image_size=landscape_4_3",
    },
    {
      key: "shopping",
      desc: "德基广场、新街口、金鹰世界、先锋书店、湖南路、老门东…",
      Icon: ShoppingBag,
      img:
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京德基广场%20夜景%20繁华购物中心%20新街口中华商圈&image_size=landscape_4_3",
    },
    {
      key: "mountain",
      desc: "紫金山、栖霞山、牛首山、老山、将军山、幕府山、游子山…",
      Icon: Mountain,
      img:
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京紫金山头陀岭俯瞰南京城%20云海%20登山%20壮丽景色&image_size=landscape_4_3",
    },
  ];

  return (
    <div className="bg-xuanzhi-100 bg-paper-texture min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=南京城市全景%20明城墙秦淮河紫金山%20古今交融%20航拍%20恢弘大气&image_size=landscape_16_9')",
          }}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container pt-24 pb-32 text-white">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-jinling-300" />
              <span className="font-kai text-sm tracking-widest">
                六朝金粉地 · 金陵帝王州
              </span>
            </div>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 animate-fade-in-up [animation-delay:100ms]">
              <span className="block text-white drop-shadow-lg">金陵胜地</span>
              <span className="block mt-2 text-jinling-300 drop-shadow-lg">
                六朝古都
              </span>
            </h1>
            <p className="font-kai text-xl md:text-2xl leading-relaxed text-white/90 max-w-2xl mb-10 animate-fade-in-up [animation-delay:200ms]">
              一站式南京旅游资源速查与智能攻略生成器。
              <br />
              根据您的兴趣偏好、出行天数、季节时令，
              <br className="hidden md:block" />
              为您量身定制人性化、高效率的南京深度之旅。
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link
                to="/planner"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cinnabar-600 text-white font-kai text-lg shadow-gold hover:bg-cinnabar-700 hover:scale-[1.03] active:scale-[0.98] transition-all border-2 border-jinling-400/60"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
                开始定制我的南京之旅
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur text-white border-2 border-white/40 font-kai text-lg hover:bg-white/20 hover:border-jinling-300 transition-all"
              >
                <MapPin className="w-5 h-5" />
                先逛逛资源库
              </Link>
            </div>

            {/* 特色标签 */}
            <div className="flex flex-wrap gap-3 mt-14 animate-fade-in-up [animation-delay:500ms]">
              {[
                "🏛️ 25+ 精华景点",
                "🍜 18+ 地道美食",
                "📜 15+ 历史故事",
                "🏬 8+ 购物商圈",
                "⛰️ 9+ 登山胜地",
                "🌞 四季智能适配",
                "🗺️ 路线优化规划",
                "💰 预算人性化",
              ].map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-kai border border-white/20 hover:bg-white/20 transition"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-xuanzhi-100 pointer-events-none" />
      </section>

      {/* 分类卡片 */}
      <section className="container -mt-12 pb-20 relative z-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-12 bg-jinling-500" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-moyu-900">
              南京旅游资源速查库
            </h2>
            <span className="h-px w-12 bg-jinling-500" />
          </div>
          <p className="font-kai text-celadon-700">
            分门别类，全面覆盖南京吃、喝、玩、乐、购、游、学
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.key}
              to={`/resources?tab=${cat.key}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-classic hover:shadow-gold transition-all duration-500 border border-jinling-200/60 animate-fade-in-up hover:-translate-y-2"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* 图片 */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={cat.img}
                  alt={CATEGORY_LABEL[cat.key]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-moyu-900/90 via-moyu-900/30 to-transparent" />
                {/* 标签角标 */}
                <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-cinnabar-600/95 backdrop-blur flex items-center justify-center shadow-seal border-2 border-jinling-400">
                  <span className="text-2xl">{CATEGORY_EMOJI[cat.key]}</span>
                </div>
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <cat.Icon className="w-5 h-5 text-jinling-300" />
                    <h3 className="font-serif text-2xl font-bold">
                      {CATEGORY_LABEL[cat.key]}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-jinling-500/80 text-moyu-900 text-xs font-bold font-kai">
                      {counts[cat.key]} 条
                    </span>
                  </div>
                  <p className="text-sm font-kai text-white/85 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center justify-between border-t border-xuanzhi-200">
                <span className="font-kai text-sm text-moyu-700 group-hover:text-cinnabar-700 transition">
                  点击查看全部 {CATEGORY_LABEL[cat.key]}
                </span>
                <Compass className="w-4 h-4 text-jinling-600 group-hover:translate-x-1 group-hover:rotate-45 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 生成攻略步骤 */}
      <section className="bg-gradient-to-b from-xuanzhi-100 to-jinling-50 py-20 border-t border-jinling-200/60">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="h-px w-12 bg-cinnabar-500" />
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-moyu-900">
                四步定制专属攻略
              </h2>
              <span className="h-px w-12 bg-cinnabar-500" />
            </div>
            <p className="font-kai text-celadon-700">
              告别繁琐的攻略搜索，一分钟得到您的南京深度游计划
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                n: 1,
                title: "选择偏好",
                desc: "选择您的兴趣标签：历史、美食、拍照、爬山、购物",
                icon: "❤️",
              },
              {
                n: 2,
                title: "设定天数",
                desc: "自由选择1-10天的行程，灵活定制行程长度",
                icon: "📅",
              },
              {
                n: 3,
                title: "选择季节",
                desc: "春夏秋冬智能适配，避暑/防寒/赏景/美食不踩坑",
                icon: "🌤️",
              },
              {
                n: 4,
                title: "一键生成",
                desc: "路线优化+季节安排+人性化作息+预算估算，一站搞定",
                icon: "✨",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className="relative bg-white rounded-2xl p-6 shadow-classic border border-jinling-200/50 hover:-translate-y-1 hover:shadow-gold transition-all"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-cinnabar-600 text-jinling-100 font-serif font-bold text-xl flex items-center justify-center shadow-seal">
                  {s.n}
                </div>
                <div className="text-5xl mb-4 pt-4">{s.icon}</div>
                <h3 className="font-serif text-xl font-bold text-moyu-900 mb-2">
                  {s.title}
                </h3>
                <p className="font-kai text-sm text-moyu-700 leading-relaxed">
                  {s.desc}
                </p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-jinling-500 text-2xl z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-cinnabar-600 text-white font-kai text-lg shadow-gold hover:bg-cinnabar-700 transition border-2 border-jinling-400/60 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5" />
              立即生成我的专属攻略
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-moyu-900 text-white/80 py-12 border-t-4 border-jinling-500/40">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-cinnabar-600 flex items-center justify-center shadow-seal">
                  <Compass className="w-6 h-6 text-jinling-300" />
                </div>
                <div>
                  <div className="font-serif text-xl text-white">金陵胜迹</div>
                  <div className="font-kai text-xs text-jinling-300">
                    南京定制旅游攻略
                  </div>
                </div>
              </div>
              <p className="font-kai text-sm leading-relaxed text-white/70">
                六朝金粉地，金陵帝王州。
                <br />
                让每一次南京之行，都成为难忘的美好回忆。
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-jinling-300">快速导航</h4>
              <ul className="space-y-2 font-kai text-sm">
                <li><Link to="/" className="hover:text-jinling-300">首页</Link></li>
                <li><Link to="/resources" className="hover:text-jinling-300">资源速查</Link></li>
                <li><Link to="/library" className="hover:text-jinling-300">文化百科</Link></li>
                <li><Link to="/planner" className="hover:text-jinling-300">智能攻略生成</Link></li>
                <li><Link to="/saved" className="hover:text-jinling-300">我的攻略</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-4 text-jinling-300">友情提示</h4>
              <ul className="space-y-2 font-kai text-sm text-white/70">
                <li>📍 南京博物院、中山陵需提前预约</li>
                <li>🚇 推荐地铁出行，覆盖全城景点</li>
                <li>🍜 吃小吃去老门东，避开夫子庙核心区</li>
                <li>🌞 夏季11:30-15:30尽量安排室内活动</li>
                <li>🏯 明孝陵石象路秋景：11月中下旬最盛</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center font-kai text-xs text-white/50">
            © {new Date().getFullYear()} 金陵胜迹 · 南京旅游资源库与智能攻略生成器 ·
            本应用数据仅供参考，出行请以官方信息为准
          </div>
        </div>
      </footer>
    </div>
  );
}
