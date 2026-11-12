# 报表组件模式

> 当前状态：以下组件均已确认，可直接使用。本文件未列出的组件（如 Tooltip 以外的弹层、分页）没有正式规范，需要时保持中性克制并在交付说明中列为待确认项。

## Filters & Navigation

> 状态：Dropdown、Filter Tag 和 Tabs 的结构及 Default / Hover / Active 样式已确认。尺寸为依据参考截图建立的当前实现基线，后续可根据更精确标注调整。

### Shared visual baseline

- 字体：`14px / Regular`；标签和当前项使用 `14px / Medium`。
- 控件高度：`32px`（Dropdown Trigger 与 Filter Tag 容器统一）。
- 控件圆角：`6px`。
- 控件背景：`#FFFFFF`。
- 默认文字：`text-secondary`（`#4E5969`）。
- 占位文字与下拉箭头：`text-placeholder`（`#C9CDD4`）。
- Hover：Dropdown Trigger 保持白色背景并使用 `primary-6 #00AAA6` 描边；菜单选项使用 `#F7F8FA` 背景。
- Active 强调：`primary-6`（`#00AAA6`）。
- 当前仅定义 Default、Hover、Active。不得自行增加其他视觉状态。
- 下拉箭头使用图标库 `chevron-down`（级联子级用 `chevron-right`），24px 画布按 28px 渲染；默认 `#C9CDD4`，展开时 `#00AAA6` 并旋转 180°。

### Dropdown

#### Trigger states

| 状态 | 背景 | 文字颜色 | 边框 | 圆角 | 文字规范 |
|---|---|---|---|---|---|
| Default | `#FFFFFF` | `text-secondary #4E5969` | `gray-3 #E5E6EB` | `6px` | `14px / Regular` |
| Hover | `#FFFFFF` | `text-secondary #4E5969` | `primary-6 #00AAA6` | `6px` | `14px / Regular` |
| Active | `#FFFFFF` | `text-primary #1D2129` | `primary-6 #00AAA6` | `6px` | `14px / Regular` |

#### Trigger variants

| 变体 | 背景 | Default 边框 | Hover / Active 边框 |
|---|---|---|---|
| Outline | `#FFFFFF` | `#E5E6EB` | `primary-6 #00AAA6` |
| Filled | `#F7F8FA` | 无 | `primary-6 #00AAA6` |

- 两种变体的文字、圆角和字号一致：Default / Hover `#4E5969`，Active `#1D2129`，`6px`，`14px / Regular`。
- 同一筛选栏只使用一种变体。

#### Label layout

| 布局 | 标签位置 | 标签与控件间距 | 标签文字 |
|---|---|---|---|
| Horizontal | 控件左侧，垂直居中 | `8px` | `14px / Regular / #4E5969` |
| Vertical | 控件上方，左对齐 | `4px` | `14px / Regular / #4E5969` |

- 横向标题用于单行筛选栏；纵向标题用于字段较多或标签较长的筛选区。
- 同一筛选栏内只使用一种标题排版。
- 多选 Trigger 以 Chip 显示已选项（`12px`，`#F2F3F5` 背景，`#4E5969` 文字，`4px` 圆角），最多展示 2 个，超出部分折叠为 `+N`。横向、纵向标题和 Multi Select Menu 的反填样式一致。
- 点击 Chip 上的关闭图标可直接移除该选项。

#### Option states

| 类型 | 状态 | 背景 | 文字颜色 | Checkbox | 文字规范 |
|---|---|---|---|---|---|
| Single | Selected | `#FFFFFF` | `primary-6 #00AAA6` | — | `14px / Regular` |
| Single | Hover | `#F7F8FA` | `text-primary #1D2129` | — | `14px / Regular` |
| Single | Default | `#FFFFFF` | `text-primary #1D2129` | — | `14px / Regular` |
| Multi | Selected | `#FFFFFF` | `text-secondary #4E5969` | `#00AAA6` 填充勾选（14px，圆角 2px） | `14px / Regular` |
| Multi | Hover | `#F7F8FA` | `text-secondary #4E5969` | `#C9CDD4` 2px 描边 | `14px / Regular` |
| Multi | Default | `#FFFFFF` | `text-secondary #4E5969` | `#C9CDD4` 2px 描边 | `14px / Regular` |

