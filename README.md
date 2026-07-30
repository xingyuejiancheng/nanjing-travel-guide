# 🏯 金陵文旅通 · 南京深度旅游速查与智能攻略定制

> 六朝金粉地，金陵帝王州。一站式南京旅游资源速查 + 个性化攻略定制，路线优化、季节适配、一键 PDF 导出，轻松搞定您的南京深度之旅。

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

## ✨ 核心功能

| 功能 | 说明 |
|:---|:---|
| 🗂️ **南京资源速查库** | 112 条深度数据，涵盖景点/美食/历史文化/购物/山岳，不止大众景点，更有冷门好去处 |
| 🎯 **五大偏好定制** | 历史文化、美食探索、拍照出片、自然登山、潮流购物，按需加权打分 |
| 📅 **1~10 天任意天数** | 周末 2 日游，小长假 3 日游，深度 7~10 日游，灵活选择 |
| 🌸 **四季智能适配** | 春赏花、夏避暑（11:30~15:30 自动改室内）、秋栖霞、冬温泉，夏季美食配小龙虾，冬季配羊肉汤 |
| 🗺️ **地理聚类路线优化** | 基于 Haversine 真实经纬度距离 + 22km 同日最大跨度阈值，珍珠泉↔佘村绝不南辕北辙同天出现 |
| 🌙 **夜间活动去重池** | 每季 3~4 种不同夜间活动（老门东、南京眼、南湖夜宵、颐和路、阅江楼、1912、玄武湖夜樱、汤山温泉），三天行程绝不天天都是秦淮河 |
| 📄 **一键导出 PDF** | html2canvas + jsPDF，A4 分页，2 倍清晰度，文件名自动带日期，打印 / 分享 / 存档一键搞定 |
| 💾 **攻略本地收藏** | 用 Zustand + persist 存在 localStorage，"我的攻略"里随时回看、删除、重新生成 |
| 📱 **响应式 UI** | 手机 / 平板 / 桌面三端完美适配，Tailwind + 传统中国风配色，好看又好用 |
| 🔔 **细节拉满** | 空状态引导、加载动画、Toast 成功/失败反馈、刷新按钮、保存成功提示应有尽有 |

---

## 📊 数据规模

| 分类 | 数量 | 举例 |
|:---|:---:|:---|
| 🏛️ 景点 | 40 条 | 中山陵、明孝陵、夫子庙、总统府、秦淮河、栖霞山、牛首山、珍珠泉、佘村、天生桥、高淳老街… |
| 🍲 美食 | 30 条 | 鸭血粉丝汤、盐水鸭、牛肉锅贴、小笼包、大闸蟹、活珠子、皮肚面、小龙虾、南京大牌档、章云板鸭… |
| 📜 历史文化故事 | 25 条 | 楚威王埋金、顾恺之瓦官寺画维摩诘、陈叔宝胭脂井、朱自清背影浦口火车站、红楼梦与江宁织造… |
| 🏬 购物商圈 | 8 条 | 德基广场、新街口、金鹰世界、先锋书店、湖南路、老门东、水游城、砂之船奥莱 |
| 🗻 山岳徒步 | 9 条 | 紫金山、栖霞山、牛首山、老山、将军山、幕府山、游子山、无想山、龙王山 |

---

## 🚀 快速开始（3 步搞定，开箱即用）

### 前置条件

- **Node.js ≥ 18**（推荐 20 LTS）
- **npm ≥ 9**（Node 自带）
- Windows 10/11 或 macOS 或 Linux 都可以

> 👉 不懂技术？不用怕，照下面复制粘贴 3 条命令就行！

---

### 第 1 步：进入项目目录

```powershell
# 终端/命令行里先进入项目文件夹
cd "C:\Users\Administrator\Desktop\计算机工程与科学\nanjing-travel-guide"
```

> 如果您是从 GitHub 克隆下来的：
> ```bash
> git clone https://github.com/xingyuejiancheng/nanjing-travel-guide.git
> cd nanjing-travel-guide
> ```

---

### 第 2 步：安装依赖（只需要第一次安装一次）

```powershell
npm install
```

⏳ 大概 1~3 分钟，出现 `up to date` 或 `added xxx packages` 就说明装好了。

> 💡 如果下载很慢（国内网络），可以先切换淘宝镜像再安装：
> ```powershell
> npm config set registry https://registry.npmmirror.com
> npm install
> ```

---

### 第 3 步：启动，浏览器自动打开就能用！

```powershell
npm run dev
```

终端出现下面这个绿色的信息就成功了：

```
  VITE v6.4.3  ready in 730 ms

  ➜  Local:   http://localhost:5173/
```

