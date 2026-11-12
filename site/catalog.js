const colorScale = (name, token, values) => ({
  name,
  token,
  colors: values.map((hex, index) => ({
    name: `${token}-${index + 1}`,
    hex: hex.toUpperCase()
  }))
});

window.REPORT_UI_CATALOG = {
  version: "V1.1",
  sections: [
    {
      id: "getting-started",
      group: "开始使用",
      title: "说明",
      type: "overview",
      blocks: []
    },
    {
      id: "colors",
      group: "设计规范",
      title: "Colors",
      type: "colors",
      blocks: []
    },
    {
      id: "typography",
      group: "设计规范",
      title: "Typography",
      type: "typography",
      blocks: []
    },
    {
      id: "spacing",
      group: "设计规范",
      title: "Spacing",
      type: "spacing",
      blocks: []
    },
    {
      id: "filters-navigation",
      group: "组件",
      title: "Filters & Navigation",
      type: "filters-navigation",
      blocks: []
    },
    {
      id: "radio-checkbox",
      group: "组件",
      title: "Radio & Checkbox",
      type: "choice-controls",
      blocks: []
    },
    {
      id: "metric-card",
      group: "组件",
      title: "Metric Card",
      type: "metric-card",
      blocks: []
    },
    {
      id: "table",
      group: "组件",
      title: "Table",
      type: "data-table",
      blocks: []
    },
    {
      id: "charts",
      group: "组件",
      title: "Charts",
      type: "charts",
      blocks: []
    },
    {
      id: "button",
      group: "组件",
      title: "Button",
      type: "button",
      blocks: []
    },
    {
      id: "tag",
      group: "组件",
      title: "Tag",
      type: "tag",
      blocks: []
    },
    {
      id: "page-patterns",
      group: "页面参考",
      title: "页面模板",
      type: "page-patterns",
      blocks: []
    },
    {
      id: "icons",
      group: "图标库",
      title: "Icons",
      type: "icons",
      blocks: []
    }
  ],
  typography: {
    fonts: [
      { language: "Chinese", family: "阿里巴巴普惠体" },
      { language: "English", family: "Inter" },
      { language: "Primary Data", family: "DIN PRO" }
    ],
    styles: [
      { size: 24, lineHeight: 32, weight: "Bold", weightValue: 700, type: "Page Title", usage: "页面标题。用于定义整个报表页面，一个页面通常只使用一次。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } },
      { size: 20, lineHeight: 28, weight: "Bold", weightValue: 700, type: "H1", usage: "一级标题。用于主要内容分区和一级分析模块。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } },
      { size: 16, lineHeight: 24, weight: "Medium", weightValue: 500, type: "H2", usage: "二级标题。用于卡片、图表、表格或次级模块标题。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } },
      { size: 14, lineHeight: 22, weight: "Medium", weightValue: 500, type: "Label / Filter / Table Header / Button", usage: "表单与筛选标签、页签、表头和按钮。组件层级通过容器、颜色和交互状态区分，不改变字重。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } },
      { size: 14, lineHeight: 22, weight: "Regular", weightValue: 400, type: "Body / Paragraph / Input / Link", usage: "默认正文、连续说明、表格单元格、输入内容和文字链接。段落使用 24px 行高；链接必须具有可识别的交互反馈。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } },
      { size: 12, lineHeight: 18, weight: "Regular", weightValue: 400, type: "Supporting Text / Data Label", usage: "辅助说明、时间戳、单位、图例、坐标轴和紧凑型数据标签。不得承载关键结论或必须操作的信息。", samples: { zh: "滚滚长江东逝水", en: "Lorem Ipsum" } }
    ],
    primaryDataStyles: [
      { size: 32, lineHeight: 40, weight: "Bold", weightValue: 700, type: "Primary Data XL", usage: "总览页首要指标或需要最高视觉优先级的单一核心数值。", sample: "1,286,420" },
      { size: 28, lineHeight: 36, weight: "Bold", weightValue: 700, type: "Primary Data L", usage: "标准 KPI 卡和页面主要指标。", sample: "1,286,420" },
      { size: 24, lineHeight: 32, weight: "Bold", weightValue: 700, type: "Primary Data M", usage: "常规指标卡主数据和模块级核心数值。", sample: "1,286,420" },
      { size: 20, lineHeight: 28, weight: "Bold", weightValue: 700, type: "Primary Data S", usage: "紧凑型指标、卡片次级数据和需要强调的表格汇总值。", sample: "1,286,420" },
      { size: 16, lineHeight: 24, weight: "Bold", weightValue: 700, type: "Primary Data XS", usage: "二级指标列表（横向）中的指标数值。", sample: "1,286,420" }
    ],
    colorGroups: [
      {
        title: "Text Colors",
        colors: [
          { name: "text-primary", hex: "#1D2129", usage: "强调信息 / 正文 / 标题" },
          { name: "text-secondary", hex: "#4E5969", usage: "次强调信息 / 正文 / 标题" },
          { name: "text-tertiary", hex: "#86909C", usage: "次要信息" },
          { name: "text-placeholder", hex: "#C9CDD4", usage: "置灰信息 / 占位内容" },
          { name: "text-link", hex: "#00AAA6", usage: "链接 / 可点击文字" }
        ]
      },
      {
        title: "Status Text Colors",
        colors: [
          { name: "text-danger", hex: "#F83A3A", usage: "错误 / 失败" },
          { name: "text-warning", hex: "#FF7D00", usage: "警示 / 提醒" },
          { name: "text-success", hex: "#52C41A", usage: "良好 / 成功" },
          { name: "text-processing", hex: "#3491FA", usage: "进行中 / 等待中" }
        ]
      }
    ]
  },
  colorPalettes: [
    colorScale("Primary", "primary", [
      "#E8FFFB", "#ADEEE4", "#79DDD1", "#4ACCC1", "#22BBB3",
      "#00AAA6", "#009093", "#00757B", "#005C64", "#00444D"
    ]),
    colorScale("Orange", "orange", [
      "#FFF7E8", "#FFE4BA", "#FFCF8B", "#FFB65D", "#FF9A2E",
      "#FF7D00", "#D25F00", "#A64500", "#792E00", "#4D1B00"
    ]),
    colorScale("Red", "red", [
      "#FFECE8", "#FDCDC5", "#FBACA3", "#F98981", "#F76560",
      "#F53F3F", "#CB272D", "#A1151E", "#770813", "#4D000A"
    ]),
    colorScale("Gold", "gold", [
      "#FFFCE8", "#FDF4BF", "#FCE996", "#FADC6D", "#F9CC45",
      "#F7BA1E", "#CC9213", "#A26D0A", "#774B04", "#4D2D00"
    ]),
    colorScale("Green", "green", [
      "#E8FFEA", "#AFF0B5", "#7BE188", "#4CD263", "#23C343",
      "#00B42A", "#009A29", "#008026", "#006622", "#004D1C"
    ]),
    colorScale("Blue", "blue", [
      "#E8F7FF", "#C3E7FE", "#9FD4FD", "#7BC0FC", "#57A9FB",
      "#3491FA", "#206CCF", "#114BA3", "#063078", "#001A4D"
    ]),
    colorScale("Purple", "purple", [
      "#F5E8FF", "#DDBEF6", "#C396ED", "#A871E3", "#8D4EDA",
      "#722ED1", "#551DB0", "#3C108F", "#27066E", "#16004D"
    ]),
    colorScale("Fuchsia", "fuchsia", [
      "#FFE8FB", "#F7BAEF", "#F08EE6", "#E865DF", "#E13EDB",
      "#D91AD9", "#B010B6", "#8A0993", "#650370", "#42004D"
    ]),
    colorScale("Magenta", "magenta", [
      "#FFE8F1", "#FDC2DB", "#FB9DC7", "#F979B7", "#F754A8",
      "#F5319D", "#CB1E83", "#A11069", "#77064F", "#4D0034"
    ]),
    colorScale("Gray", "gray", [
      "#F7F8FA", "#F2F3F5", "#E5E6EB", "#C9CDD4", "#A9AEB8",
      "#86909C", "#6B7785", "#4E5969", "#272E3B", "#1D2129"
    ])
  ],
  icons: window.REPORT_UI_ICONS || []
};