#### Single Select Menu

- 菜单使用白色浮层、`6px` 圆角和轻量阴影。
- 选项高度 `40px`，水平内边距 `12px`。
- Default：白色背景，`text-primary`。
- Hover：`#F7F8FA` 背景，`text-primary`。
- Active：白色背景，`primary-6 #00AAA6` 文字，`14px / Regular`；级联菜单的当前父级额外使用 `primary-1 #E8FFFB` 背景。
- 级联菜单按层级分列，列之间使用 `gray-3 #E5E6EB` 分隔线。
- 当前父级使用 `primary-1` 背景和 Active 文字；最终选中项保持白色背景和 Active 文字。

#### Multi Select Menu

- 每项由 Checkbox 和文本组成，选项高度 `40px`。
- Default：未选 Checkbox，白色背景，`text-secondary`。
- Hover：`#F7F8FA` 背景。
- Active：Checkbox 使用 `primary-6 #00AAA6`，文字使用 `text-secondary`。
- “All” 在部分选中时显示半选符号；全部选中时显示完整勾选。
- Trigger 使用与 Label Layout 相同的 Chip 反填样式；最多展示 2 个，超出折叠为 `+N`。

### Filter Tag

- 用于在少量互斥视图、周期或统计方式之间快速切换，例如 Week / WTD。
- 多个 Tag 共用一个容器，容器高度 `32px`、四周内边距 `4px`、圆角 `6px`；Tag 高度 `24px`、Tag 间距 `4px`、左右内边距 `12px`、圆角 `4px`。
- 页面模板中的筛选栏、Stores 页签和图表指标切换均使用同一尺寸。
- 按所在背景选择变体：白色页面用「白底」，灰色区域用「灰底」。

#### 白底（容器 `#F2F3F5`）

| 状态 | 背景 | 文字颜色 | 文字规范 |
|---|---|---|---|
| Default | Transparent | `text-tertiary #86909C` | `14px / Regular` |
| Hover | Transparent | `primary-6 #00AAA6` | `14px / Regular` |
| Active | `#FFFFFF` | `primary-6 #00AAA6` | `14px / Regular` |

#### 灰底（容器 `#FFFFFF`）

| 状态 | 背景 | 文字颜色 | 文字规范 |
|---|---|---|---|
| Default | Transparent | `text-tertiary #86909C` | `14px / Regular` |
| Hover | `primary-1 #E8FFFB` | `primary-7 #009093` | `14px / Regular` |
| Active | `primary-6 #00AAA6` | `#FFFFFF` | `14px / Medium` |

- 同一组只能有一个 Active 项。
- 不用于多选；多选使用 Checkbox 或 Multi Select Menu。

### Tabs

- 用于同一页面层级内的内容视图切换，不用于提交筛选条件。
- 标签使用 `16px`，页签间距 `32px`，Active 下划线高度 `3px`。

| 状态 | 背景 | 文字颜色 | 边框 | 圆角 | 文字规范 |
|---|---|---|---|---|---|
| Default | Transparent | `text-tertiary #86909C` | Transparent | `0px` | `16px / Regular` |
| Hover | Transparent | `primary-6 #00AAA6` | Transparent | `0px` | `16px / Regular` |
| Active | Transparent | `text-primary #1D2129` | Bottom `primary-6 #00AAA6 / 3px` | `0px` | `16px / Medium` |

- 下划线宽度跟随文字内容，不铺满整个页签槽位。
- 同一页签组只能有一个 Active 项。

### Filter Bar examples

