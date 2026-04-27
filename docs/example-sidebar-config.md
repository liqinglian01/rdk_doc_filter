---
sidebar_position: 1
sidebar_versions: ">= 3.5.0"
sidebar_products: RDK X5
title: 示例文档 - RDK X5 3.5.0 及以上版本显示
---

# 示例文档

这是一个示例文档，演示如何通过 Front Matter 控制侧边栏显示。

## 使用方法

### 方式1：控制单个文档

在 Markdown 文件的顶部添加 Front Matter 字段：

```markdown
---
sidebar_versions: 3.5.0,3.0.0
sidebar_products: RDK X5,RDK X3
title: 文档标题
---

# 文档内容
```

或使用版本范围表达式：

```markdown
---
sidebar_versions: ">= 3.0.0"
sidebar_products: RDK X5
title: 文档标题
---

# 文档内容
```

### 方式2：控制整个文件夹

在文件夹中创建 `_sidebar_scope.json` 文件：

```json
{
  "versions": [">= 3.5.0"],
  "products": ["RDK X5"]
}
```

或使用字符串格式：

```json
{
  "versions": ">= 3.5.0,3.0.0",
  "products": "RDK X5,RDK X3"
}
```

**注意**：不要在 `_category_.json` 中添加 `sidebar_versions` 和 `sidebar_products` 字段，Docusaurus 不支持自定义字段。请使用单独的 `_sidebar_scope.json` 文件。

## 字段说明

### versions 字段

指定该文档/文件夹在哪些版本下显示，支持以下格式：

**1. 精确版本匹配**
- `"3.5.0"` - 仅在 3.5.0 版本下显示
- `"3.5.0,3.0.0"` - 在 3.5.0 和 3.0.0 版本下显示

**2. 版本范围表达式**
- `">= 3.0.0"` - 在 3.0.0 及以上版本显示（包括 3.0.0）
- `"> 3.0.0"` - 在 3.0.0 以上版本显示（不包括 3.0.0）
- `"<= 3.5.0"` - 在 3.5.0 及以下版本显示（包括 3.5.0）
- `"< 3.5.0"` - 在 3.5.0 以下版本显示（不包括 3.5.0）

**3. 混合使用**
- `">= 3.0.0, 3.5.0"` - 在 3.0.0 及以上版本，或精确匹配 3.5.0 版本时显示

### products 字段

指定该文档/文件夹在哪些产品下显示，使用数组或逗号分隔的字符串：
- 示例：`"products": ["RDK X5"]`
- 示例：`"products": "RDK X5,RDK X3"`
- 不设置表示所有产品都显示

## 重要说明

### 路径转换规则

配置文件中的路径会自动转换为 Docusaurus 的 docId 格式：

1. **转换为小写**
2. **去除数字前缀**（如 `01_Quick_start` 变成 `quick_start`）

例如：
- 文件路径：`docs/01_Quick_start/hardware_introduction/rdk_ultra.md`
- 配置中的 docId：`quick_start/hardware_introduction/rdk_ultra`

### 优先级规则

1. **文档级别配置优先级最高**：如果文档的 Front Matter 中有配置，则使用文档级别的配置
2. **文件夹级别配置次之**：如果文档没有配置，但所属文件夹的 `_sidebar_scope.json` 中有配置，则使用文件夹级别的配置
3. **默认显示**：如果都没有配置，则文档在所有版本和产品下显示

### 自动生成配置

配置文件会在每次运行 `npm start` 或 `npm run build` 时自动生成，无需手动维护。

## 示例

### 示例1：版本范围表达式（推荐）

```markdown
---
sidebar_versions: ">= 3.0.0"
sidebar_products: RDK X3
title: RDK X3 3.0.0 及以上版本文档
---

# RDK X3 文档

这个文档会在 RDK X3 产品的 3.0.0 及以上版本显示。
```

### 示例2：精确版本匹配

```markdown
---
sidebar_versions: 3.5.0
sidebar_products: RDK X5
title: RDK X5 专属文档
---

# RDK X5 专属文档

这个文档只会在选择 RDK X5 产品且版本为 3.5.0 时显示在侧边栏中。
```

### 示例3：控制整个文件夹的显示

**文件结构：**
```
docs/
└── 01_Quick_start/
    └── hardware_introduction/
        ├── _category_.json
        ├── _sidebar_scope.json
        ├── rdk_x3.md
        ├── rdk_x5.md
        └── rdk_ultra.md
```

**_sidebar_scope.json：**
```json
{
  "versions": [">= 3.0.0"],
  "products": ["RDK X3"]
}
```

这样整个 `hardware_introduction` 文件夹下的所有文档都只会在 RDK X3 的 3.0.0 及以上版本下显示。

### 示例4：文件夹和文档级别混合配置

**文件结构：**
```
docs/
└── 01_Quick_start/
    └── hardware_introduction/
        ├── _category_.json
        ├── _sidebar_scope.json
        ├── rdk_x3.md
        └── rdk_x5.md (带 Front Matter 配置)
```

**_sidebar_scope.json（文件夹级别）：**
```json
{
  "versions": [">= 3.0.0"],
  "products": ["RDK X3"]
}
```

**rdk_x5.md（文档级别，优先级更高）：**
```markdown
---
sidebar_versions: ">= 3.5.0"
sidebar_products: RDK X5
---

# RDK X5 硬件简介
```

结果：
- `rdk_x3.md`：使用文件夹级别配置，在 RDK X3 3.0.0 及以上版本显示
- `rdk_x5.md`：使用文档级别配置，在 RDK X5 3.5.0 及以上版本显示

### 示例5：在多个版本和产品下显示

```markdown
---
sidebar_versions: 3.5.0,3.0.0
sidebar_products: RDK X5,RDK X3
title: 通用文档
---

# 通用文档

这个文档会在 RDK X5 和 RDK X3 产品下，以及 3.5.0 和 3.0.0 版本下显示。
```

### 示例6：只限制产品，不限制版本

```markdown
---
sidebar_products: RDK X5
title: RDK X5 全版本文档
---

# RDK X5 全版本文档

这个文档只会在选择 RDK X5 产品时显示，但不限制版本。
```

### 示例7：只限制版本，不限制产品

```markdown
---
sidebar_versions: ">= 3.5.0"
title: 3.5.0 及以上版本全产品文档
---

# 3.5.0 及以上版本全产品文档

这个文档只会在选择 3.5.0 及以上版本时显示，但不限制产品。
```

### 示例8：不设置任何限制（默认显示）

```markdown
---
title: 通用文档
---

# 通用文档

这个文档会在所有版本和所有产品下显示。
```

### 示例9：版本范围组合

```markdown
---
sidebar_versions: ">= 3.0.0, < 4.0.0"
sidebar_products: RDK X3
title: RDK X3 3.x 版本文档
---

# RDK X3 3.x 文档

这个文档会在 RDK X3 产品的 3.0.0 到 3.x.x 版本之间显示（不包括 4.0.0）。
```