👉 **打开浏览器访问 http://localhost:5173/ 就可以开始使用啦！** 🎉

> ✅ 开发模式支持热更新：代码改完保存，浏览器自动刷新，不用重启。

---

## 📖 使用指南

### 1️⃣ 生成专属攻略

1. 打开首页 → 点击 **「开始定制我的南京之旅」** 或顶部导航 **「攻略生成」**
2. **选择偏好**（可多选）：
   - 🏛️ 历史文化游
   - 🍲 美食探索之旅
   - 📸 拍照打卡出片
   - 🏔️ 自然登山徒步
   - 🛍️ 潮流购物商圈
3. **选择出行天数**：1~10 天任意拉选滑块
4. **选择季节**：春夏秋冬（决定室外活动时间 + 当季美食 + 夜间活动池）
5. 点击 **「✨ 立即生成专属攻略」** → 等待 2~3 秒旋转动画 → 定制完成！

---

### 2️⃣ 查看攻略详情

攻略生成后会显示：

- **行程总览**：主题名（夏日清凉 / 金秋寻韵 / 冬日温泉等）、覆盖行政区、总预算、总步行公里数、总时长
- **每日行程卡片**：
  - 🌅 上午（黄金时段，户外优选）
  - ☀️ 中午（夏季自动切换室内，避免中暑）
  - 🌇 下午
  - 🍜 晚餐推荐（匹配当季美食）
  - 🌃 夜间活动（秦淮河 / 老门东 / 南京眼 / 颐和路 / 阅江楼 / 温泉等按季节轮换，保证不重复）
  - 🚇 交通贴士
  - 💴 当日预算
- **路线提示**：地理聚类后景点间距合理，不会出现南辕北辙
- **小贴士**：夏季避暑、冬季保暖、预约提醒等

---

### 3️⃣ 一键导出 PDF （A4 打印 / 分享）

1. 在攻略详情页，点击顶部操作栏 **「📄 一键导出 PDF」** 按钮
2. 看到 Toast 提示 `📄 正在生成 PDF，请稍候…`（约 3~5 秒）
3. 浏览器自动下载文件，文件名形如：`南京3日定制攻略_20260730.pdf`
4. 用 PDF 阅读器打开，可直接打印或微信分享给同行小伙伴

> 💡 打印前在打印设置里选「A4 纸」、「适合页面」效果最佳。

---

### 4️⃣ 保存到「我的攻略」

1. 攻略详情页点击 **「💾 保存到我的攻略」**
2. Toast 出现 `✅ 攻略已保存！` 即成功
3. 顶部导航点 **「我的攻略」** 即可查看所有保存过的攻略
4. 每张卡片有「查看详情」和「删除」两个按钮
5. 没有保存过时会显示可爱的空状态引导卡片 + 一键跳转生成页

---

### 5️⃣ 资源速查 / 文化百科

- **资源速查**：点击首页各分类卡片或导航「资源速查」，浏览所有 112 条数据，支持按类型筛选（景点 / 美食 / 购物 / 山岳）
- **文化百科**：25 篇深度历史文化故事，楚威王埋金、顾恺之点睛、陈叔宝胭脂井、朱自清背影、红楼梦江宁织造…每篇都是长文详解，值得细品

---

## 🛠️ 常用命令

在项目根目录 `nanjing-travel-guide/` 下运行：

| 命令 | 说明 |
|:---|:---|
| `npm run dev` | 启动开发服务器 → http://localhost:5173/ |
| `npm run build` | **打包生产版本**（输出到 `dist/` 目录，可部署到服务器/托管平台） |
| `npm run preview` | 本地预览打包后的生产版本（需要先 `build`） |
| `npm run check` | TypeScript 类型检查（报错要修！） |
| `npm run lint` | ESLint 代码规范检查 |

---

## 📁 项目结构