1. **Filter Tag + Dropdown（横向）**：白底 Filter Tag（WTD / MTD / YTD）+ Week、Brand 两个横向标题 Filled Dropdown。
2. **Filter Tag + Dropdown（纵向）**：Time、Week、Brand 三组纵向标题，控件底部对齐。

3. **Filter Tag + Week（组合）**：WTD / MTD / YTD 与周选择 Dropdown 共用一个 `#F2F3F5` 底条（高 `32px`、圆角 `6px`），中间用 `1px × 16px #E5E6EB` 竖线分隔；Dropdown 宽 `140px`、底色同底条，Hover / 展开时显示完整 `1px #00AAA6` 描边并隐藏分隔线。用于需要同时选择周期类型和具体周的看板。

- 筛选栏内控件间距 `16px`；控件高度统一，Filter Tag 容器与 Dropdown 同高。
- 下拉框点击展开选项浮层（距 Trigger `4px`，宽度不小于 Trigger）；选择后反填并收起；点击外部或按 Esc 收起；同一时间只展开一个。
- 同一筛选栏只使用一种 Dropdown 变体和一种标题排版。

### Usage boundaries

- Dropdown 用于从较多选项中选择；少量互斥项优先使用 Filter Tag。
- Filter Tag 改变筛选或统计方式；Tabs 切换内容视图。两者语义不能混用。
- Single Select Menu 只允许一个结果；Multi Select Menu 必须明确呈现已选结果。
- Hover 仅表示指针经过，不得改变实际筛选或页签状态。

## Radio & Checkbox

> 状态：Default / Hover / Selected 样式已确认。尺寸按参考截图估算，待设计稿标注确认。

### Radio（单选）

| 状态 | 背景 | 边框 | 圆点 |
|---|---|---|---|
| Default | `#FFFFFF` | `#C9CDD4` | — |
| Hover | `#FFFFFF` | `primary-6 #00AAA6` | — |
| Selected | `primary-6 #00AAA6` | `#00AAA6` | `#FFFFFF`，直径 `6px` |

### Checkbox（多选）

| 状态 | 背景 | 边框 | 勾选 |
|---|---|---|---|
| Default | `#FFFFFF` | `#C9CDD4` | — |
| Hover | `#FFFFFF` | `primary-6 #00AAA6` | — |
| Selected | `primary-6 #00AAA6` | `#00AAA6` | `#FFFFFF` 对勾 |

### Shared

- 尺寸 `14px`，边框 `2px`；Radio 为圆形，Checkbox 圆角 `2px`。
- Checkbox 对勾居中，线宽 `1.8px`，圆头圆角；半选为居中的圆头横线。
- Multi Select Menu 中的 Checkbox 使用同一规格。
- 文字 `14px / Regular / text-secondary #4E5969`；选中后文字颜色不变。
- 标记与文字间距 `8px`；选项横向排列，选项间距 `24px`，换行时行间距 `12px`。
- 单选用于互斥的少量选项；选项较多或需要折叠时改用 Dropdown。
- 多选用于可同时生效的筛选条件；超过 6 项时改用 Multi Select Menu。
- 必须使用原生 `radio` / `checkbox` 语义，支持键盘操作和焦点样式。

## Metric Card

> 状态：结构、背景分类、文字层级、Tooltip、Sparkline、Tag 与趋势语义已确认。

### Purpose

用于快速展示单个核心指标、历史对比和变化方向。一个卡片只承载一个主要指标，指标名称较多时可通过浅色背景进行分类。

### Anatomy

1. 指标标题，可选双语上级标题。
2. 可选说明入口，Hover 或键盘聚焦时显示 Tooltip。
3. 主数据。
4. LY、YoY 或 MoM 等比较数据。
5. 特殊变体可使用 Sparkline 和 Tag 替代比较行。

### Specifications

