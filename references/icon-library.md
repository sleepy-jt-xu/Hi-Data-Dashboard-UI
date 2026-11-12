# 图标库规范

> 当前状态：`assets/icons/source/` 中的 25 个图标均为已确认图标，可直接用于页面。

## 1. 图标来源

- `assets/icons/source/` 是图标库的唯一来源，文件名即图标 ID（空格转为连字符，如 `zoom in.svg` → `zoom-in`）。
- 画布 `24×24`，单色。导入后颜色为 `currentColor`，跟随所在文字颜色，可自由改色。
- HTML 规范站「Icons」页可预览、改色、改尺寸，并下载 SVG / PNG。

## 2. 已确认图标

| 分类 | 图标 ID |
|---|---|
| 方向 | `chevron-up` `chevron-down` `chevron-left` `chevron-right` `chevrons-up` `chevrons-down` `chevrons-left` `chevrons-right` |
| 趋势 / 标记 | `triangle-up` `triangle-down` `triangle-left` `triangle-right` |
| 提示 / 状态 | `info-exclamation` `info-question` `alert-circle` `alert-triangle` |
| 操作 | `search` `refresh` `download` `copy` `delete` `setting` `calendar` `zoom-in` `zoom-out` |

## 3. 已确定的用法

| 场景 | 图标 | 尺寸 / 颜色 |
|---|---|---|
| Dropdown 展开箭头 | `chevron-down`（级联子级用 `chevron-right`） | 按 `28px` 渲染；默认 `#C9CDD4`，展开时 `#00AAA6` 并旋转 180° |
| 指标卡说明入口 | `info-exclamation` | `28px`；默认 `text-tertiary`，交互时 `primary-6` |
| 同比 / 环比方向 | `triangle-up` / `triangle-down` | `24px`；颜色按 General / US trend semantics |
| 页面标题栏操作 | `info-question`（说明）、`download`（导出） | `20px`；默认 `#86909C`，Hover `#00AAA6` |
| 返回按钮 | `chevron-left` | `24px` |

## 4. 使用规则

- 只使用本文件第 2 节列出的图标；缺少合适图标时，不得用含义相近但语义不同的图标代替，应在交付说明中列为待补充。
- 图标必须表达稳定、可识别的语义，不作为无意义装饰。
- 仅靠图标难以理解的操作应提供文字、Tooltip 或可访问名称。
- 同一动作在整个系统中使用同一图标。
- 不得拉伸或改变比例；方向、趋势和状态图标不得只靠颜色传达含义。

## 5. 添加或更新图标

1. 把 SVG 放进 `assets/icons/source/`，用图标名作为文件名。
2. 文件要求：画布 `24×24`、单色、路径颜色统一为 `#453D53`；不含文字、位图、蒙版、滤镜、脚本或外部链接。
3. 运行 `node .kiro/skills/hidata-dashboard-ui/site/build-standalone.mjs`。构建会自动：
   - 删除 Figma 导出的白色背景 `<rect fill="white"/>`；
   - 把 `#453D53` 替换为 `currentColor`；
   - 去掉根节点 `width` / `height`，只保留 `viewBox`；
   - 重新生成 `site/icons.js` 和 `Hidata-dashboard-ui.html`。文件里如有其他颜色，构建时会提示并原样保留（该图标不能改色）。
4. 新图标确认后，补充到本文件第 2 节。
5. 不要手动编辑 `site/icons.js`，每次构建都会覆盖。
