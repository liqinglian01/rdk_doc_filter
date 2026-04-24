/**
 * 门户首页卡片唯一数据源。
 *
 * 子站的 baseUrl / 部署域名变化时，只改这里。
 *
 * 分组 id 与 UI 区块一一对应（顺序即首页上从上到下的顺序）：
 *   products | system-software | robot-app | model-zoo | examples | accessories | software | toolchain
 */

export const groups = [
  {
    id: "products",
    anchor: "products",
    title: "RDK 用户手册",
    subtitle: "Hardware / 系统烧录 / 配件清单 / 下载资源 / 附录 / FAQ",
    accent: "#2e8555",
  },
  {
    id: "system-software",
    anchor: "system-software",
    title: "SDK 用户手册",
    subtitle: "SDK 开发 / 部署 / 模型转换",
    accent: "#1f6feb",
  },
  {
    id: "robot-app",
    anchor: "robot-app",
    title: "机器人应用",
    subtitle: "TROS · 各平台同步发版",
    accent: "#9333ea",
  },
  {
    id: "model-zoo",
    anchor: "model-zoo",
    title: "算法应用 · Model Zoo",
    subtitle: "官方模型仓库入口（外链）",
    accent: "#f97316",
  },
  {
    id: "examples",
    anchor: "examples",
    title: "应用开发示例",
    subtitle: "覆盖 X3 / X5 / S100 / S600",
    accent: "#0ea5e9",
  },
  {
    id: "accessories",
    anchor: "accessories",
    title: "配件",
    subtitle: "IMU / Stereo Camera 系列",
    accent: "#14b8a6",
  },
  {
    id: "software",
    anchor: "software",
    title: "软件",
    subtitle: "开发 / 烧录工具",
    accent: "#db2777",
  },
  {
    id: "toolchain",
    anchor: "toolchain",
    title: "算法工具链",
    subtitle: "模型转换 / 量化 / 部署",
    accent: "#dc2626",
  },
];

/**
 * 每个卡片的字段说明：
 *  - id            稳定标识，与 sites.config.json 对齐
 *  - group         所属分组 id（必须与 groups 中某个 id 一致）
 *  - title         卡片标题
 *  - description   一句话介绍
 *  - href          跳转地址（相对路径使用反向代理 / 子路径部署；也可填写完整 URL）
 *  - tags          可选，卡片右上角的小标签数组
 *  - external      可选，true 时标记为外部链接
 */
export const sites = [
  // ---------- 产品 ----------
  { id: "product-rdk-manual", group: "products", title: "RDK X3/X5用户手册", description: "RDK X3/X5 文档", href: "/rdk_doc_filter/Quick_start", tags: ["用户手册"] },
  { id: "product-rdk-manual", group: "products", title: "RDK S100/S600用户手册", description: "RDK S100/S600 文档", href: "/rdk_doc_filter/rdk_s/Quick_start", tags: ["用户手册"] },
  
  // ---------- 系统软件 ----------
  { id: "system-software-sdk", group: "system-software", title: "SDK", description: "系统软件 SDK 文档入口。", href: "/system-software/sdk", tags: ["系统软件"] },
 

  // ---------- 机器人应用 ----------
  { id: "tros", group: "robot-app", title: "TROS", description: "面向机器人应用开发的统一框架，各平台同步发版。", href: "/tros/", tags: ["多平台"] },

  // ---------- Model Zoo ----------
 
  { id: "model-zoo-hub",   group: "model-zoo", title: "Model Zoo X3/X5",  description: "Model Zoo 子站（链接聚合页）。",          href: "/model-zoo/" },
  { id: "model-zoo-hub",   group: "model-zoo", title: "Model Zoo S100/S600",  description: "Model Zoo 子站（链接聚合页）。",          href: "/model-zoo/" },


  // ---------- 示例 ----------
  { id: "examples", group: "examples", title: "应用开发示例", description: "X3 / X5 / S100 / S600 示例集合（同一仓库内分 sidebar）。", href: "/examples/" },

  // ---------- 配件 ----------
  { id: "accessories", group: "accessories", title: "配件文档", description: "RDK IMU Module / Stereo Camera Module / GS130W / GS130WI。", href: "/accessories/" },

  // ---------- 软件 ----------
  { id: "software-rdk-studio", group: "software", title: "RDK Studio", description: "官方集成开发工具。", href: "/software/rdk-studio/" },
  { id: "software-xburn",      group: "software", title: "Xburn",      description: "系统烧录工具。",    href: "/software/xburn/" },

  // ---------- 算法工具链 ----------
  { id: "algorithm-toolchain", group: "toolchain", title: "算法工具链", description: "模型转换 / 量化 / 精度调优 / 部署。", href: "/algorithm-toolchain/" },
];

export function sitesByGroup() {
  const grouped = {};
  for (const g of groups) grouped[g.id] = [];
  for (const s of sites) {
    if (!grouped[s.group]) grouped[s.group] = [];
    grouped[s.group].push(s);
  }
  return grouped;
}