| 项目 | 规范 |
|---|---|
| 圆角 | `6px` |
| 高度 | 不设固定高度或最小高度，由内容自适应；同一行卡片可跟随最高卡片对齐 |
| 内边距 | `16px`，YoY / MoM 最后一行下方始终保留 `16px` |
| 描边 | 无描边 |
| 指标标题 | `14px / Medium / text-primary` |
| 双语上级标题 | `12px / Medium / text-secondary` |
| 主数据 | `DIN PRO / 28px / Bold / text-primary` |
| 比较标签 | `12px / Regular / text-tertiary` |
| 比较数值 | `12px / Regular` |
| Tooltip | `12px`，`gray-9 #272E3B` 背景，白色正文 |
| Tag | `12px / Regular`，`primary-1` 背景，`primary-7` 文字，`4px` 圆角 |

### Category backgrounds

数据分类卡片（指标较多时按分类着色）：

- Category Cyan：`#E7F4F9`
- Category Blue：`#E5EEFC`
- Category Warm：`#F7F1E8`

常规指标卡：

| 变体 | 背景 |
|---|---|
| 常规（双语）-一级指标 | `#E7F4F9` |
| 常规-二级指标 | `#F7F8FA` |
| 常规：指标区域为灰底 | `#FFFFFF` |

这些颜色是指标卡专用分类底色，不引用或映射 Color System 色阶。背景色用于指标分类，不表达成功、失败或趋势方向。同一指标分类在一个页面内保持同一背景色。所有指标卡均无描边。

### Title variants

- 单语：直接显示指标名称。
- 双语：上方使用较小的本地语言标题，下方显示主要指标名称。
- 标题过长时单行截断，并通过 Tooltip 提供完整名称。

### Comparison layout

- LY、YoY、MoM 等比较信息放在主数据下方。
- 标签左对齐，数值右对齐。
- LY 等中性比较值使用 `text-secondary`。
- YoY / MoM 的方向颜色按页面所在市场选择 General 或 US 规则，不能在同一页面混用。

### General trend semantics

| 方向 | 颜色 | 标记 |
|---|---|---|
| Increase | `text-danger #F83A3A` | `triangle-up` |
| Decrease | `text-processing #3491FA` | `triangle-down` |
| Flat | `text-tertiary #86909C` | `−` |

### US trend semantics

| 方向 | 颜色 | 标记 |
|---|---|---|
| Increase | `text-success #52C41A` | `triangle-up` |
| Decrease | `text-danger #F83A3A` | `triangle-down` |
| Flat | `text-tertiary #86909C` | `−` |

- General Increase：`text-danger #F83A3A`，使用图标库 `triangle-up`。
- General Decrease：`text-processing #3491FA`，使用图标库 `triangle-down`。
- US Increase：`text-success #52C41A`，使用图标库 `triangle-up`。
- US Decrease：`text-danger #F83A3A`，使用图标库 `triangle-down`。
- Flat：`text-tertiary #86909C`，使用 `−`。
- 说明入口使用图标库 `info-exclamation`，默认 `text-tertiary`，交互时使用 `primary-6`。
- SVG 使用 `currentColor`，颜色由所在语义状态继承。

### Sparkline and Tag

布局：标题、主数据、Tag 在左侧纵向排列；Sparkline 在右侧，与主数据和 Tag 区域对齐。

| 项目 | 规范 |
|---|---|
| 卡片背景 / 内边距 | `#FFFFFF` / `16px`（与其他指标卡一致） |
| 标题 | `16px / Medium / text-secondary` |
| 标题与主数据间距 | `8px` |
| 主数据与 Tag 间距 | `12px` |
| Tag | `14px / Regular`，`primary-1` 背景，`primary-7` 文字，`4px 12px` 内边距 |
| Sparkline | `primary-6 #00AAA6`，`3px` 线宽，下方叠加 12% 透明度柔光 |
| 左右区域间距 | `24px` |

- Sparkline 只表达近期走势，不显示坐标轴和复杂交互。
- 默认线条使用 `primary-6 #00AAA6`。
- Tag 用于显示 MoM 等紧凑摘要，不与比较行重复展示同一信息。
- Sparkline 与主数值必须来自相同指标和统计口径。

