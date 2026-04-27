# RDK DOC

[English](./README_EN.md) | 简体中文

基于 Docusaurus 的 RDK 多语言文档网站，支持多维度内容过滤（版本 × 产品）。

## 特性

- 📝 **多语言支持**：中文（zh-Hans）和英文（en）双语切换
- 🔧 **多维度过滤**：根据版本和产品动态显示对应内容
- 📄 **双文档集**：支持主文档（docs）和 S 系列文档（docs_s）
- 🔍 **本地搜索**：集成本地搜索功能，支持中英文搜索
- 📊 **Mermaid 图表**：支持 Mermaid 流程图和图表
- 💬 **Giscus 评论**：集成 Giscus 评论系统
- 👀 **文件监听**：开发时自动监听文件变化并更新配置
- 🚀 **GitHub Pages**：支持 GitHub Pages 部署

## 快速开始

### 环境要求

- Node.js >= 18.0

### 安装依赖

```bash
npm install
```

### 开发模式

启动中文文档（带文件监听）：
```bash
npm run start
```
访问链接：http://localhost:3000/rdk_doc_filter/

启动英文文档（带文件监听）：
```bash
npm run start:en
```
访问链接：http://localhost:3000/rdk_doc_filter/en/

启动中文文档（不带文件监听）：
```bash
npm run start:no-watch
```
访问链接：http://localhost:3000/rdk_doc_filter/

启动英文文档（不带文件监听）：
```bash
npm run start:no-watch:en
```
访问链接：http://localhost:3000/rdk_doc_filter/en/

启动指定端口：
```bash
npm run start:port
```
访问链接：http://localhost:3001/rdk_doc_filter/

## 构建与部署

### 构建生产版本

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run serve
```

访问链接：
- 中文文档：http://localhost:3000/rdk_doc_filter/
- 英文文档：http://localhost:3000/rdk_doc_filter/en/

### GitHub Pages 部署

```bash
npm run deploy
```

## 项目结构

```
.
├── docs/                 # 主文档目录
├── docs_s/               # S 系列文档目录
├── i18n/                 # 多语言翻译文件
├── scripts/              # 脚本文件
│   ├── generate-sidebar-config.js   # 生成侧边栏配置
│   └── watch-sidebar-config.js     # 监听文件变化
├── src/
│   ├── components/       # React 组件
│   ├── context/          # Context 状态管理
│   ├── pages/            # 页面组件
│   ├── remark/           # Remark 插件
│   └── theme/            # Docusaurus 主题组件
├── static/               # 静态资源
├── docusaurus.config.js  # Docusaurus 配置
├── sidebars.js           # 侧边栏配置
└── package.json
```

## 核心功能说明

### 多维度内容过滤

通过 Front Matter 配置文档在特定版本和产品下的显示：

```markdown
---
sidebar_versions: ">= 3.5.0"
sidebar_products: "RDK X5"
---
```

或在文件夹下创建 `_sidebar_scope.json` 配置：

```json
{
  "sidebar_versions": ">= 3.5.0",
  "sidebar_products": "RDK X5"
}
```

### DocScope 组件

在文档中使用 `:::doc_scope` 指令控制内容显示：

```markdown
:::doc_scope versions="3.0.0" products="RDK X3"
此内容仅在 RDK X3 3.0.0 版本下显示
:::
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run generate-sidebar-config` | 手动生成侧边栏配置 |
| `npm run clear` | 清除 Docusaurus 缓存 |
| `npm run swizzle` | 自定义主题组件 |
| `npm run write-translations` | 提取翻译内容 |

## 技术栈

- **Docusaurus**: 3.7.0
- **React**: 18.x
- **Remark**: Markdown 解析插件
- **Rehype**: HTML 处理插件
- **Mermaid**: 图表渲染
- **Giscus**: 评论系统

