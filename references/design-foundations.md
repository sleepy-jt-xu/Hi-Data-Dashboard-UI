# 设计基础

> 当前状态：画布、Spacing、Colors、Typography 已确认。本文件未列出的项目（如阴影、动效）没有正式规则，生成页面时保持中性克制，并在交付说明中列为待确认项。

## 1. 画布

- 设计画布 `1920 × 1080`，页面模板均按此宽度排版。
- 页面背景：常规 `#F2F3F5`；数字化门店使用 `assets/digital-store-bg.png`（见 `page-patterns.md`）。
- 容器圆角 `6px`，白底 `#FFFFFF`，无描边、无阴影。

## 2. Spacing

> 状态：已确认。

| 位置 | 间距 | 说明 |
|---|---|---|
| 页边距 | `32px` | 页面内容区与浏览器窗口四周的距离 |
| 页面内容容器之间 | `16px` | 标题栏、筛选区、指标区、图表区等容器之间，横向与纵向一致 |
| 指标卡之间 | `12px` / `16px` | 同一容器内的指标卡用 `12px`；指标卡作为独立容器平铺时用 `16px` |
| 下拉筛选之间 | `12px` | 同一筛选区内相邻下拉框的横向距离 |
| 容器内边距 | `20px` | 筛选区、指标区、图表区等白色容器内容与容器边缘的距离 |
| 标题栏高度 | `50px` | 页面标题栏高度，标题与右侧操作图标垂直居中 |

## 3. Colors

> 状态：色值与英文命名已确认。具体业务语义和使用边界待后续确认。

### Scale convention

- Level `1–5`：light tones。
- Level `6`：base tone。`primary-6` 是当前主色 `#00AAA6`。
- Level `7–10`：dark tones。
- 页面、组件和图表中的具体语义映射尚未确认。除主色外，不应仅根据颜色名称推断用途。

### Primary

| primary-1 | primary-2 | primary-3 | primary-4 | primary-5 | primary-6 | primary-7 | primary-8 | primary-9 | primary-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#E8FFFB` | `#ADEEE4` | `#79DDD1` | `#4ACCC1` | `#22BBB3` | `#00AAA6` | `#009093` | `#00757B` | `#005C64` | `#00444D` |

### Orange

| orange-1 | orange-2 | orange-3 | orange-4 | orange-5 | orange-6 | orange-7 | orange-8 | orange-9 | orange-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#FFF7E8` | `#FFE4BA` | `#FFCF8B` | `#FFB65D` | `#FF9A2E` | `#FF7D00` | `#D25F00` | `#A64500` | `#792E00` | `#4D1B00` |

### Red

| red-1 | red-2 | red-3 | red-4 | red-5 | red-6 | red-7 | red-8 | red-9 | red-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#FFECE8` | `#FDCDC5` | `#FBACA3` | `#F98981` | `#F76560` | `#F53F3F` | `#CB272D` | `#A1151E` | `#770813` | `#4D000A` |

### Gold

| gold-1 | gold-2 | gold-3 | gold-4 | gold-5 | gold-6 | gold-7 | gold-8 | gold-9 | gold-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#FFFCE8` | `#FDF4BF` | `#FCE996` | `#FADC6D` | `#F9CC45` | `#F7BA1E` | `#CC9213` | `#A26D0A` | `#774B04` | `#4D2D00` |

### Green

| green-1 | green-2 | green-3 | green-4 | green-5 | green-6 | green-7 | green-8 | green-9 | green-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#E8FFEA` | `#AFF0B5` | `#7BE188` | `#4CD263` | `#23C343` | `#00B42A` | `#009A29` | `#008026` | `#006622` | `#004D1C` |

### Blue

| blue-1 | blue-2 | blue-3 | blue-4 | blue-5 | blue-6 | blue-7 | blue-8 | blue-9 | blue-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#E8F7FF` | `#C3E7FE` | `#9FD4FD` | `#7BC0FC` | `#57A9FB` | `#3491FA` | `#206CCF` | `#114BA3` | `#063078` | `#001A4D` |

### Purple

| purple-1 | purple-2 | purple-3 | purple-4 | purple-5 | purple-6 | purple-7 | purple-8 | purple-9 | purple-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#F5E8FF` | `#DDBEF6` | `#C396ED` | `#A871E3` | `#8D4EDA` | `#722ED1` | `#551DB0` | `#3C108F` | `#27066E` | `#16004D` |

### Fuchsia

> “Pink Purple” 优化为更简洁的英文名称 “Fuchsia”。

| fuchsia-1 | fuchsia-2 | fuchsia-3 | fuchsia-4 | fuchsia-5 | fuchsia-6 | fuchsia-7 | fuchsia-8 | fuchsia-9 | fuchsia-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#FFE8FB` | `#F7BAEF` | `#F08EE6` | `#E865DF` | `#E13EDB` | `#D91AD9` | `#B010B6` | `#8A0993` | `#650370` | `#42004D` |