### Secondary metrics · horizontal（二级指标-横向）

多个二级指标以列表形式横向展示：指标名、主数据、YoY、MoM 在同一行。

| 项目 | 规范（按参考截图估算，待确认） |
|---|---|
| 容器 | `#F7F8FA` 背景，`6px` 圆角，左右内边距 `16px`；放在白色区域内 |
| 行高 / 分隔线 | `46px` / `1px #E5E6EB`，最后一行无分隔线 |
| 指标名 | `14px / Regular / text-primary #1D2129`，左对齐，过长单行截断 |
| 主数据 | Primary Data XS：`DIN PRO 16px / Bold / text-primary #1D2129`，右对齐 |
| 比较标签（YoY / MoM） | `12px / Regular / text-tertiary #86909C`，`#FFFFFF` 背景，`4px` 圆角，`2px 8px` 内边距 |
| 比较数值 | `14px / Regular`，颜色与方向图标按 General / US trend semantics |
| 间距 | 主数据、YoY 组、MoM 组之间 `20px`；比较标签与数值间距 `12px`（以 `xx.x%` 5 个字符为数值宽度基准，较短数值右对齐，图标纵向对齐） |

- 用于主指标卡下方或旁边的次要指标，不替代一级指标卡。
- 同一列表内的指标使用相同的比较项和顺序。

### Usage constraints

- 卡片只显示一个主数据，不能在同一视觉层级并列多个核心数值。
- 卡片高度由内容自适应，不设置固定高度或最小高度。
- 比较区域在卡片底部对齐，YoY / MoM 最后一行与卡片底部保持 `16px` 间距。
- 分类背景不能替代标题或业务分类文字。
- 趋势不能只依赖颜色，必须同时显示方向符号和数值。
- Tooltip 仅补充指标定义或口径，不能隐藏理解指标所必需的核心信息。
- 主数据缺失时不得显示为 `0`，应使用明确的缺失值规则。

## Charts

> 状态：坐标轴、图表色板、图例、Hover 提示和 8 种图表参考已确认。色板色值按截图取色，待设计稿精确值确认。

### Axis

| 元素 | 颜色 | 规范 |
|---|---|---|
| 类目轴文字（柱状/折线 X 轴，条形 Y 轴） | `#4E5969` | `12px / Regular` |
| 数值轴文字（柱状/折线 Y 轴、右侧百分比轴，条形 X 轴） | `#86909C` | `12px / Regular` |
| 底部轴线（数值 0 处） | `#E5E6EB` | `1px` |
| 常规刻度线 | `#F2F3F5` | `1px` |

- 柱状图、折线图：刻度线水平，底部轴线在底部；双轴时右侧显示百分比，标签左对齐。
- 横向条形图：坐标轴旋转，类目在左侧，数值在底部；刻度线竖直，0 处轴线在左侧。
- 数值轴从 0 开始，默认 5 个刻度区间，数值使用千分位。

### Chart colors

提供两组配色，数据系列按序号 1 → 12 取色，不跳色。同一图表只使用一组配色，同一页面的图表保持同一组。

| 序号 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 配色一 | `#00AAA6` | `#FF7D00` | `#F53F3F` | `#4080FF` | `#F7BA1E` | `#4DCDFF` | `#A871E3` | `#7EB712` | `#E865DF` | `#23C343` | `#F754A8` | `#A9AEB8` |
| 配色二 | `#4ACCC1` | `#FFB65D` | `#F98981` | `#6AA1FF` | `#F9CC45` | `#6CD5FF` | `#C396ED` | `#9FDB1D` | `#F08EE6` | `#7BE188` | `#FB9DC7` | `#C9CDD4` |

- 配色二按参考图取色，并对齐 Arco 色板对应色阶（如 primary-4、orange-4、red-4）。

- 同一指标在同一页面的不同图表中保持同一颜色。
- 系列较多时，优先合并为「其他」，不依赖第 12 种以后的颜色。