```
nanjing-travel-guide/
├── src/
│   ├── components/         # UI 通用组件（Toast、空状态、卡片等）
│   ├── data/               # 南京旅游资源数据库
│   │   ├── attractions.ts  # 40 个景点
│   │   ├── foods.ts        # 30 道美食
│   │   ├── cultures.ts     # 25 篇历史文化
│   │   └── shoppings.ts    # 8 个购物 + 9 座山岳
│   ├── engine/
│   │   └── itineraryEngine.ts  # 攻略引擎核心（打分+地理聚类+夜间去重+季节适配）
│   ├── pages/              # 页面
│   │   ├── HomePage.tsx        # 首页
│   │   ├── LibraryPage.tsx     # 资源速查
│   │   ├── CulturePage.tsx     # 文化百科
│   │   ├── PlannerPage.tsx     # 攻略生成（偏好+天数+季节）
│   │   ├── ItineraryPage.tsx   # 攻略详情 + PDF导出 + 保存
│   │   └── SavedPage.tsx       # 我的攻略
│   ├── store/              # Zustand 全局状态（保存的攻略 + Toast）
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 路由入口 + Toast 容器
│   └── main.tsx            # React 挂载入口
├── dist/                   # npm run build 产物（可直接部署）
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🧠 核心算法速览

### 地理聚类防南辕北辙
在 `splitIntoDayClusters()` 中，同一天内任意两个景点的 Haversine 球面距离若 > **22km**，就会被拆分到不同天。
典型长距离对（都会被分天）：
- 珍珠泉 ↔ 佘村明清建筑群：**35.6 km** ✅ 被拆
- 新街口 ↔ 汤山温泉：**24.5 km** ✅ 被拆
- 栖霞山 ↔ 牛首山：**29.9 km** ✅ 被拆

### 夜间活动去重
`NIGHT_ACTIVITIES_BY_SEASON` 按季节有独立池子，每次使用后 `usedNightCategories.add()`，跨天不再重复。
每季最少 3 种，3 天行程保证秦淮河最多出现 1 次。

### 夏季中午避热
当 `season === 'summer'` 时，11:30~15:30 的推荐自动选择 `indoorOutdoor === 'indoor'` 的资源（南京博物院、总统府、德基美术馆等），绝不让您在 37℃ 下暴走。

---

## ❓ 常见问题 FAQ

### Q1: 执行 `npm run dev` 后浏览器打开显示服务不可用？
**A**: 检查终端是否出现 `VITE ready` 字样，如果没出现说明没启动成功，重新执行 `npm run dev`；如果出现了但端口 5173 被占用，加个端口：`npm run dev -- --port 5174`。

---

### Q2: `git push` 到 GitHub 失败 / 连不上 github.com？
**A**: 您的 Git 很可能配置了全局代理（socks5://127.0.0.1:7890）但代理软件没开，或配置了 fastgit 镜像重写。用下面这条临时绕过：
```powershell
git -c http.proxy= -c https.proxy= push origin main
```
想永久关闭本地项目的代理：
```powershell
cd nanjing-travel-guide
git config --local http.proxy ""
git config --local https.proxy ""
git config --local url."https://github.com/".insteadOf "https://download.fastgit.org/"
```

---

### Q3: npm install 卡住不动 / ECONNRESET？
**A**: 切换国内淘宝镜像再重新安装：
```powershell
npm config set registry https://registry.npmmirror.com
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Q4: `npm run build` 报错 tsc 类型错误？
**A**: 先执行 `npm run check` 看具体哪一行。常见原因是数据文件里某个景点的 `tags` 数组多写了逗号、或 `recommendedDuration` 被写成了字符串。按 TypeScript 报错提示修就行。

---

### Q5: 导出 PDF 显示空白 / 图片加载不出来？
**A**: html2canvas 跨域图片可能失败。本项目使用的 API 图片 `trae-api-cn.mchost.guru` 已开启 CORS，一般在 `localhost:5173` 下不会有问题。如果是部署到其他域名出现空白，请在 `html2canvas` 的 options 里加上 `useCORS: true, allowTaint: true`（已默认加上）。

---

### Q6: 如何部署到网上让朋友也能用？
**A**: 执行 `npm run build` 得到 `dist/` 文件夹，里面就是纯静态页面。直接上传到以下任一平台即可免费托管：
- Vercel（拖放 dist 文件夹即可）
- Netlify（同上）
- GitHub Pages
- Cloudflare Pages

绑定域名后，朋友直接访问域名即可使用，不用安装任何东西。

---

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|:---|:---|:---|
| UI 框架 | React | ^18.3.1 |
| 语言 | TypeScript | ~5.8.3 |
| 构建工具 | Vite | ^6.3.5 |
| 样式 | Tailwind CSS | ^3.4.17 |
| 路由 | React Router DOM | ^7.3.0 |
| 状态管理 | Zustand（带 persist 本地持久化） | ^5.0.3 |
| 图标 | Lucide React | ^0.511.0 |
| PDF 导出 | html2canvas + jsPDF | ^1.4.1 + ^4.2.1 |
| 工具 | clsx + tailwind-merge | 最新 |
| 代码规范 | ESLint + typescript-eslint | ^9.25.0 |

---

## 📝 License

MIT © 金陵文旅通

> 免责声明：景点开放时间、门票价格、交通信息等仅供参考，出行前请以景区官方公告为准。祝您南京之旅愉快！

---

**Made with ❤️ for 六朝古都金陵。**