### Magenta

| magenta-1 | magenta-2 | magenta-3 | magenta-4 | magenta-5 | magenta-6 | magenta-7 | magenta-8 | magenta-9 | magenta-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#FFE8F1` | `#FDC2DB` | `#FB9DC7` | `#F979B7` | `#F754A8` | `#F5319D` | `#CB1E83` | `#A11069` | `#77064F` | `#4D0034` |

### Gray

| gray-1 | gray-2 | gray-3 | gray-4 | gray-5 | gray-6 | gray-7 | gray-8 | gray-9 | gray-10 |
|---|---|---|---|---|---|---|---|---|---|
| `#F7F8FA` | `#F2F3F5` | `#E5E6EB` | `#C9CDD4` | `#A9AEB8` | `#86909C` | `#6B7785` | `#4E5969` | `#272E3B` | `#1D2129` |

### Confirmed constraints

- 规范和展示页仅显示英文色板名称及英文 Token。
- 色板按系列横向排列，并按 `1 → 10` 从浅到深展示。
- 交互页面点击任意色块可复制其 HEX 色值。
- 色值必须使用六位大写 HEX。
- 颜色不能成为区分状态、系列或操作的唯一方式。

### Source

- Primary：用户提供的图 1。
- Supporting palettes：用户提供的图 2；色值使用与图片一致的 Arco Design 0.4.0 标准亮色色板进行字符核对。

## 4. Typography

> 状态：字体、字号、字重和常用场景已确认。

### Font families

- 中文：阿里巴巴普惠体
- English：Inter
- 主数据：DIN PRO，仅用于核心数值和主要数据展示
- 英文、中文和主数据字体都使用本机已安装字体，不随页面打包；未安装时回退为系统字体（macOS 苹方 / San Francisco、Windows 微软雅黑 / Segoe UI），**字重必须保持对应**。
- 生成页面必须按字重分别声明字体，不得只写字体名（如 `"Alibaba PuHuiTi"`、`Inter`）：只写字体名时，若用户只装了某一个字重（如 Bold），所有文字都会显示成该字重。按字重声明后，缺少的字重会回退到系统字体的同一字重。
- 英文和数字的字体优先级：Inter → 阿里巴巴普惠体 → 系统字体。电脑没装 Inter 但装了普惠体时，英文和数字使用普惠体；两者都没装才使用系统字体。主数据数字：D-DIN-PRO Bold → Inter → 普惠体 → 系统字体。

生成页面中固定使用以下字体声明和字体顺序：

```css
/* English: Inter, one face per weight. */
@font-face {
  font-family: "Report Inter";
  font-weight: 400;
  src: local("Inter-Regular"), local("Inter Regular");
}

@font-face {
  font-family: "Report Inter";
  font-weight: 500;
  src: local("Inter-Medium"), local("Inter Medium");
}

@font-face {
  font-family: "Report Inter";
  font-weight: 700;
  src: local("Inter-Bold"), local("Inter Bold");
}

/* Chinese: Alibaba PuHuiTi, one face per weight (1.0 and 2.0 names). Also covers Latin and digits when Inter is missing. */
@font-face {
  font-family: "Report CN";
  font-weight: 400;
  src: local("AlibabaPuHuiTi-Regular"), local("Alibaba PuHuiTi Regular"),
    local("AlibabaPuHuiTi_2_55_Regular"), local("Alibaba PuHuiTi 2 55 Regular");
}

@font-face {
  font-family: "Report CN";
  font-weight: 500;
  src: local("AlibabaPuHuiTi-Medium"), local("Alibaba PuHuiTi Medium"),
    local("AlibabaPuHuiTi_2_65_Medium"), local("Alibaba PuHuiTi 2 65 Medium");
}

@font-face {
  font-family: "Report CN";
  font-weight: 700;
  src: local("AlibabaPuHuiTi-Bold"), local("Alibaba PuHuiTi Bold"),
    local("AlibabaPuHuiTi_2_85_Bold"), local("Alibaba PuHuiTi 2 85 Bold");
}

/* Primary data: D-DIN-PRO Bold only. */
@font-face {
  font-family: "Report Data";
  font-weight: 700;
  src: local("D-DIN-PRO-Bold"), local("D-DIN-PRO Bold");
}

/* 界面文字 */
font-family: "Report Inter", "Report CN", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
/* 主数据（DIN PRO Bold） */
font-family: "Report Data", "Report Inter", "Report CN", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
font-weight: 700;
```

### Font weights

- Regular：`400`
- Medium：`500`
- Bold：`700`