### Legend

| 图表 | 标记 |
|---|---|
| 折线图、环形图、单色环形图 | `8px` 圆点 |
| 柱状图、条形图 | `8px` 方形，`2px` 圆角 |

- 组合图按系列类型分别使用方形（柱）和圆点（线）。
- 文字 `12px / Regular / #4E5969`；标记与文字间距 `6px`；图例项间距 `16px`；位于图表上方，左对齐。

### Hover tooltip

| 元素 | 规范 |
|---|---|
| 容器 | `#FFFFFF`，`6px` 圆角，阴影 `0 4px 16px rgba(29,33,41,0.14)` |
| 标题（类目或扇区名） | `12px / Medium / #1D2129` |
| 系列名 | `12px / Regular / #4E5969`，前置图例标记 |
| 数值 | `12px / Medium / #1D2129`，右对齐，千分位 |
| 柱状、条形 Hover | 整个类目区域显示 `#1D2129` 4% 透明度背景 |
| 折线 Hover | 类目中线显示 `1px #C9CDD4` 虚线，数据点半径由 `4px` 放大到 `5.5px` |
| 环形图 Hover | 扇区沿半径方向外移 `6px` |

- 柱状、条形、折线、组合图悬停整个类目区域即显示该类目全部系列的数据；堆积图额外显示 Total。
- 环形图显示数值和占比；单色环形图显示完成值和剩余值。

### Chart types

| 图表 | 适用场景 | 规格 |
|---|---|---|
| 簇状柱状图 | 同一类目下多个系列对比 | 柱宽 `16px`，柱间距 `2px`，顶部 `2px` 圆角 |
| 堆积柱状图 | 总量及构成随类目变化 | 柱宽 `16px`，只有最上层有圆角 |
| 横向条形图 | 类目名称较长或排名对比 | 条高 `16px`，右端 `2px` 圆角 |
| 横向堆叠条形图 | 类目构成对比 | 同横向条形图，只有最右段有圆角 |
| 折线图 | 趋势变化 | 线宽 `2px`，数据点 `4px` 半径实心（系列色填充）、`1.5px` 白色描边 |
| 组合图（柱+线） | 数量与比率同时展示 | 柱宽 `16px`，柱使用左轴，线使用右侧百分比轴；数据点同折线图 |
| 环形图 | 构成占比，可在中心显示总量 | 环宽 `24px`（外半径 / 内半径 `100 / 76`），中心总量 `DIN PRO 20px Bold` |
| 单色环形图 | 单个比率或完成度（如达成率、有货率） | 已完成部分用色板第 1 色 `#00AAA6`，剩余轨道 `#F2F3F5`；尺寸同环形图，中心显示百分比（`DIN PRO 20px Bold`）和指标名 |

## Table

> 状态：表头、行间隔、文字、可点击单元格和状态标签列样式已确认。

### Colors & Typography

| 元素 | 颜色 | 文字规范 |
|---|---|---|
| 表头背景 | `#E0F2F5` | — |
| 表头文字 | `text-secondary #4E5969` | `14px / Regular` |
| 奇数行背景 | `#FFFFFF` | — |
| 偶数行背景 | `#F7F8FA` | — |
| 单元格文字 | `text-primary #1D2129` | `14px / Regular` |
| 可点击文字 | `text-link #00AAA6` | `14px / Regular` |

实现参考（不在规范页展示）：表头与数据行高度均为 `48px`；列分隔线统一为 `#FFFFFF / 1px`；内容居中，容器圆角 `6px`，无描边。

### Report table（报表样式）

用于按层级汇总的报表（如 Brand → Category → Product Line），支持合并单元格和小计行。

