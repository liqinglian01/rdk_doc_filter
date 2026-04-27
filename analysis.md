# 用户行为统计插件使用手册（Umami × Docusaurus）

本仓库通过本地插件 **`plugins/docusaurus-plugin-umami-analytics`** 接入 [Umami](https://umami.is/)，在浏览器端自动采集页面浏览与文档阅读相关行为，并在 Umami 后台以 **Events** 等形式查看。

---

## 1. 插件做什么

| 层级 | 作用 |
|------|------|
| **插件入口** (`index.js`) | 向页面注入 Umami 脚本、写入运行时开关；未配置站点 ID 时不注入、不加载客户端逻辑。 |
| **客户端模块** (`client/index.js`) | 在 Docusaurus 路由变化时上报 `pageview`，并绑定滚动、目录、搜索、复制等监听（仅绑定一次，避免重复）。 |

设计要点：

- **`data-auto-track="false"`**：关闭 Umami 默认自动 PV，由 **`onRouteUpdate`** 手动上报，避免 SPA 重复或漏报。
- **`window.__UMAMI_DOCUSAURUS__`**：把 `enableScroll` 等开关注入到页面，与构建时配置一致。
- **阅读深度**：按 **25% / 50% / 75% / 100%** 里程碑各上报一次（同一页面内去重）。

---

## 2. 启用条件（必读）

必须提供非空的 **`websiteId`**（Umami 里「网站 / Website」对应的 ID，一串 UUID 样式字符串）。否则：

- 不会在 HTML 里注入 Umami 的 `<script>`；
- 不会注册客户端埋点模块，**浏览器不会发任何 Umami 请求**。

因此：**没配 ID = 统计完全关闭**，适合本地开发或暂不接统计的环境。

---

## 3. 详细使用步骤（从零到上线）

### 3.1 第一步：在 Umami 里创建网站并拿到两个信息

1. 登录 Umami（官方云 [umami.is](https://umami.is/) 或你自己的实例）。
2. 在后台 **添加网站 / Add website**，填写你的网站展示名称、实际访问域名（例如文档站 `https://liqinglian01.github.io` 或带路径的文档根 URL，按 Umami 提示填写即可）。
3. 保存后进入该网站的 **跟踪代码 / Tracking code**（或「设置 / Settings」里查看脚本），记下：
   - **Website ID**（`data-website-id` 的值）→ 对应本项目的 **`websiteId`**；
   - **脚本地址**（`script` 的 `src`）→ 对应本项目的 **`src`**（官方默认多为 `https://umami.is/script.js`；自建实例则是 `https://你的域名/script.js`）。

> **注意**：`websiteId` 会出现在打包后的静态 HTML 里（和官方嵌入方式一样），一般不作为密钥；若团队有合规要求，仍可用环境变量注入，避免写进 Git 历史。

### 3.2 第二步：在本仓库里配置插件

配置文件：**`docusaurus.config.js`**。

文件顶部需能通过 **`require.resolve`** 引用本地插件（本仓库已包含）：

```js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
```

在 **`plugins`** 数组里，本插件应类似下面一段（具体以你仓库为准，顺序可与其它插件并列）：

```js
[
  require.resolve("./plugins/docusaurus-plugin-umami-analytics"),
  {
    websiteId: process.env.UMAMI_WEBSITE_ID ?? "",
    src: "https://umami.is/script.js",
    enableScroll: true,
    enableCopy: true,
    enableToc: true,
    enableSearch: true,
    enableReadComplete: true,
  },
],
```

你需要改动的通常只有：

| 字段 | 说明 |
|------|------|
| `websiteId` | 用上一步复制的 Website ID；或继续用 `process.env.UMAMI_WEBSITE_ID ?? ""` 从环境变量读。 |
| `src` | 若用自建 Umami，改成你实例上的 `script.js` 完整 URL。 |

**临时关闭统计**：把 `websiteId` 设为 `""` 或不设置环境变量（保持 `?? ""`），重新构建/启动即可，无需删插件代码。

### 3.3 第三步：注入 Website ID 的几种实用方式

#### 方式 A：环境变量（推荐，适合 CI 与团队协作）

`docusaurus.config.js` 在 **Node 里执行**，能直接读 **`process.env.UMAMI_WEBSITE_ID`**。常见做法有三种（任选其一即可）。

**A1. 本机一次性（当前终端有效，不依赖任何文件）**

```powershell
# Windows PowerShell
$env:UMAMI_WEBSITE_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
npm run start:no-watch
# 或
npm run build
```

```bash
# Linux / macOS
export UMAMI_WEBSITE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
npm run start:no-watch
npm run build
```

关闭终端后变量失效，适合临时调试。

**A2. 本机持久：用 `.env` + dotenv（与官方文档一致）**

[Docusaurus 文档](https://docusaurus.io/docs/deployment#using-environment-variables) 建议在配置里使用 [dotenv](https://www.npmjs.com/package/dotenv) 加载根目录下的环境文件，例如：

1. 安装：`npm install dotenv --save-dev`
2. 在 **`docusaurus.config.js` 最顶部**（其它 `import` 之前）增加一行：  
   `import "dotenv/config";`  
   或指向指定文件：  
   `import dotenv from "dotenv"; dotenv.config({ path: ".env.local" });`
3. 在项目根目录新建 **`.env.local`**（本仓库 `.gitignore` 已忽略类似文件，勿提交真实 ID）：

```env
UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

之后在本目录执行 `npm start` / `npm run build` 即可读到变量。

> 若团队不用 dotenv，可继续只用 **A1** 或 **A3**（CI 注入），不必改配置文件。

**A3. CI / 托管平台**

在构建命令所在步骤设置环境变量（见下文 **方式 C**），与是否安装 dotenv 无关；只要 **`npm run build` 执行时** `process.env` 里已有 `UMAMI_WEBSITE_ID` 即可。

#### 方式 B：直接写在 `docusaurus.config.js`

将 `websiteId` 改为字符串（仅建议内部项目或 ID 可公开时）：

```js
websiteId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
```

改完后无需环境变量即可构建。**缺点**：容易误提交到 Git；换环境要改文件。

#### 方式 C：GitHub Actions（或其它 CI）

1. 在仓库 **Settings → Secrets and variables → Actions** 中新增 Secret，例如 **`UMAMI_WEBSITE_ID`**。
2. 在工作流里构建步骤中注入环境变量：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
      # 后续再接 upload-pages-artifact / deploy 等
```

要点：**必须在执行 `npm run build` 的那一步带上 `env`**，否则静态产物里不会有脚本，`websiteId` 仍为空。

#### 方式 D：自建 Umami 时同时改 `src`

```js
src: "https://analytics.your-company.com/script.js",
```

`websiteId` 仍用该实例里为该「网站」生成的 ID。

### 3.4 第四步：构建与部署

1. 确认本机或 CI 已设置 **`UMAMI_WEBSITE_ID`**（或配置里写死了 ID）。
2. 执行 **`npm run build`**，将生成的 **`build/`** 目录按现有流程部署（如 GitHub Pages、Nginx、OSS 等）。
3. 用户访问的是**已部署的线上地址**；Umami 里看到的域名、路径需与真实访问一致，便于和 **Pages** 报表对照。

多语言站点（如本仓库 `zh-Hans` / `en`）在路径上会带语言前缀（例如 `/en/rdk_doc_filter/...`），`pageview` 的 `path` 为浏览器 **`location.pathname`**，与地址栏一致，在 Umami 里可按路径筛选英文/中文流量。

---

## 4. 功能开关（可选）

均在插件第二项参数中配置，**构建时**写入内联脚本，改完后需重新 `build` / 重启 dev：

| 选项 | 默认 | 含义 |
|------|------|------|
| `enableScroll` | `true` | 阅读深度 `scroll_depth` |
| `enableReadComplete` | `true` | 阅读完成 `read_complete` |
| `enableToc` | `true` | 目录点击 `toc_click` |
| `enableSearch` | `true` | 搜索回车 `search` |
| `enableCopy` | `true` | 复制 `copy` |

关闭某项时设为 `false` 即可；**`pageview`** 仍会随路由上报（只要 `websiteId` 非空且脚本加载成功）。

---

## 5. 事件一览（Umami Events）

在 Umami 后台进入对应网站，查看 **Events**（或等价入口）。本插件上报的事件名与载荷如下：

| 事件名 | 说明 | 载荷（properties） |
|--------|------|---------------------|
| `pageview` | 每次客户端路由变化（含首屏） | `path`：当前 `location.pathname` |
| `scroll_depth` | 页面内首次达到 25/50/75/100% 深度 | `percent`：里程碑数值（25、50、75、100） |
| `read_complete` | 可滚动区域内滚动超过约 90% 时触发一次 | 无额外字段 |
| `toc_click` | 点击右侧/文档内 TOC 链接 | `text`、`href` |
| `search` | 在 `input[type="search"]` 上按 **Enter** | `keyword`：输入框当前值 |
| `copy` | 文档内触发复制 | 无额外字段 |

说明：

- **搜索**：与 `@easyops-cn/docusaurus-search-local` 等使用原生 `type="search"` 的场景兼容；若主题改用普通文本框，需改 `client/index.js` 里的选择器。
- **目录**：选择器为 **`.table-of-contents__link`**（Docusaurus 默认 TOC）。

---

## 6. 在 Umami 里怎么用这些数据

1. **Events**：按事件名筛选，查看 `scroll_depth` 的 `percent` 分布、搜索词、`toc_click` 等。
2. **Pages / 实时**：结合默认页面统计，看哪些文档访问多、当前在线阅读路径。
3. **过滤**：例如仅 `event = scroll_depth`，分析深度分布。

界面菜单名称以 Umami 版本（云版 / 自建）为准。

---

## 7. 验证与调试（建议按清单做一遍）

### 7.1 开发模式快速看脚本是否挂上

1. 设置好 `UMAMI_WEBSITE_ID` 后执行 **`npm run start:no-watch`**（或你常用的 `npm start`）。
2. 浏览器打开任意文档页 → **右键「查看网页源代码」**（不是 DevTools Elements）。
3. 在 HTML **`<head>`** 中查找：
   - 一段内联脚本含 **`__UMAMI_DOCUSAURUS__`**（开关 JSON）；
   - 紧跟其后的 **`<script defer data-website-id="..." data-auto-track="false" src="...">`**。

若只有前者没有后者，或 `data-website-id` 为空，说明 **`websiteId` 在构建/启动时仍为空**，回到第 3 节检查环境变量与配置。

### 7.2 用开发者工具看请求

1. 打开 **F12 → Network**，勾选 **Preserve log**（保留日志）。
2. 过滤器输入 `script` 或你的 Umami 域名 / `umami`，确认 **`script.js`**（或你的 `src`）状态为 **200**。
3. 切换一篇文档（站内路由跳转），应看到与 Umami 收集接口相关的请求（具体路径随 Umami 版本可能为 `/api/send` 等，以实际为准）。
4. 在 Umami 后台打开 **Realtime / 实时**，应能看到当前访问与事件（可能有 1 分钟内延迟）。

### 7.3 各事件的手动触发步骤（用于确认埋点）

在已注入脚本的页面上依次操作：

| 目标事件 | 建议操作 |
|----------|----------|
| `pageview` | 从首页点进任意文档，再点侧边栏换另一篇（不整页刷新）。 |
| `scroll_depth` | 在长文档中缓慢向下滚，分别经过约 25%、50%、75%、100% 深度（极短页面可能一次满足多档里程碑）。 |
| `read_complete` | 在同一长文滚到底部附近（超过约 90%）。 |
| `toc_click` | 点击右侧目录（TOC）任意锚点链接。 |
| `search` | 聚焦顶部搜索框，输入关键词后按 **Enter**（仅点击建议项不一定走同一逻辑，以实际主题为准）。 |
| `copy` | 在正文里选中文字后 **Ctrl+C**（或右键复制）。 |

若某一类始终没有对应事件，对照第 8 节 FAQ，并确认对应 **`enable*`** 为 `true`。

### 7.4 与「未启用统计」对比

去掉环境变量或设 `websiteId: ""`，重新启动后重复 **7.1**：应 **看不到** Umami 的 `script` 标签，Network 里也无相关请求。用于确认「关闭统计」是否生效。

---

## 8. 常见问题

| 现象 | 可能原因 |
|------|----------|
| 后台没有任何数据 | `websiteId` 为空；构建/部署流水线未注入环境变量；广告拦截扩展拦截第三方脚本。 |
| 本地有、线上没有 | 线上 CI 未配置 `UMAMI_WEBSITE_ID` Secret，或 Pages 用了旧产物未重新 build。 |
| 只有 PV 没有自定义事件 | 脚本被拦截；对应 `enable*` 为 `false`；页面过短未触发滚动里程碑。 |
| 搜索无事件 | 搜索框不是 `input[type="search"]`；未按 Enter；搜索在弹层内未聚焦到该 input。 |
| SPA 重复 PV | 本插件已关 `data-auto-track` 并手动上报；若再叠一套自动 PV 可能重复。 |

---

## 9. 与其他统计的关系

本仓库 `docusaurus.config.js` 中可能仍存在其他统计脚本（如百度统计等）。Umami 与它们相互独立；是否保留多套统计由业务与合规要求决定。

---

## 10. 相关路径

- 插件目录：`plugins/docusaurus-plugin-umami-analytics/`
- 注册位置：`docusaurus.config.js` → `plugins`

修改埋点逻辑时，主要编辑 **`client/index.js`**；修改注入方式或开关注入时，编辑 **`index.js`**。