只使用以上三档界面文字字重。DIN PRO 主数据只允许使用 Bold `700`。不得通过浏览器合成不存在的中间字重。

### Type scale

相同字号和字重只保留一行；同一组合覆盖的组件场景合并记录在 Type 与 Usage 中。

| 字号 | 字重 | 类型 | 使用场景 |
|---|---|---|---|
| 24px | Bold | Page Title | 页面标题。用于定义整个报表页面，一个页面通常只使用一次。 |
| 20px | Bold | H1 | 一级标题。用于主要内容分区和一级分析模块。 |
| 16px | Medium | H2 | 二级标题。用于卡片、图表、表格或次级模块标题。 |
| 14px | Medium | Label / Filter / Table Header / Button | 表单与筛选标签、页签、表头和按钮。组件层级通过容器、颜色和交互状态区分，不改变字重。 |
| 14px | Regular | Body / Paragraph / Input / Link | 默认正文、连续说明、表格单元格、输入内容和文字链接。段落使用更宽松行高；链接必须具有可识别的交互反馈。 |
| 12px | Regular | Supporting Text / Data Label | 辅助说明、时间戳、单位、图例、坐标轴和紧凑型数据标签。不得承载关键结论或必须操作的信息。 |

### Preview text

- 中文：滚滚长江东逝水
- English：Lorem Ipsum

所有字号与字重组合使用同一示例文本，以便直接比较视觉层级。

### Primary Data Type Scale

主数据统一使用 DIN PRO，只使用 Bold `700`。示例数字为 `1,286,420`。在 Typography 页中通过中文 / English / Data 标签切换查看。

| 字号 | 字重 | 类型 | 使用场景 |
|---|---|---|---|
| 32px | Bold | Primary Data XL | 总览页首要指标或需要最高视觉优先级的单一核心数值。 |
| 28px | Bold | Primary Data L | 标准 KPI 卡和页面主要指标。 |
| 24px | Bold | Primary Data M | 常规指标卡主数据和模块级核心数值。 |
| 20px | Bold | Primary Data S | 紧凑型指标、卡片次级数据和需要强调的表格汇总值。 |
| 16px | Bold | Primary Data XS | 二级指标列表（横向）中的指标数值。 |

- DIN PRO 不用于标题、正文、标签、筛选项或状态说明。
- 主数据周围的单位、同比、环比和辅助说明继续使用通用文字字体。
- 同一区域中的主数据应保持同一字号；只有信息层级明确不同时才允许混用两个字号。

### Line height

- Primary Data XS：`24px`
- Primary Data S：`28px`
- Primary Data M：`32px`
- Primary Data L：`36px`
- Primary Data XL：`40px`
- Page Title：`32px`
- H1：`28px`
- H2：`24px`
- `14px / Medium`：`22px`
- `14px / Regular`：默认 `22px`；连续段落使用 `24px`
- `12px / Regular`：`18px`

### Text Colors

| text-primary | text-secondary | text-tertiary | text-placeholder | text-link |
|---|---|---|---|---|
| `#1D2129` | `#4E5969` | `#86909C` | `#C9CDD4` | `#00AAA6` |
| 强调信息、正文、标题 | 次强调信息、正文、标题 | 次要信息 | 置灰信息、占位内容 | 链接与可点击文字 |

### Status Text Colors

| text-danger | text-warning | text-success | text-processing |
|---|---|---|---|
| `#F83A3A` | `#FF7D00` | `#52C41A` | `#3491FA` |
| 错误、失败 | 警示、提醒 | 良好、成功 | 进行中、等待中 |

状态文字使用独立语义 Token。`text-danger` 和 `text-success` 不覆盖基础色板中的 `red-6` 与 `green-6`，避免同名 Token 对应不同色值。

### Text color constraints

- 文字色必须按信息层级和语义选择，不得只按视觉偏好选择。
- `text-placeholder` 只用于占位或明确的置灰信息，不承载正文和关键操作。
- `text-link` 需要配合下划线、悬浮、焦点或其他交互反馈，不能只靠颜色表示可点击。
- 状态文字除颜色外，还应配合明确文案、图标或状态标签。
- 交互规范页中的所有文字色块均可点击复制 HEX。

### Usage constraints

- 标题表达内容层级，不得仅为获得更大字号而跳级使用。
- 页面默认正文为 `14px / Regular`；不要在同一密度层级混用多个正文字号。
- Page Title 只用于整个报表页面的标题，一个页面通常只使用一次。
- Primary Data 只用于需要快速扫描的核心数值，不用于标题或普通表格数据。
- Supporting Text 不承载关键结论、错误原因或必须操作的信息。
- 长段落控制行宽，建议每行中文约 35–45 个字符；段落之间应有清晰间距。
- 数字、英文缩写和代码式标识优先由 Inter 显示，并启用等高数字特性（字体支持时）。