| 元素 | 颜色 | 文字规范 |
|---|---|---|
| 表头背景 | `primary-6 #00AAA6` | — |
| 表头文字 | `#FFFFFF` | `14px / Regular` |
| 数据行背景 | `#FFFFFF`（无斑马纹） | — |
| 单元格文字 | `text-primary #1D2129` | `14px / Regular` |
| 汇总行（Total）背景 | `#E0F2F5` | — |
| 汇总行文字 | `text-primary #1D2129` | `14px / Bold` |
| 单元格描边 | `#E5E6EB` | `1px` |

- 所有单元格（含表头列分隔和外框）使用 `1px #E5E6EB` 描边；容器圆角 `6px`。
- 上级维度使用纵向合并单元格，内容水平、垂直居中。
- 每个上级分组末尾放 Total 行，"Total" 横向合并所有维度列。
- 内容居中；行高 `36px`（按参考截图估算，待确认）。

### Clickable cell

| 状态 | 文字颜色 | 装饰 |
|---|---|---|
| Default | `#00AAA6` | 无 |
| Hover | `primary-7 #009093` | 下划线 |

- 可点击单元格用于下钻、打开详情或跳转，必须使用可聚焦的按钮或链接，并支持键盘操作。
- 不可点击的单元格不得使用 `text-link` 颜色。
- 行背景只用于斑马纹区分，不表达状态。

### Status tag column

状态或等级列使用 Tag 组件的 Light 类型：Low 用 Green，Mid 用 Orange，High 用 Red。规格见「Tag」。

## Button

> 状态：主按钮、次按钮、文字按钮的 Default / Hover 样式已确认。尺寸按参考截图估算，待设计稿标注确认。

| 类型 | 状态 | 背景 | 文字 |
|---|---|---|---|
| Primary（主按钮） | Default | `primary-6 #00AAA6` | `#FFFFFF` |
| Primary（主按钮） | Hover | `primary-7 #009093` | `#FFFFFF` |
| Secondary（次按钮） | Default | `#F2F3F5` | `text-secondary #4E5969` |
| Secondary（次按钮） | Hover | `#F2F3F5` | `primary-6 #00AAA6` |
| Text（文字按钮） | Default | Transparent | `primary-6 #00AAA6` |
| Text（文字按钮） | Hover | `#F2F3F5` | `primary-6 #00AAA6` |

- 高度 `28px / 32px`，左右内边距 `16px`，圆角 `4px`，文字 `14px / Regular`，无描边。
- 当前仅定义 Default、Hover。不得自行增加其他视觉状态。
- 同一操作区只放一个主按钮；次要操作用次按钮，低优先级或行内操作用文字按钮。

## Tag

> 状态：三种类型和六种颜色已确认。色值和尺寸按参考截图估算，待设计稿标注确认。

### Types

| 类型 | 背景 | 文字 | 描边 |
|---|---|---|---|
| Light（浅色填充） | 对应颜色浅色 | 对应颜色 | 无 |
| Solid（实色填充） | 对应颜色 | `#FFFFFF` | 无 |
| Outline（描边） | 透明 | 对应颜色 | `1px` 对应颜色 |

### Colors

| 颜色 | Light 背景 | Light 文字 | Solid 背景 | Outline 描边 / 文字 |
|---|---|---|---|---|
| Primary | `#E6F7F7` | `#00AAA6` | `#00AAA6` | `#00AAA6` |
| Red | `#FFECEC` | `#F53F3F` | `#F53F3F` | `#F53F3F` |
| Orange | `#FFEEE6` | `#FF7D00` | `#FF7D00` | `#FF7D00` |
| Blue | `#E8F0FF` | `#4080FF` | `#4080FF` | `#4080FF` |
| Gray | `#F2F3F5` | `#4E5969` | `#C9CDD4` | `#C9CDD4` |
| Green | `#E3F9E9` | `#009A29` | `#23C343` | `#23C343` |

### Specifications

- 高度 `24px`，左右内边距 `8px`，圆角 `4px`，文字 `12px / Regular`，单行不换行。
- 同一区域只使用一种标签类型；颜色只表达语义（如状态或等级），不作装饰。
- 标签不能只靠颜色传达含义，文字必须能独立说明状态。

