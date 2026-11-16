/* global window, document, history, navigator, setTimeout, ResizeObserver, URL, URLSearchParams, Blob, Image, DOMParser, XMLSerializer */
(() => {
  "use strict";

  const catalog = window.REPORT_UI_CATALOG;
  const navigation = document.querySelector("#navigation");
  const pageRoot = document.querySelector("#page");
  const sidebar = document.querySelector("#sidebar");
  const navToggle = document.querySelector("#nav-toggle");
  const toast = document.querySelector("#toast");
  const version = document.querySelector("#version");

  const LIBRARY_ICONS = new Map(
    (window.REPORT_UI_ICONS || []).map((icon) => [icon.id, icon.svg])
  );

  const CHART_COLORS = [
    "#00AAA6", "#FF7D00", "#F53F3F", "#4080FF", "#F7BA1E", "#4DCDFF",
    "#A871E3", "#7EB712", "#E865DF", "#23C343", "#F754A8", "#A9AEB8"
  ];
  // Second chart palette (lighter). Values estimated from the reference image.
  const CHART_COLORS_LIGHT = [
    "#4ACCC1", "#FFB65D", "#F98981", "#6AA1FF", "#F9CC45", "#6CD5FF",
    "#C396ED", "#9FDB1D", "#F08EE6", "#7BE188", "#FB9DC7", "#C9CDD4"
  ];
  // Tag colors estimated from the reference image; see references/component-patterns.md.
  const TAG_COLORS = [
    { name: "Primary", light: ["#E6F7F7", "#00AAA6"], solid: "#00AAA6", outline: "#00AAA6" },
    { name: "Red", light: ["#FFECEC", "#F53F3F"], solid: "#F53F3F", outline: "#F53F3F" },
    { name: "Orange", light: ["#FFEEE6", "#FF7D00"], solid: "#FF7D00", outline: "#FF7D00" },
    { name: "Blue", light: ["#E8F0FF", "#4080FF"], solid: "#4080FF", outline: "#4080FF" },
    { name: "Gray", light: ["#F2F3F5", "#4E5969"], solid: "#C9CDD4", outline: "#C9CDD4" },
    { name: "Green", light: ["#E3F9E9", "#009A29"], solid: "#23C343", outline: "#23C343" }
  ];
  // Matches the 1920px design canvas of the reference mockups.
  const TEMPLATE_WIDTH = 1920;
  // Page background per scene. build-standalone.mjs inlines the image as a data URL.
  const DIGITAL_STORE_BG = "../assets/digital-store-bg.png";
  const TEMPLATE_SCENES = { regular: "常规", digital: "数字化门店" };
  let templateScene = "regular";
  const DASHBOARD_METRICS = [
    { title: "Sell out Unit", value: "19,234", ly: "154,362", yoy: "12.5%", yoyDirection: "up" },
    { title: "Sell out Amount", value: "$ 262,327.23", ly: "154,362.43", yoy: "0%", yoyDirection: "flat" },
    { title: "Mini-LED Sell out Unit", value: "39,402", ly: "54,362", yoy: "-2.3%", yoyDirection: "down" },
    { title: "Key Products Sell out", value: "$ 62,327.23", ly: "54,362.43", yoy: "12.5%", yoyDirection: "up" },
    { title: "0 Sell out Ratio", value: "262,327", ly: "154,362", yoy: "12.5%", yoyDirection: "up" }
  ];
  const STORE_ROWS = [
    ["West Coast", "New York City Branch", "210", "2,182", "89.4%"],
    ["East Coast", "Boston Branch", "150", "1,500", "85.6%"],
    ["South Region", "Atlanta Branch", "180", "1,800", "88.2%"],
    ["Midwest", "Chicago Branch", "200", "2,000", "90.1%"],
    ["Southwest", "Phoenix Branch", "120", "1,200", "86.4%"],
    ["Northeast", "Philadelphia Branch", "160", "1,600", "87.5%"],
    ["Pacific Northwest", "Seattle Branch", "140", "1,400", "83.7%"],
    ["Great Lakes", "Detroit Branch", "170", "1,700", "88.9%"],
    ["Southeast", "Miami Branch", "110", "1,100", "84.2%"],
    ["Central Plains", "Dallas Branch", "190", "1,900", "89.0%"],
    ["Mountain Region", "Denver Branch", "130", "1,300", "82.5%"],
    ["New England", "Providence Branch", "115", "1,150", "85.0%"],
    ["Pacific Coast", "Los Angeles Branch", "230", "2,300", "91.2%"],
    ["Bay Area", "San Francisco Branch", "175", "1,750", "87.9%"],
    ["Gulf Coast", "Houston Branch", "185", "1,850", "86.8%"],
    ["Mid-Atlantic", "Baltimore Branch", "125", "1,250", "84.6%"],
    ["Upper Midwest", "Minneapolis Branch", "135", "1,350", "88.1%"],
    ["Ohio Valley", "Columbus Branch", "145", "1,450", "85.3%"],
    ["Rocky Mountain", "Salt Lake City Branch", "105", "1,050", "83.1%"],
    ["Desert Region", "Las Vegas Branch", "155", "1,550", "86.9%"],
    ["Southern Plains", "Oklahoma City Branch", "95", "950", "82.7%"],
    ["Carolinas", "Charlotte Branch", "165", "1,650", "88.4%"]
  ];
  const CHART_W = 420;
  const CHART_H = 260;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const WEEKS = ["WK1", "WK2", "WK3", "WK4", "WK5", "WK6"];
  const REGIONS = ["West Coast", "Midwest", "Southeast", "Northeast", "Southwest"];
  const COLUMN_SERIES = [
    { name: "Sell out", values: [3200, 3800, 2900, 4100, 3600, 4400] },
    { name: "Sell in", values: [2800, 3300, 3100, 3500, 3900, 3700] },
    { name: "Inventory", values: [1800, 2100, 2400, 1900, 2300, 2000] }
  ];
  const STACKED_COLUMN_SERIES = [
    { name: "Online", values: [1600, 1900, 1400, 2000, 1800, 2100] },
    { name: "Retail", values: [1200, 1300, 1500, 1100, 1400, 1600] },
    { name: "Wholesale", values: [800, 900, 700, 1000, 600, 900] }
  ];
  const BAR_SERIES = [{ name: "Sell out", values: [4200, 3500, 2800, 3900, 2100] }];
  const STACKED_BAR_SERIES = [
    { name: "Online", values: [1800, 1500, 1200, 1700, 900] },
    { name: "Retail", values: [1400, 1200, 1000, 1300, 800] },
    { name: "Wholesale", values: [900, 700, 600, 800, 500] }
  ];
  const RATE_SERIES = { name: "In Stock Rate", values: [82, 76, 89, 80, 85, 91] };
  const CHANNEL_SHARE = [
    { name: "Online", value: 4200 },
    { name: "Retail", value: 3100 },
    { name: "Wholesale", value: 1800 },
    { name: "Other", value: 900 }
  ];
  const SINGLE_RATE = { name: "In Stock Rate", value: 82 };

  if (!catalog || !Array.isArray(catalog.sections)) {
    pageRoot.textContent = "站点内容载入失败。";
    return;
  }

  version.textContent = catalog.version;
  renderNavigation();
  renderCurrentPage();

  window.addEventListener("hashchange", renderCurrentPage);
  document.addEventListener("click", (event) => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      if (!dropdown.contains(event.target) && dropdown._close) dropdown._close();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      if (dropdown._close) dropdown._close();
    });
  });
  navToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "关闭目录" : "打开目录");
  });

  function renderNavigation() {
    const groups = new Map();
    catalog.sections.forEach((section) => {
      if (!groups.has(section.group)) groups.set(section.group, []);
      groups.get(section.group).push(section);
    });

    navigation.replaceChildren(
      ...Array.from(groups, ([group, sections]) => {
        const wrapper = element("section", "nav-group");
        const title = element("h2", "nav-group-title", group);
        const links = sections.map((section) => {
          const link = element("a", "nav-link", section.title);
          link.href = `#${section.id}`;
          link.dataset.section = section.id;
          link.addEventListener("click", closeMobileNavigation);
          return link;
        });
        wrapper.append(title, ...links);
        return wrapper;
      })
    );
  }

  function renderCurrentPage() {
    const [requestedId, subId] = window.location.hash.slice(1).split("/");
    const section =
      catalog.sections.find((item) => item.id === requestedId) ||
      catalog.sections[0];

    if (!requestedId) history.replaceState(null, "", `#${section.id}`);

    document.querySelectorAll("[data-section]").forEach((link) => {
      if (link.dataset.section === section.id) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const template =
      section.type === "page-patterns" && subId
        ? reportTemplates().find((item) => item.id === subId)
        : null;
    if (template) {
      const view = renderTemplateView(template, section);
      pageRoot.replaceChildren(view);
      fitTemplates(view);
      document.title = `${template.title} · 外销通用报表&数据看板UI`;
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const page = element("article", "page");
    if (section.eyebrow) {
      page.append(element("p", "eyebrow", section.eyebrow));
    }
    const headingRow = element("div", "page-title-row");
    const heading = element("h1", "", section.title);
    headingRow.append(heading);
    if (section.status) {
      headingRow.append(element("span", "status", section.status));
    }
    page.append(headingRow);
    if (section.summary) {
      page.append(element("p", "summary", section.summary));
    }

    if (section.type === "icons") {
      page.append(renderIconLibrary());
    } else if (section.type === "colors") {
      page.append(renderColorPalettes());
    } else if (section.type === "typography") {
      page.append(renderTypography());
    } else if (section.type === "filters-navigation") {
      page.append(renderFiltersNavigation());
    } else if (section.type === "spacing") {
      page.append(renderSpacing());
    } else if (section.type === "overview") {
      page.append(renderOverview());
    } else if (section.type === "choice-controls") {
      page.append(renderChoiceControls());
    } else if (section.type === "button") {
      page.append(renderButtonDocumentation());
    } else if (section.type === "tag") {
      page.append(renderTagDocumentation());
    } else if (section.type === "page-patterns") {
      headingRow.append(templateSceneSwitch());
      page.append(templateSceneNote(), renderTemplateGallery(section));
    } else if (section.type === "metric-card") {
      page.append(renderMetricCardDocumentation());
    } else if (section.type === "data-table") {
      page.append(renderDataTableDocumentation());
    } else if (section.type === "charts") {
      page.append(renderChartsDocumentation());
    } else {
      page.append(...renderBlocks(section.blocks || []));
    }

    if (section.source) {
      const source = element("a", "source-link", "查看对应规范源文件");
      source.href = section.source;
      page.append(source);
    }

    pageRoot.replaceChildren(page);
    fitTemplates(page);
    document.title = `${section.title} · 外销通用报表&数据看板UI`;
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ---------- Page templates ---------- */

  function reportTemplates() {
    return [
      {
        id: "template-1",
        title: "报表模板1",
        summary: "多维汇总报表，含常规筛选、页签、指标维度选择",
        build: buildTemplateOne
      },
      {
        id: "template-2",
        title: "报表模板2",
        summary: "自定义透视报表，分别选择行、列维度指标",
        build: buildTemplateTwo
      },
      {
        id: "dashboard-1",
        title: "数据看板模板1",
        summary: "指标卡独立，含趋势图、占比图、明细表",
        build: buildDashboardOne
      },
      {
        id: "dashboard-2",
        title: "数据看板模板2",
        summary: "指标卡与趋势图在一个容器内，适合二者有关联的看板",
        build: buildDashboardTwo
      },
      {
        id: "dashboard-3",
        title: "数据看板模板3",
        summary: "主要指标通过颜色及标题分类，下方为趋势图、明细表等内容；适合指标需求较多的看板",
        build: buildDashboardThree
      },
      {
        id: "dashboard-4",
        title: "数据看板模板4",
        summary: "主要指标卡加多组次要指标，下方为趋势图、明细表等内容；适合次要指标较多的看板",
        build: buildDashboardFour
      }
    ];
  }

  /* ---------- Dashboard templates ---------- */

  // Basic table structure (header #E0F2F5, zebra rows) used inside dashboards.
  function dashboardStoreTable(rowCount, columnCount = 5, fill = false) {
    const table = element("table", "data-table tpl-data-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Region", "Store", "Sell out Unit", "Sell out Amount ($)", "In Stock Rate"].slice(0, columnCount).forEach((label) => {
      const th = element("th", "", label);
      th.scope = "col";
      headRow.append(th);
    });
    head.append(headRow);
    const body = document.createElement("tbody");
    STORE_ROWS.slice(0, rowCount).forEach((cells) => {
      const row = document.createElement("tr");
      cells
        .slice(0, columnCount)
        .forEach((value, index) => row.append(element("td", index > 1 ? "table-number" : "", value)));
      body.append(row);
    });
    table.append(head, body);
    const scroll = element("div", "data-table-scroll");
    scroll.append(table);
    if (!fill) return scroll;
    const wrapper = element("div", "tpl-fill");
    wrapper.append(scroll);
    return wrapper;
  }

  function dashboardSectionHead(title, ...extras) {
    const head = element("div", "tpl-box-head");
    head.append(element("h2", "tpl-box-title", title), ...extras);
    return head;
  }

  function dashboardChart(width, height, label, draw) {
    const stage = element("div", "chart-stage tpl-chart-stage");
    const svg = svgNode("svg", { class: "chart-svg", viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": label });
    const tooltipNode = element("div", "chart-tooltip");
    tooltipNode.hidden = true;
    stage.append(svg, tooltipNode);
    const tooltip = createChartTooltip(stage, tooltipNode);
    const redraw = (...args) => {
      svg.replaceChildren();
      tooltip.hide();
      draw(svg, tooltip, ...args);
    };
    redraw();
    stage._redraw = redraw;
    return stage;
  }

  function kFormat(value) {
    return value ? `${value / 1000}K` : "0";
  }

  function drawDashboardColumns(svg, tooltip, { categories, bars, line, width, height, barGap = 4 }) {
    const axis = drawVerticalAxis(svg, {
      max: 5000,
      categories,
      rightMax: line ? 100 : undefined,
      width,
      height,
      format: kFormat, flush: true
    });
    const barW = 16;
    const groupW = barW * bars.length + barGap * (bars.length - 1);
    const group = svgNode("g");
    categories.forEach((_, i) => {
      const x0 = axis.x(i) - groupW / 2;
      bars.forEach((s, k) => {
        const y = axis.y(s.values[i]);
        group.append(
          svgNode("path", { d: barPath(x0 + k * (barW + barGap), y, barW, axis.baseY - y, 2), fill: s.color })
        );
      });
    });
    const points = categories.map(() => []);
    if (line) {
      const xs = categories.map((_, i) => axis.x(i));
      const ys = line.values.map((value) => axis.yRight(value));
      group.append(
        svgNode("path", {
          d: linePath(xs, ys),
          fill: "none",
          stroke: line.color,
          "stroke-width": 2,
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        })
      );
      drawPoints(group, points, xs, ys, line.color);
    }
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: categories.length,
      area: verticalArea(axis),
      title: (i) => categories[i],
      rows: (i) => [
        ...bars.map((s) => ({ color: s.color, shape: "square", name: s.name, value: formatNumber(s.values[i]) })),
        ...(line ? [{ color: line.color, shape: "circle", name: line.name, value: `${line.values[i]}%` }] : [])
      ],
      onActive: line ? highlightPoints(points) : undefined
    });
  }

  function buildDashboardOne() {
    const page = element("div", "tpl-page");

    const metrics = element("div", "tpl-metric-row is-standalone");
    DASHBOARD_METRICS.forEach((metric) => metrics.append(createMetricCard({ ...metric, tone: "neutral" })));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trend = element("section", "tpl-box");
    trend.append(
      dashboardSectionHead(
        "Sell out Unit",
        chartLegend([
          { name: "Actual", color: CHART_COLORS[0], shape: "square" },
          { name: "PY", color: CHART_COLORS[3], shape: "square" },
          { name: "Achv.% of Plan", color: CHART_COLORS[2], shape: "circle" }
        ])
      ),
      dashboardChart(960, 300, "Sell out Unit", (svg, tooltip) =>
        drawDashboardColumns(svg, tooltip, {
          categories: days,
          width: 960,
          height: 300,
          bars: [
            { name: "Actual", color: CHART_COLORS[0], values: [2900, 3300, 3300, 2900, 2900, 3300, 3300] },
            { name: "PY", color: CHART_COLORS[3], values: [3100, 3500, 3600, 3100, 3100, 3500, 3500] }
          ],
          line: { name: "Achv.% of Plan", color: CHART_COLORS[2], values: [40, 55, 58, 60, 72, 56, 71] }
        })
      )
    );

    // Donut drawers center on CHART_W x CHART_H; crop the viewBox to the ring.
    const cropDonut = (svg) =>
      svg.setAttribute("viewBox", `${CHART_W / 2 - 104} ${CHART_H / 2 - 104} 208 208`);
    const stock = element("section", "tpl-box");
    const stockChart = dashboardChart(CHART_W, CHART_H, "In Stock Rate", (svg, tooltip) => {
      drawSingleDonut(svg, tooltip, SINGLE_RATE);
      cropDonut(svg);
    });
    stockChart.classList.add("tpl-donut");
    const stockBody = element("div", "tpl-donut-row");
    stockBody.append(stockChart);
    stock.append(dashboardSectionHead("In Stock Rate"), stockBody);

    const storeTypes = [
      { name: "PAD & VPL", value: 692.28 },
      { name: "VPL", value: 415.37 },
      { name: "Control", value: 276.91 }
    ];
    const share = element("section", "tpl-box");
    const shareChart = dashboardChart(CHART_W, CHART_H, "Sell out Amount by Store Types", (svg, tooltip) => {
      // The 2px white separators cover 1px on each edge; widen the ring so the visible width stays 24px.
      drawPieChart(svg, tooltip, storeTypes, true, { radius: 101, inner: 75 });
      const total = svg.querySelector(".donut-total");
      if (total) total.textContent = "$1,384.56";
      cropDonut(svg);
    });
    shareChart.classList.add("tpl-donut");
    const shareBody = element("div", "tpl-donut-row");
    const shareLegend = chartLegend(
      storeTypes.map((item, i) => ({ name: item.name, color: CHART_COLORS[i], shape: "circle" }))
    );
    shareLegend.classList.add("is-vertical");
    shareBody.append(shareChart, shareLegend);
    share.append(dashboardSectionHead("Sell out Amount by Store Types"), shareBody);

    const donuts = element("div", "tpl-split-row");
    donuts.append(stock, share);
    const left = element("div", "tpl-stack");
    left.append(trend, donuts);

    const storeCards = element("div", "tpl-metric-row tpl-store-cards");
    [
      { title: "West Coast", value: "$ 262,327.23", yoy: "-4.5%", yoyDirection: "down" },
      { title: "Midwest", value: "$ 262,327.23", yoy: "0.5%", yoyDirection: "up" },
      { title: "Southeast", value: "19,234", yoy: "2.5%", yoyDirection: "up" }
    ].forEach((card) => storeCards.append(createMetricCard({ ...card, tone: "subtle", showLy: false })));

    const stores = element("section", "tpl-box tpl-stores");
    stores.append(
      dashboardSectionHead("Stores", createFilterTagGroup(["All", "PAD & VPL", "VPL", "Control"], "on-white is-solid")),
      storeCards,
      dashboardStoreTable(STORE_ROWS.length, 4, true)
    );

    const body = element("div", "tpl-split-row is-main");
    body.append(left, stores);

    page.append(templateHeader(), templateFilters({ variant: "filled" }), metrics, body);
    return page;
  }

  function drawDashboardLines(svg, tooltip, { categories, series, width, height }) {
    const axis = drawVerticalAxis(svg, { max: 5000, categories, rightMax: 100, width, height, format: kFormat, flush: true });
    const group = svgNode("g");
    const points = categories.map(() => []);
    const xs = categories.map((_, i) => axis.x(i));
    series.forEach((s) => {
      const ys = s.values.map((value) => axis.y(value));
      group.append(
        svgNode("path", {
          d: linePath(xs, ys),
          fill: "none",
          stroke: s.color,
          "stroke-width": 2,
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        })
      );
      drawPoints(group, points, xs, ys, s.color);
    });
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: categories.length,
      area: verticalArea(axis),
      title: (i) => categories[i],
      rows: (i) => series.map((s) => ({ color: s.color, shape: "circle", name: s.name, value: formatNumber(s.values[i]) })),
      guide: "line",
      onActive: highlightPoints(points)
    });
  }

  // Shared lower area of dashboards 3 and 4: two charts on the left, stores on the right.
  function dashboardTrendArea() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trend = element("section", "tpl-box");
    trend.append(
      dashboardSectionHead(
        "Sell out Unit",
        chartLegend([
          { name: "Actual", color: CHART_COLORS[0], shape: "square" },
          { name: "PY", color: CHART_COLORS[3], shape: "square" },
          { name: "Achv.% of Plan", color: CHART_COLORS[2], shape: "circle" }
        ])
      ),
      dashboardChart(900, 240, "Sell out Unit", (svg, tooltip) =>
        drawDashboardColumns(svg, tooltip, {
          categories: days,
          width: 900,
          height: 240,
          bars: [
            { name: "Actual", color: CHART_COLORS[0], values: [2800, 3100, 3200, 2800, 2800, 3100, 3100] },
            { name: "PY", color: CHART_COLORS[3], values: [3000, 3400, 3500, 3000, 3000, 3400, 3400] }
          ],
          line: { name: "Achv.% of Plan", color: CHART_COLORS[2], values: [18, 40, 42, 46, 64, 41, 62] }
        })
      )
    );

    const lineSeries = [
      { name: "PAD & VPL", color: CHART_COLORS[0], values: [2000, 3000, 1900, 2800, 2900, 3000, 4100] },
      { name: "VPL", color: CHART_COLORS[3], values: [4000, 3000, 4100, 3200, 3100, 3000, 1900] },
      { name: "Control", color: CHART_COLORS[2], values: [1300, 2400, 2500, 2700, 3500, 2500, 3400] }
    ];
    const stock = element("section", "tpl-box");
    stock.append(
      dashboardSectionHead(
        "In Stock Rate",
        chartLegend(lineSeries.map((s) => ({ name: s.name, color: s.color, shape: "circle" })))
      ),
      dashboardChart(900, 240, "In Stock Rate", (svg, tooltip) =>
        drawDashboardLines(svg, tooltip, { categories: days, series: lineSeries, width: 900, height: 240 })
      )
    );

    const left = element("div", "tpl-stack");
    left.append(trend, stock);
    const stores = element("section", "tpl-box tpl-stores");
    stores.append(
      dashboardSectionHead("Stores", createFilterTagGroup(["All", "PAD & VPL", "VPL", "Control"], "on-white is-solid")),
      dashboardStoreTable(STORE_ROWS.length, 5, true)
    );
    const body = element("div", "tpl-split-row");
    body.append(left, stores);
    return body;
  }

  function buildDashboardThree() {
    const page = element("div", "tpl-page");
    const info = { tooltipTitle: "Definition", tooltipText: "指标口径说明（示例）" };
    const groups = [
      {
        title: "Sell out",
        tone: "primary",
        cards: [
          { title: "Sell out Unit", value: "262,327" },
          { title: "Online Sell out Unit", value: "83,650", lyLabel: "CR" },
          { title: "Retail In-Store Sell out Unit", value: "198,000", lyLabel: "CR", yoy: "0.4%", yoyDirection: "down" }
        ]
      },
      {
        title: "Store",
        tone: "blue",
        cards: [
          { title: "Store Count", value: "1,045" },
          { title: "Average Sell out per Store", value: "251", lyLabel: "CR" }
        ]
      },
      {
        title: "Inventory",
        tone: "orange",
        cards: [
          { title: "In Stock Rate", value: "80.5%" },
          { title: "Weeks of Supply", value: "122", lyLabel: "CR" }
        ]
      }
    ];
    const overview = element("section", "tpl-box tpl-metric-groups");
    groups.forEach((group) => {
      const column = element("div", "tpl-metric-group");
      column.style.flexGrow = String(group.cards.length);
      const cards = element("div", "tpl-metric-row");
      cards.style.gridTemplateColumns = `repeat(${group.cards.length}, minmax(0, 1fr))`;
      group.cards.forEach((card) => cards.append(createMetricCard({ ...info, ...card, tone: group.tone })));
      column.append(element("h2", "tpl-box-title", group.title), cards);
      overview.append(column);
    });

    const tabs = templateTabs(["Core Overview", "Customer Performance", "Product Line"]);
    page.append(templateHeader(), templateFilters({ withWeek: true, variant: "filled" }), tabs, overview, dashboardTrendArea());
    return page;
  }

  function buildDashboardFour() {
    const page = element("div", "tpl-page");
    const overview = element("section", "tpl-box tpl-primary-secondary");
    const primary = element("div", "tpl-metric-row");
    DASHBOARD_METRICS.forEach((metric) => primary.append(createMetricCard({ ...metric, tone: "primary" })));

    const secondary = element("div", "tpl-secondary-row");
    [
      [
        { title: "In Stock Rate", value: "90.5%", yoy: ["12.5%", "up"], mom: ["12.5%", "up"] },
        { title: "Weeks of Supply", value: "123", yoy: ["12.5%", "up"], mom: ["2.5%", "down"] }
      ],
      [
        { title: "Store Count", value: "320", yoy: ["12.5%", "up"], mom: ["12.5%", "up"] },
        { title: "Number of Store without YoY", value: "120", yoy: ["12.5%", "up"], mom: ["2.5%", "down"] }
      ],
      [
        { title: "Mini-LED Sell out Unit", value: "57,394", yoy: ["8.5%", "down"], mom: ["12.5%", "up"] },
        { title: "65+ Sell out Unit", value: "29,435", yoy: ["8.5%", "down"], mom: ["12.5%", "up"] }
      ]
    ].forEach((items) => secondary.append(createSecondaryMetricList(items)));
    overview.append(primary, secondary);

    const filters = templateFilters({
      withWeek: true,
      variant: "filled",
      labels: ["Brand", "Product Line", "Size", "Model", "Key Model", "Store Type", "Store"]
    });
    page.append(templateHeader(), filters, overview, dashboardTrendArea());
    return page;
  }

  function buildDashboardTwo() {
    const page = element("div", "tpl-page");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const series = {
      "Sell out Unit": [
        [3000, 3400, 3400, 3000, 3400],
        [3600, 4000, 3600, 3600, 4000],
        [3200, 3600, 3800, 3200, 3600]
      ],
      "Sell out Amount": [
        [2600, 3100, 3900, 2800, 3500],
        [3300, 3700, 3200, 4100, 3800],
        [2900, 3300, 3500, 2700, 4200]
      ],
      "Mini-LED Sell out Unit": [
        [1800, 2200, 2500, 2100, 2700],
        [2400, 2600, 2300, 2900, 3100],
        [1500, 1900, 2100, 1700, 2300]
      ],
      "Key Product Sell out Unit": [
        [2200, 2700, 2900, 2500, 3100],
        [2800, 3200, 3000, 3400, 3600],
        [2000, 2400, 2600, 2200, 2800]
      ]
    };
    const names = ["Pad", "VPL", "Control"];
    const colors = [CHART_COLORS[0], CHART_COLORS[3], CHART_COLORS[1]];
    const barsFor = (metric) => series[metric].map((values, k) => ({ name: names[k], color: colors[k], values }));

    const overview = element("section", "tpl-box");
    const metrics = element("div", "tpl-metric-row");
    DASHBOARD_METRICS.forEach((metric) => metrics.append(createMetricCard({ ...metric, tone: "subtle" })));

    const chart = dashboardChart(1816, 300, "Sell out by store type", (svg, tooltip, metric = "Sell out Unit") =>
      drawDashboardColumns(svg, tooltip, { categories: days, width: 1816, height: 300, bars: barsFor(metric), barGap: 2 })
    );
    const switcher = createFilterTagGroup(Object.keys(series), "on-white is-solid");
    switcher.querySelectorAll(".filter-tag").forEach((tag) =>
      tag.addEventListener("click", () => chart._redraw(tag.textContent))
    );
    const chartHead = element("div", "tpl-box-head tpl-chart-head");
    chartHead.append(
      switcher,
      chartLegend(names.map((name, k) => ({ name, color: colors[k], shape: "square" })))
    );
    overview.append(metrics, chartHead, chart);

    const stores = element("section", "tpl-box");
    stores.append(
      dashboardSectionHead("Stores", createFilterTagGroup(["All", "PAD & VPL", "VPL", "Control"], "on-white is-compact")),
      dashboardStoreTable(5)
    );

    page.append(templateHeader(), templateFilters({ variant: "filled" }), overview, stores);
    return page;
  }

  function templateSceneSwitch() {
    const keys = Object.keys(TEMPLATE_SCENES);
    const group = createFilterTagGroup(keys.map((key) => TEMPLATE_SCENES[key]), "on-white template-scene-switch");
    group.querySelectorAll(".filter-tag").forEach((tag, index) => {
      const active = keys[index] === templateScene;
      tag.classList.toggle("is-active", active);
      tag.setAttribute("aria-pressed", String(active));
      tag.addEventListener("click", () => {
        if (keys[index] === templateScene) return;
        templateScene = keys[index];
        renderCurrentPage();
      });
    });
    return group;
  }

  function templateSceneNote() {
    if (templateScene === "regular") {
      return element("p", "template-scene-note", "页面背景色：#F2F3F5");
    }
    const note = element("p", "template-scene-note");
    const link = element("a", "template-scene-download", "下载页面背景");
    link.href = DIGITAL_STORE_BG;
    link.download = "digital-store-bg.png";
    note.append(link);
    return note;
  }

  function renderTemplateGallery(section) {
    const grid = element("div", "template-gallery");
    reportTemplates().forEach((template) => {
      const card = element("a", "template-card");
      card.href = `#${section.id}/${template.id}`;
      const thumb = element("div", "template-thumb");
      const frame = templateFrame(template.build(), true);
      frame.inert = true;
      thumb.append(frame);
      const body = element("div", "template-card-body");
      body.append(
        element("h2", "template-card-title", template.title),
        element("p", "template-card-summary", template.summary)
      );
      card.append(thumb, body);
      grid.append(card);
    });
    return grid;
  }

  function renderTemplateView(template, section) {
    const view = element("article", "page template-view");
    const bar = element("div", "template-view-bar");
    const back = element("a", "template-back");
    back.href = `#${section.id}`;
    back.setAttribute("aria-label", "返回页面模板");
    back.append(libraryIcon("chevron-left", 24), element("span", "", "返回"));
    bar.append(back, element("h1", "template-view-title", template.title));
    view.append(bar, templateFrame(template.build(), false));
    return view;
  }

  // Templates are laid out at TEMPLATE_WIDTH and scaled to fit their container.
  function templateFrame(content, isThumb) {
    const outer = element("div", `template-scale${isThumb ? " is-thumb" : ""}`);
    const inner = element("div", "template-canvas");
    inner.style.width = `${TEMPLATE_WIDTH}px`;
    if (templateScene === "digital") {
      content.style.background = `url("${DIGITAL_STORE_BG}") center top / cover no-repeat`;
    }
    inner.append(content);
    outer.append(inner);
    return outer;
  }

  // Tables marked .tpl-fill take the height left by their card and keep only whole rows that fit.
  function fillTables(root) {
    root.querySelectorAll(".tpl-fill").forEach((fill) => {
      const table = fill.querySelector("table");
      const rows = [...table.tBodies[0].rows];
      while (rows.length > 1 && table.offsetHeight > fill.clientHeight) rows.pop().remove();
    });
  }

  function fitTemplates(root) {
    fillTables(root);
    root.querySelectorAll(".template-scale").forEach((outer) => {
      const inner = outer.firstElementChild;
      let lastWidth = -1;
      const fit = () => {
        // Setting the height can toggle the page scrollbar, which changes the width again.
        // Only refit on real width changes so this cannot loop (the cause of the flicker).
        const width = outer.clientWidth;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        const scale = Math.min(width / TEMPLATE_WIDTH, 1);
        inner.style.transform = `scale(${scale})`;
        if (!outer.classList.contains("is-thumb")) {
          outer.style.height = `${inner.offsetHeight * scale}px`;
        }
      };
      fit();
      if (window.ResizeObserver) new ResizeObserver(fit).observe(outer);
    });
  }

  function templateHeader() {
    const header = element("header", "tpl-header");
    const brand = element("div", "tpl-brand");
    const logo = element("img", "tpl-logo");
    // build-standalone.mjs replaces this path with an inline data URL.
    logo.src = "../assets/logo.svg";
    logo.alt = "Hisense";
    brand.append(
      logo,
      element("span", "tpl-title", "Canada Sales Analysis")
    );
    const actions = element("div", "tpl-actions");
    [["info-question", "说明"], ["download", "导出"]].forEach(([icon, label]) => {
      const button = element("button", "tpl-icon-button");
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.append(libraryIcon(icon, 20));
      actions.append(button);
    });
    header.append(brand, actions);
    return header;
  }

  function templateFilters({
    withWeek = false,
    variant = "outline",
    labels = ["Brand", "Product Line", "Category", "Model", "Key Model", "Store Type", "Store"]
  } = {}) {
    const box = element("section", "tpl-box tpl-filters");
    let time = createFilterTagGroup(["WTD", "MTD", "YTD"], "on-white");
    if (withWeek) {
      time = createTimeCombo(["2026-WK6", "2026-WK7", "2026-WK8"], "2026-WK8");
    }
    box.append(
      labeledField("Time", time, "vertical"),
      ...labels.map(
        (label) => labeledField(label, createDropdown(["All", "Option A", "Option B"], "All", variant), "vertical")
      )
    );
    return box;
  }

  function templateTabs(labels = ["Headquarter", "Australia", "Mexico"]) {
    const list = element("div", "tabs-list tpl-tabs");
    list.setAttribute("role", "tablist");
    const tabs = labels.map((label, index) => {
      const tab = element("button", `tab${index === 0 ? " is-active" : ""}`, label);
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(index === 0));
      tab.addEventListener("click", () =>
        tabs.forEach((item) => {
          item.classList.toggle("is-active", item === tab);
          item.setAttribute("aria-selected", String(item === tab));
        })
      );
      return tab;
    });
    list.append(...tabs);
    return list;
  }

  function templateSection(title, className = "") {
    const box = element("section", `tpl-box ${className}`.trim());
    box.append(element("h2", "tpl-box-title", title));
    return box;
  }

  function templateChoiceRow(label, type, options, selected) {
    const row = element("div", "tpl-option-row");
    const group = element("div", "tpl-option-grid");
    const name = `tpl-${type}-${Math.random().toString(36).slice(2)}`;
    options.forEach((option) => {
      const item = element("label", "choice");
      item.title = option;
      const input = document.createElement("input");
      input.type = type;
      input.name = name;
      input.checked = selected.includes(option);
      item.append(input, choiceMark(type), element("span", "", option));
      group.append(item);
    });
    row.append(element("span", "tpl-option-label", label), group);
    return row;
  }

  function buildTemplateOne() {
    const page = element("div", "tpl-page");
    const settings = templateSection("Dimension & Metric");
    settings.append(
      templateChoiceRow("Currency", "radio", ["RMB", "USD", "LCC"], ["RMB"]),
      templateChoiceRow(
        "Dimension",
        "checkbox",
        ["All", "Month", "Week", "Brand", "Category", "Customer", "Store", "Store ID", "Store Type", "Model", "Size", "Product Age"],
        ["All", "Brand", "Category", "Store"]
      ),
      templateChoiceRow(
        "Metric",
        "checkbox",
        ["All", "Sell out Unit", "Sell out Amount", "In Stock Rate", "Online Sell out Unit", "Avg. Unit per Store", "WOS"],
        ["All", "Sell out Unit", "Sell out Amount"]
      )
    );
    const stores = templateSection("Stores");
    const scroll = element("div", "report-table-scroll");
    scroll.append(
      createReportTable([
        {
          name: "ATAG",
          total: ["4,261", "390"],
          categories: [{ name: "Display", lines: [["TV", "2,389", "210"], ["MP", "1,872", "180"]] }]
        }
      ])
    );
    stores.append(scroll);
    page.append(templateHeader(), templateFilters(), templateTabs(), settings, stores);
    return page;
  }

  function templatePillRow(label, rows, selected, unavailable = []) {
    const row = element("div", "tpl-option-row");
    const group = element("div", "tpl-pill-grid");
    const pills = rows.map((option) => {
      const pill = element("button", "tpl-pill", option);
      pill.type = "button";
      pill.title = option;
      const isUnavailable = unavailable.includes(option);
      if (isUnavailable) {
        pill.classList.add("is-unavailable");
        pill.tabIndex = -1;
      }
      const setActive = (active) => {
        pill.classList.toggle("is-active", active);
        pill.setAttribute("aria-pressed", String(active));
      };
      setActive(option === selected);
      if (!isUnavailable) {
        pill.addEventListener("click", () => pills.forEach((item) => item._set(item === pill)));
      }
      pill._set = (active) => !isUnavailable && setActive(active);
      return pill;
    });
    group.append(...pills);
    row.append(element("span", "tpl-option-label", label), group);
    return row;
  }

  function buildTemplateTwo() {
    const page = element("div", "tpl-page");
    const dimensions = [
      "Year", "Month", "Week", "Brand", "Product Line", "Customer", "Series", "Mini-LED", "Tech", "OS",
      "Size", "Model", "Product Age", "Store ID", "Store Type", "Store Type 1", "Region"
    ];
    const settings = templateSection("Dimension & Metric");
    settings.append(
      templatePillRow("Row", dimensions, "Year"),
      templatePillRow("Column", dimensions, "Brand", ["Year"]),
      templatePillRow(
        "Metric",
        ["Sell out Unit", "Online Sell out Unit", "Retail In-Store SO Unit", "Store Count", "Avg. Unit per Store", "In Stock Rate", "WOS", "Store Available", "Store Total"],
        "Sell out Unit"
      )
    );

    const stores = templateSection("Stores", "tpl-stores");
    const table = element("table", "report-table tpl-flat-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Region", "Store", "Sell out Unit", "Sell out Amount ($)", "In Stock Rate"].forEach((label) => {
      const th = element("th", "", label);
      th.scope = "col";
      headRow.append(th);
    });
    head.append(headRow);
    const body = document.createElement("tbody");
    // All sample rows; fillTables keeps only the whole rows that fit the card.
    STORE_ROWS.forEach((cells) => {
      const row = document.createElement("tr");
      cells.forEach((value, index) => row.append(element("td", index > 1 ? "table-number" : "", value)));
      body.append(row);
    });
    table.append(head, body);
    const scroll = element("div", "report-table-scroll tpl-flat-scroll");
    scroll.append(table);
    const fill = element("div", "tpl-fill");
    fill.append(scroll);
    stores.append(fill);

    // Last card stretches to the page bottom, which keeps the 32px page margin.
    page.classList.add("is-fill-last");
    page.append(templateHeader(), templateFilters(), settings, stores);
    return page;
  }

  function renderBlocks(blocks) {
    return blocks.map((block) => {
      if (block.type === "cards") {
        const grid = element("div", "card-grid");
        grid.append(
          ...block.items.map((item) => {
            const card = element("article", "card");
            card.append(
              element("h2", "", item.title),
              element("p", "", item.content)
            );
            return card;
          })
        );
        return grid;
      }

      const wrapper = element(
        "section",
        `block ${block.type === "notice" ? "notice" : ""}`
      );
      if (block.title) wrapper.append(element("h2", "", block.title));
      wrapper.append(element("p", "", block.content));
      return wrapper;
    });
  }

  function renderColorPalettes() {
    const wrapper = element("div", "palette-list");

    (catalog.colorPalettes || []).forEach((palette) => {
      const section = element("section", "palette-section");
      const header = element("div", "palette-header");
      header.append(element("h2", "", palette.name));

      const scroller = element("div", "palette-scroll");
      const track = element("div", "palette-track");
      palette.colors.forEach((color) => {
        const swatch = element("button", "color-swatch");
        swatch.type = "button";
        swatch.style.backgroundColor = color.hex;
        swatch.style.color = readableTextColor(color.hex);
        swatch.setAttribute("aria-label", `Copy ${color.name} ${color.hex}`);
        swatch.title = `Copy ${color.hex}`;
        swatch.append(
          element("span", "color-name", color.name),
          element("span", "color-hex", color.hex)
        );
        swatch.addEventListener("click", async () => {
          const copied = await copyText(color.hex);
          showToast(copied ? `Copied ${color.hex}` : "Copy failed");
        });
        track.append(swatch);
      });
      scroller.append(track);
      section.append(header, scroller);
      wrapper.append(section);
    });

    return wrapper;
  }

  function readableTextColor(hex) {
    const channels = hex
      .replace("#", "")
      .match(/.{2}/g)
      .map((value) => Number.parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.03928
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4
      );
    const luminance =
      0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    return luminance > 0.42 ? "#1D2129" : "#FFFFFF";
  }

  function renderTypography() {
    const typography = catalog.typography;
    const wrapper = element("div", "typography-content");

    const familySection = element("section", "type-section");
    familySection.append(element("h2", "section-title", "Font Families"));
    const fontGrid = element("div", "font-family-grid");
    typography.fonts.forEach((font) => {
      const card = element("article", "font-family-card");
      const familyName = element("strong", "font-family-name", font.family);
      familyName.style.fontFamily = previewFontFamily(font.language);
      card.append(element("span", "font-language", font.language), familyName);
      fontGrid.append(card);
    });
    const weightNote = element(
      "p",
      "type-note",
      "UI text: Regular 400 · Medium 500 · Bold 700 · Primary data: DIN PRO Bold 700 only"
    );
    familySection.append(fontGrid, weightNote);

    const scaleSection = element("section", "type-section");
    const scaleHeader = element("div", "type-scale-header");
    scaleHeader.append(element("h2", "section-title", "Type Scale"));
    const modeSwitch = element("div", "language-switch");
    modeSwitch.setAttribute("aria-label", "Preview type");
    const modes = [
      ["zh", "中文"],
      ["en", "English"],
      ["data", "Data"]
    ];
    const buttons = new Map();
    modes.forEach(([mode, label]) => {
      const control = element("button", "language-button", label);
      control.type = "button";
      control.addEventListener("click", () => setMode(mode));
      buttons.set(mode, control);
      modeSwitch.append(control);
    });
    scaleHeader.append(modeSwitch);

    const tableScroll = element("div", "type-table-scroll");
    const table = element("table", "type-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Font Size", "Weight", "Type", "Usage"].forEach((label) =>
      headRow.append(element("th", "", label))
    );
    head.append(headRow);
    const body = document.createElement("tbody");
    table.append(head, body);
    tableScroll.append(table);
    scaleSection.append(scaleHeader, tableScroll);

    const colorSections = (typography.colorGroups || []).map(
      renderTextColorGroup
    );
    wrapper.append(familySection, scaleSection, ...colorSections);

    function setMode(mode) {
      buttons.forEach((control, key) =>
        control.setAttribute("aria-pressed", String(key === mode))
      );
      renderTypeRows(body, typography, mode);
    }

    const requestedMode = new URLSearchParams(window.location.search).get("type");
    setMode(buttons.has(requestedMode) ? requestedMode : "zh");
    return wrapper;
  }

  function renderTypeRows(body, typography, mode) {
    const dataMode = mode === "data";
    const styles = dataMode
      ? typography.primaryDataStyles || []
      : typography.styles || [];
    const rows = styles.map((style) => {
      const row = document.createElement("tr");
      const size = element("td", "type-size", `${style.size}px`);
      const weight = element("td", "", style.weight);
      const type = element("td", "type-cell");
      const typeName = element("strong", "type-name", style.type);
      const sampleText = dataMode ? style.sample : style.samples[mode];
      const sample = element(
        "span",
        `type-sample${dataMode ? " primary-data-sample" : ""}`,
        sampleText
      );
      sample.style.fontFamily = dataMode
        ? previewFontFamily("Primary Data")
        : previewFontFamily(mode === "zh" ? "Chinese" : "English");
      sample.style.fontSize = `${style.size}px`;
      sample.style.lineHeight = `${style.lineHeight}px`;
      sample.style.fontWeight = String(style.weightValue);
      sample.style.fontSynthesis = "none";
      type.append(typeName, sample);
      const usage = element("td", "type-usage", style.usage);
      row.append(size, weight, type, usage);
      return row;
    });
    body.replaceChildren(...rows);
  }

  function previewFontFamily(type) {
    if (type === "Chinese") {
      return '"Report CN", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
    }
    if (type === "Primary Data") {
      return '"Report Data", "Report Inter", "Report CN", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
    }
    return '"Report Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
  }

  function renderTextColorGroup(group) {
    const section = element("section", "type-section text-color-section");
    section.append(element("h2", "section-title", group.title));
    const scroller = element("div", "palette-scroll");
    const track = element("div", "palette-track semantic-color-track");
    track.style.gridTemplateColumns = `repeat(${group.colors.length}, minmax(160px, 1fr))`;
    track.style.minWidth = `${group.colors.length * 160}px`;

    group.colors.forEach((color) => {
      const swatch = element("button", "color-swatch semantic-color-swatch");
      swatch.type = "button";
      swatch.style.backgroundColor = color.hex;
      swatch.style.color = readableTextColor(color.hex);
      swatch.setAttribute("aria-label", `Copy ${color.name} ${color.hex}`);
      swatch.title = `Copy ${color.hex}`;
      swatch.append(
        element("span", "color-name", color.name),
        element("span", "color-usage", color.usage),
        element("span", "color-hex", color.hex)
      );
      swatch.addEventListener("click", async () => {
        const copied = await copyText(color.hex);
        showToast(copied ? `Copied ${color.hex}` : "Copy failed");
      });
      track.append(swatch);
    });

    scroller.append(track);
    section.append(scroller);
    return section;
  }

  /* ---------- Charts (constants are declared at the top of this file) ---------- */

  function renderChartsDocumentation() {
    const wrapper = element("div", "component-doc chart-doc");

    const axis = componentSection("Axis");
    const axisGrid = element("div", "chart-grid");
    axisGrid.append(
      chartCard("Vertical · 柱状图 / 折线图", null, (svg) =>
        drawVerticalAxis(svg, { max: 5000, categories: WEEKS, rightMax: 100 })
      ),
      chartCard("Horizontal · 横向条形图", null, (svg) =>
        drawHorizontalAxis(svg, { max: 5000, categories: REGIONS })
      )
    );
    axis.body.append(
      axisGrid,
      createSpecTable(
        ["Element", "Color", "Typography / Width"],
        [
          ["Category Label（柱状 X 轴 / 条形 Y 轴）", "#4E5969", "12px / Regular"],
          ["Value Label（柱状 Y 轴与右侧 % 轴 / 条形 X 轴）", "#86909C", "12px / Regular"],
          ["Baseline（数值 0 处轴线）", "#E5E6EB", "1px"],
          ["Gridline（常规刻度线）", "#F2F3F5", "1px"]
        ],
        1
      )
    );

    const colors = componentSection("Chart Colors");
    const paletteRow = (palette) => {
      const colorRow = element("div", "chart-color-row");
      palette.forEach((hex, index) => {
      const swatch = element("button", "chart-color-swatch");
      swatch.type = "button";
      swatch.setAttribute("aria-label", `Copy chart color ${index + 1} ${hex}`);
      const chip = element("span", "chart-color-chip");
      chip.style.background = hex;
      swatch.append(
        chip,
        element("span", "chart-color-order", String(index + 1)),
        element("span", "chart-color-hex", hex)
      );
      swatch.addEventListener("click", async () => {
        showToast((await copyText(hex)) ? `Copied ${hex}` : "Copy failed");
      });
      colorRow.append(swatch);
      });
      return colorRow;
    };
    colors.body.append(
      element("p", "chart-note", "按 1 → 12 的顺序给数据系列取色，不跳色；同一图表只使用一组配色。点击色块复制 HEX。"),
      element("h3", "chart-palette-title", "配色一"),
      paletteRow(CHART_COLORS),
      element("h3", "chart-palette-title", "配色二"),
      paletteRow(CHART_COLORS_LIGHT)
    );

    const legend = componentSection("Legend");
    const legendGrid = element("div", "dropdown-state-grid chart-legend-specs");
    [
      ["Circle · 折线 / 环形", "circle", "8px · 圆形"],
      ["Square · 柱状 / 条形", "square", "8px · 2px 圆角"]
    ].forEach(([title, shape, size]) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", title));
      const preview = element("div", "state-control-preview chart-legend-preview");
      preview.append(chartLegend([{ name: "Text", color: CHART_COLORS[0], shape }]));
      const specs = element("dl", "dropdown-state-specs");
      [
        ["Marker", size],
        ["Marker Color", "按图表色板顺序"],
        ["Text", "#4E5969 · 12px / Regular"],
        ["Marker Gap / Item Gap", "6px / 16px"]
      ].forEach(([term, value]) => {
        const row = element("div", "state-spec-row");
        row.append(element("dt", "", term), element("dd", "", value));
        specs.append(row);
      });
      card.append(preview, specs);
      legendGrid.append(card);
    });
    legend.body.append(legendGrid);

    const hover = componentSection("Hover Tooltip");
    hover.body.append(
      element("p", "chart-note", "鼠标悬停时显示该类目或扇区的详细数据。下方所有图表均可悬停查看。"),
      createSpecTable(
        ["Element", "Color", "Typography / Value"],
        [
          ["Tooltip Background", "#FFFFFF", "6px 圆角 · 阴影 0 4px 16px rgba(29,33,41,0.14)"],
          ["Title", "#1D2129", "12px / Medium"],
          ["Series Name", "#4E5969", "12px / Regular"],
          ["Value", "#1D2129", "12px / Medium"],
          ["Bar Hover Band", "#1D2129", "4% 透明度，覆盖整个类目"],
          ["Line Guide", "#C9CDD4", "1px 虚线"]
        ],
        1
      )
    );

    const gallery = componentSection("Chart Types");
    const galleryGrid = element("div", "chart-grid");
    const squares = (series) =>
      series.map((s, k) => ({ name: s.name, color: CHART_COLORS[k], shape: "square" }));
    const circles = (items) =>
      items.map((s, k) => ({ name: s.name, color: CHART_COLORS[k], shape: "circle" }));
    galleryGrid.append(
      chartCard("簇状柱状图 · Clustered Column", squares(COLUMN_SERIES), (svg, tip) =>
        drawClusteredColumn(svg, tip, COLUMN_SERIES)
      ),
      chartCard("堆积柱状图 · Stacked Column", squares(STACKED_COLUMN_SERIES), (svg, tip) =>
        drawStackedColumn(svg, tip, STACKED_COLUMN_SERIES)
      ),
      chartCard("横向条形图 · Bar", squares(BAR_SERIES), (svg, tip) =>
        drawHorizontalBars(svg, tip, BAR_SERIES)
      ),
      chartCard("横向堆叠条形图 · Stacked Bar", squares(STACKED_BAR_SERIES), (svg, tip) =>
        drawHorizontalBars(svg, tip, STACKED_BAR_SERIES)
      ),
      chartCard("折线图 · Line", circles(COLUMN_SERIES), (svg, tip) =>
        drawLineChart(svg, tip, COLUMN_SERIES)
      ),
      chartCard(
        "组合图 · Column + Line",
        [
          { name: COLUMN_SERIES[0].name, color: CHART_COLORS[0], shape: "square" },
          { name: RATE_SERIES.name, color: CHART_COLORS[1], shape: "circle" }
        ],
        (svg, tip) => drawComboChart(svg, tip, COLUMN_SERIES[0], RATE_SERIES)
      ),
      chartCard("环形图 · Donut", circles(CHANNEL_SHARE), (svg, tip) =>
        drawPieChart(svg, tip, CHANNEL_SHARE, true)
      ),
      chartCard(
        "单色环形图 · Single Donut",
        [{ name: SINGLE_RATE.name, color: CHART_COLORS[0], shape: "circle" }],
        (svg, tip) => drawSingleDonut(svg, tip, SINGLE_RATE)
      )
    );
    gallery.body.append(galleryGrid);

    wrapper.append(
      axis.section,
      colors.section,
      legend.section,
      hover.section,
      gallery.section
    );
    return wrapper;
  }

  function svgNode(tag, attrs = {}, text) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function formatNumber(value) {
    return Number(value).toLocaleString("en-US");
  }

  function chartLegend(items) {
    const row = element("div", "chart-legend");
    items.forEach((item) => {
      const node = element("span", "chart-legend-item");
      node.append(legendMarker(item.color, item.shape), element("span", "", item.name));
      row.append(node);
    });
    return row;
  }

  function legendMarker(color, shape) {
    const marker = element("span", `legend-marker is-${shape}`);
    marker.style.background = color;
    marker.setAttribute("aria-hidden", "true");
    return marker;
  }

  function chartCard(title, legendItems, draw) {
    const card = demoCard(title);
    const body = element("div", "chart-card-body");
    if (legendItems) body.append(chartLegend(legendItems));
    const stage = element("div", "chart-stage");
    const svg = svgNode("svg", {
      class: "chart-svg",
      viewBox: `0 0 ${CHART_W} ${CHART_H}`,
      role: "img",
      "aria-label": title
    });
    const tooltipNode = element("div", "chart-tooltip");
    tooltipNode.hidden = true;
    stage.append(svg, tooltipNode);
    draw(svg, createChartTooltip(stage, tooltipNode));
    body.append(stage);
    card.append(body);
    return card;
  }

  function createChartTooltip(stage, node) {
    return {
      show(event, title, rows) {
        const rowNodes = rows.map((row) => {
          const item = element("div", `chart-tooltip-row${row.total ? " is-total" : ""}`);
          if (row.color) item.append(legendMarker(row.color, row.shape));
          item.append(
            element("span", "chart-tooltip-name", row.name),
            element("span", "chart-tooltip-value", row.value)
          );
          return item;
        });
        node.replaceChildren(element("div", "chart-tooltip-title", title), ...rowNodes);
        node.hidden = false;
        const box = stage.getBoundingClientRect();
        let x = event.clientX - box.left + 14;
        let y = event.clientY - box.top + 14;
        if (x + node.offsetWidth > box.width) x = event.clientX - box.left - node.offsetWidth - 14;
        if (y + node.offsetHeight > box.height) y = Math.max(0, box.height - node.offsetHeight);
        node.style.left = `${Math.max(0, x)}px`;
        node.style.top = `${y}px`;
      },
      hide() {
        node.hidden = true;
      }
    };
  }

  // flush: axis labels sit on the chart edge so the container padding (20px) is the only margin.
  function drawVerticalAxis(svg, { max, categories, ticks = 5, rightMax, width = CHART_W, height = CHART_H, format = formatNumber, flush = false }) {
    const left = flush ? 24 : 44;
    const right = rightMax ? (flush ? 36 : 40) : flush ? 0 : 12;
    const top = 12;
    const bottom = 28;
    const plotW = width - left - right;
    const plotH = height - top - bottom;
    const baseY = top + plotH;
    const group = svgNode("g", { class: "chart-axis" });

    for (let i = 0; i <= ticks; i += 1) {
      const y = top + plotH * (1 - i / ticks);
      group.append(
        svgNode("line", {
          x1: left,
          x2: left + plotW,
          y1: y,
          y2: y,
          stroke: i === 0 ? "#E5E6EB" : "#F2F3F5",
          "stroke-width": 1,
          "shape-rendering": "crispEdges"
        }),
        svgNode(
          "text",
          { x: left - 8, y, "text-anchor": "end", "dominant-baseline": "middle", class: "axis-value" },
          format((max / ticks) * i)
        )
      );
      if (rightMax) {
        group.append(
          svgNode(
            "text",
            { x: left + plotW + 8, y, "dominant-baseline": "middle", class: "axis-value" },
            `${(rightMax / ticks) * i}%`
          )
        );
      }
    }

    const band = plotW / categories.length;
    categories.forEach((category, i) => {
      group.append(
        svgNode(
          "text",
          { x: left + band * (i + 0.5), y: baseY + 18, "text-anchor": "middle", class: "axis-category" },
          category
        )
      );
    });
    svg.append(group);

    return {
      left,
      top,
      plotW,
      plotH,
      baseY,
      band,
      x: (i) => left + band * (i + 0.5),
      y: (value) => baseY - (value / max) * plotH,
      yRight: (value) => baseY - (value / rightMax) * plotH
    };
  }

  function drawHorizontalAxis(svg, { max, categories, ticks = 5 }) {
    const left = 72;
    const right = 16;
    const top = 8;
    const bottom = 28;
    const plotW = CHART_W - left - right;
    const plotH = CHART_H - top - bottom;
    const group = svgNode("g", { class: "chart-axis" });

    for (let i = 0; i <= ticks; i += 1) {
      const x = left + plotW * (i / ticks);
      group.append(
        svgNode("line", {
          x1: x,
          x2: x,
          y1: top,
          y2: top + plotH,
          stroke: i === 0 ? "#E5E6EB" : "#F2F3F5",
          "stroke-width": 1,
          "shape-rendering": "crispEdges"
        }),
        svgNode(
          "text",
          { x, y: top + plotH + 18, "text-anchor": "middle", class: "axis-value" },
          formatNumber((max / ticks) * i)
        )
      );
    }

    const band = plotH / categories.length;
    categories.forEach((category, i) => {
      group.append(
        svgNode(
          "text",
          { x: left - 8, y: top + band * (i + 0.5), "text-anchor": "end", "dominant-baseline": "middle", class: "axis-category" },
          category
        )
      );
    });
    svg.append(group);

    return {
      left,
      top,
      plotW,
      plotH,
      band,
      x: (value) => left + (value / max) * plotW,
      y: (i) => top + band * (i + 0.5)
    };
  }

  function barPath(x, y, w, h, r, direction = "up") {
    if (w <= 0 || h <= 0) return "";
    if (direction === "up") {
      const radius = Math.min(r, w / 2, h);
      return `M${x} ${y + h}V${y + radius}Q${x} ${y} ${x + radius} ${y}H${x + w - radius}Q${x + w} ${y} ${x + w} ${y + radius}V${y + h}Z`;
    }
    const radius = Math.min(r, h / 2, w);
    return `M${x} ${y}H${x + w - radius}Q${x + w} ${y} ${x + w} ${y + radius}V${y + h - radius}Q${x + w} ${y + h} ${x + w - radius} ${y + h}H${x}Z`;
  }

  function addCategoryHover(svg, tooltip, { count, area, title, rows, guide = "band", onActive }) {
    const indicator =
      guide === "line"
        ? svgNode("line", { class: "chart-guide-line" })
        : svgNode("rect", { class: "chart-hover-band" });
    indicator.style.display = "none";
    svg.insertBefore(indicator, svg.childNodes[1] || null);

    const layer = svgNode("g", { class: "chart-hit-layer" });
    for (let i = 0; i < count; i += 1) {
      const a = area(i);
      const hit = svgNode("rect", { x: a.x, y: a.y, width: a.w, height: a.h, fill: "transparent" });
      hit.addEventListener("mousemove", (event) => {
        if (guide === "line") {
          const cx = a.x + a.w / 2;
          ["x1", "x2"].forEach((key) => indicator.setAttribute(key, cx));
          indicator.setAttribute("y1", a.y);
          indicator.setAttribute("y2", a.y + a.h);
        } else {
          indicator.setAttribute("x", a.x);
          indicator.setAttribute("y", a.y);
          indicator.setAttribute("width", a.w);
          indicator.setAttribute("height", a.h);
        }
        indicator.style.display = "";
        if (onActive) onActive(i);
        tooltip.show(event, title(i), rows(i));
      });
      hit.addEventListener("mouseleave", () => {
        indicator.style.display = "none";
        if (onActive) onActive(null);
        tooltip.hide();
      });
      layer.append(hit);
    }
    svg.append(layer);
  }

  function seriesRows(series, i, shape, withTotal = false) {
    const rows = series.map((s, k) => ({
      color: CHART_COLORS[k],
      shape,
      name: s.name,
      value: formatNumber(s.values[i])
    }));
    if (withTotal) {
      const total = series.reduce((sum, s) => sum + s.values[i], 0);
      rows.push({ name: "Total", value: formatNumber(total), total: true });
    }
    return rows;
  }

  function verticalArea(axis) {
    return (i) => ({ x: axis.left + axis.band * i, y: axis.top, w: axis.band, h: axis.plotH });
  }

  function drawClusteredColumn(svg, tooltip, series) {
    const weeks = WEEKS.slice(0, 4);
    const axis = drawVerticalAxis(svg, { max: 5000, categories: weeks });
    const gap = 2;
    const barW = 16;
    const groupW = barW * series.length + gap * (series.length - 1);
    const group = svgNode("g");
    weeks.forEach((_, i) => {
      const x0 = axis.x(i) - groupW / 2;
      series.forEach((s, k) => {
        const y = axis.y(s.values[i]);
        group.append(
          svgNode("path", {
            d: barPath(x0 + k * (barW + gap), y, barW, axis.baseY - y, 2),
            fill: CHART_COLORS[k]
          })
        );
      });
    });
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: weeks.length,
      area: verticalArea(axis),
      title: (i) => weeks[i],
      rows: (i) => seriesRows(series, i, "square")
    });
  }

  function drawStackedColumn(svg, tooltip, series) {
    const axis = drawVerticalAxis(svg, { max: 5000, categories: WEEKS });
    const barW = 16;
    const group = svgNode("g");
    WEEKS.forEach((_, i) => {
      let accumulated = 0;
      series.forEach((s, k) => {
        const yTop = axis.y(accumulated + s.values[i]);
        const yBottom = axis.y(accumulated);
        group.append(
          svgNode("path", {
            d: barPath(axis.x(i) - barW / 2, yTop, barW, yBottom - yTop, k === series.length - 1 ? 2 : 0),
            fill: CHART_COLORS[k]
          })
        );
        accumulated += s.values[i];
      });
    });
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: WEEKS.length,
      area: verticalArea(axis),
      title: (i) => WEEKS[i],
      rows: (i) => seriesRows(series, i, "square", true)
    });
  }

  function drawHorizontalBars(svg, tooltip, series) {
    const axis = drawHorizontalAxis(svg, { max: 5000, categories: REGIONS });
    const barH = 16;
    const group = svgNode("g");
    REGIONS.forEach((_, i) => {
      let accumulated = 0;
      series.forEach((s, k) => {
        const x0 = axis.x(accumulated);
        const x1 = axis.x(accumulated + s.values[i]);
        group.append(
          svgNode("path", {
            d: barPath(x0, axis.y(i) - barH / 2, x1 - x0, barH, k === series.length - 1 ? 2 : 0, "right"),
            fill: CHART_COLORS[k]
          })
        );
        accumulated += s.values[i];
      });
    });
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: REGIONS.length,
      area: (i) => ({ x: axis.left, y: axis.top + axis.band * i, w: axis.plotW, h: axis.band }),
      title: (i) => REGIONS[i],
      rows: (i) => seriesRows(series, i, "square", series.length > 1)
    });
  }

  function drawPoints(group, points, xs, ys, color) {
    xs.forEach((x, i) => {
      const point = svgNode("circle", { cx: x, cy: ys[i], r: 4, fill: color, stroke: "#FFFFFF", "stroke-width": 1.5 });
      points[i].push(point);
      group.append(point);
    });
  }

  function linePath(xs, ys) {
    return xs.map((x, i) => `${i ? "L" : "M"}${x} ${ys[i]}`).join("");
  }

  function highlightPoints(points) {
    return (active) =>
      points.forEach((list, i) =>
        list.forEach((point) => point.setAttribute("r", i === active ? 5.5 : 4))
      );
  }

  function drawLineChart(svg, tooltip, series) {
    const axis = drawVerticalAxis(svg, { max: 5000, categories: WEEKS });
    const group = svgNode("g");
    const points = WEEKS.map(() => []);
    const xs = WEEKS.map((_, i) => axis.x(i));
    series.forEach((s, k) => {
      const ys = s.values.map((value) => axis.y(value));
      group.append(
        svgNode("path", {
          d: linePath(xs, ys),
          fill: "none",
          stroke: CHART_COLORS[k],
          "stroke-width": 2,
          "stroke-linejoin": "round",
          "stroke-linecap": "round"
        })
      );
      drawPoints(group, points, xs, ys, CHART_COLORS[k]);
    });
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: WEEKS.length,
      area: verticalArea(axis),
      title: (i) => WEEKS[i],
      rows: (i) => seriesRows(series, i, "circle"),
      guide: "line",
      onActive: highlightPoints(points)
    });
  }

  function drawComboChart(svg, tooltip, bars, rate) {
    const axis = drawVerticalAxis(svg, { max: 5000, categories: WEEKS, rightMax: 100 });
    const group = svgNode("g");
    const barW = 16;
    WEEKS.forEach((_, i) => {
      const y = axis.y(bars.values[i]);
      group.append(
        svgNode("path", {
          d: barPath(axis.x(i) - barW / 2, y, barW, axis.baseY - y, 2),
          fill: CHART_COLORS[0]
        })
      );
    });
    const points = WEEKS.map(() => []);
    const xs = WEEKS.map((_, i) => axis.x(i));
    const ys = rate.values.map((value) => axis.yRight(value));
    group.append(
      svgNode("path", {
        d: linePath(xs, ys),
        fill: "none",
        stroke: CHART_COLORS[1],
        "stroke-width": 2,
        "stroke-linejoin": "round",
        "stroke-linecap": "round"
      })
    );
    drawPoints(group, points, xs, ys, CHART_COLORS[1]);
    svg.append(group);
    addCategoryHover(svg, tooltip, {
      count: WEEKS.length,
      area: verticalArea(axis),
      title: (i) => WEEKS[i],
      rows: (i) => [
        { color: CHART_COLORS[0], shape: "square", name: bars.name, value: formatNumber(bars.values[i]) },
        { color: CHART_COLORS[1], shape: "circle", name: rate.name, value: `${rate.values[i]}%` }
      ],
      onActive: highlightPoints(points)
    });
  }

  function arcPath(cx, cy, r, r0, a0, a1) {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const point = (radius, angle) => [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
    const [x0, y0] = point(r, a0);
    const [x1, y1] = point(r, a1);
    if (!r0) return `M${cx} ${cy}L${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}Z`;
    const [x2, y2] = point(r0, a1);
    const [x3, y3] = point(r0, a0);
    return `M${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
  }

  function drawPieChart(svg, tooltip, data, donut, { radius = 100, inner = donut ? 76 : 0 } = {}) {
    const cx = CHART_W / 2;
    const cy = CHART_H / 2;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const group = svgNode("g");
    let start = 0;
    data.forEach((item, i) => {
      const end = start + (item.value / total) * Math.PI * 2;
      const middle = (start + end) / 2;
      const slice = svgNode("path", {
        d: arcPath(cx, cy, radius, inner, start, end),
        fill: CHART_COLORS[i],
        stroke: "#FFFFFF",
        "stroke-width": 2,
        class: "chart-slice"
      });
      const offset = `translate(${(Math.sin(middle) * 6).toFixed(2)} ${(-Math.cos(middle) * 6).toFixed(2)})`;
      const share = `${((item.value / total) * 100).toFixed(1)}%`;
      slice.addEventListener("mousemove", (event) => {
        slice.setAttribute("transform", offset);
        tooltip.show(event, item.name, [
          { color: CHART_COLORS[i], shape: "circle", name: "Value", value: formatNumber(item.value) },
          { name: "Share", value: share }
        ]);
      });
      slice.addEventListener("mouseleave", () => {
        slice.removeAttribute("transform");
        tooltip.hide();
      });
      group.append(slice);
      start = end;
    });
    svg.append(group);
    if (donut) {
      svg.append(
        svgNode("text", { x: cx, y: cy - 4, "text-anchor": "middle", class: "donut-total" }, formatNumber(total)),
        svgNode("text", { x: cx, y: cy + 16, "text-anchor": "middle", class: "axis-value" }, "Total")
      );
    }
  }

  function drawSingleDonut(svg, tooltip, metric) {
    const cx = CHART_W / 2;
    const cy = CHART_H / 2;
    const radius = 100;
    const inner = 76;
    const color = CHART_COLORS[0];
    const share = Math.min(Math.max(metric.value, 0), 100) / 100;
    const group = svgNode("g", { class: "chart-single-donut" });
    const track = svgNode("circle", {
      cx,
      cy,
      r: (radius + inner) / 2,
      fill: "none",
      stroke: "#F2F3F5",
      "stroke-width": radius - inner
    });
    group.append(track);
    if (share > 0) {
      const end = share >= 1 ? Math.PI * 2 - 0.0001 : share * Math.PI * 2;
      group.append(
        svgNode("path", { d: arcPath(cx, cy, radius, inner, 0, end), fill: color, class: "chart-slice" })
      );
    }
    const rows = [
      { color, shape: "circle", name: "Value", value: `${metric.value}%` },
      { name: "Remaining", value: `${100 - metric.value}%` }
    ];
    group.addEventListener("mousemove", (event) => tooltip.show(event, metric.name, rows));
    group.addEventListener("mouseleave", () => tooltip.hide());
    svg.append(
      group,
      svgNode("text", { x: cx, y: cy - 4, "text-anchor": "middle", class: "donut-total" }, `${metric.value}%`),
      svgNode("text", { x: cx, y: cy + 16, "text-anchor": "middle", class: "axis-value" }, metric.name)
    );
  }

  function renderDataTableDocumentation() {
    const wrapper = element("div", "component-doc table-doc combined-component-doc");
    const basic = componentFamily("Basic Table · 明细表");
    const report = componentFamily("Report Table · 报表");

    const demo = componentSection("Example", "", 3);
    const preview = element("div", "table-preview");
    const scroller = element("div", "data-table-scroll");
    scroller.append(createDataTable());
    preview.append(scroller);
    demo.body.append(preview);

    const colors = componentSection("Colors & Typography", "", 3);
    colors.body.append(
      createSpecTable(
        ["Element", "Color", "Typography"],
        [
          ["Header Background", "#E0F2F5", "—"],
          ["Header Text", "#4E5969", "14px / Regular"],
          ["Row Background (Odd)", "#FFFFFF", "—"],
          ["Row Background (Even)", "#F7F8FA", "—"],
          ["Cell Text", "#1D2129", "14px / Regular"],
          ["Clickable Text", "#00AAA6", "14px / Regular"]
        ],
        1
      )
    );

    const clickable = componentSection("Clickable Cell", "", 3);
    const grid = element("div", "dropdown-state-grid table-link-states");
    [
      { name: "Default", className: "", text: "#00AAA6", decoration: "None" },
      { name: "Hover", className: "is-hover", text: "#009093", decoration: "Underline" }
    ].forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", state.name));
      const sample = element("div", "state-control-preview table-link-preview");
      sample.append(
        element("span", `table-link ${state.className}`.trim(), "Chicago Store")
      );
      const specs = element("dl", "dropdown-state-specs");
      [
        ["Text", state.text],
        ["Decoration", state.decoration],
        ["Typography", "14px / Regular"],
        ["Cursor", "Pointer"]
      ].forEach(([term, value]) => {
        const row = element("div", "state-spec-row");
        row.append(element("dt", "", term), element("dd", "", value));
        specs.append(row);
      });
      card.append(sample, specs);
      grid.append(card);
    });
    clickable.body.append(grid);

    basic.body.append(demo.section, colors.section, clickable.section);

    const reportDemo = componentSection("Example", "", 3);
    const reportPreview = element("div", "table-preview");
    const reportScroller = element("div", "report-table-scroll");
    reportScroller.append(createReportTable());
    reportPreview.append(reportScroller);
    reportDemo.body.append(reportPreview);

    const reportSpecs = componentSection("Colors & Typography", "", 3);
    reportSpecs.body.append(
      createSpecTable(
        ["Element", "Color", "Typography"],
        [
          ["Header Background", "#00AAA6", "—"],
          ["Header Text", "#FFFFFF", "14px / Regular"],
          ["Row Background", "#FFFFFF", "—"],
          ["Cell Text", "#1D2129", "14px / Regular"],
          ["Total Row Background", "#E0F2F5", "—"],
          ["Total Row Text", "#1D2129", "14px / Bold"],
          ["Cell Border", "#E5E6EB", "1px"]
        ],
        1
      )
    );
    report.body.append(reportDemo.section, reportSpecs.section);

    wrapper.append(basic.section, report.section);
    return wrapper;
  }

  function createReportTable(extraBrands = []) {
    const table = element("table", "report-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Brand", "Category", "Product Line", "Sell out Amount", "Sell out Unit"].forEach((label) => {
      const th = element("th", "", label);
      th.scope = "col";
      headRow.append(th);
    });
    head.append(headRow);

    const body = document.createElement("tbody");
    const brands = [
      {
        name: "Hisense",
        total: ["13,978", "1,130"],
        categories: [
          { name: "Display", lines: [["TV", "2,389", "210"], ["MP", "1,872", "180"], ["Laser", "5,456", "350"]] },
          { name: "HVAC", lines: [["RAC", "2,389", "210"], ["LCAC", "1,872", "180"]] }
        ]
      },
      {
        name: "Toshiba",
        total: ["8,522", "780"],
        categories: [
          { name: "Display", lines: [["TV", "2,389", "210"], ["MP", "1,872", "180"]] },
          { name: "HVAC", lines: [["RAC", "2,389", "210"], ["LCAC", "1,872", "180"]] }
        ]
      },
      ...extraBrands
    ];
    brands.forEach((brand) => {
      const brandRows = brand.categories.reduce((sum, c) => sum + c.lines.length, 0);
      brand.categories.forEach((category, ci) => {
        category.lines.forEach((line, li) => {
          const row = document.createElement("tr");
          if (ci === 0 && li === 0) {
            const cell = element("td", "", brand.name);
            cell.rowSpan = brandRows;
            row.append(cell);
          }
          if (li === 0) {
            const cell = element("td", "", category.name);
            cell.rowSpan = category.lines.length;
            row.append(cell);
          }
          row.append(
            element("td", "", line[0]),
            element("td", "table-number", line[1]),
            element("td", "table-number", line[2])
          );
          body.append(row);
        });
      });
      const totalRow = element("tr", "report-total-row");
      const label = element("td", "", "Total");
      label.colSpan = 3;
      totalRow.append(
        label,
        element("td", "table-number", brand.total[0]),
        element("td", "table-number", brand.total[1])
      );
      body.append(totalRow);
    });

    table.append(head, body);
    return table;
  }

  function createDataTable() {
    const table = element("table", "data-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Region", "Store Type", "Store", "In Stock Rate", "Stockout Stores", "Risk Level"].forEach(
      (label) => {
        const th = element("th", "", label);
        th.scope = "col";
        headRow.append(th);
      }
    );
    head.append(headRow);

    const body = document.createElement("tbody");
    [
      ["West Coast", "Pad", "New York City Branch", "82.3%", "210", "Low"],
      ["Midwest", "Outlet", "Chicago Store", "75.1%", "150", "Low"],
      ["Southeast", "Mall", "Atlanta Branch", "88.9%", "300", "High"],
      ["Northeast", "Mall", "Boston Store", "79.5%", "175", "Mid"]
    ].forEach(([region, type, store, rate, stockout, risk]) => {
      const row = document.createElement("tr");
      const link = element("button", "table-link", store);
      link.type = "button";
      link.addEventListener("click", () => showToast(`Open ${store}`));
      const storeCell = element("td");
      storeCell.append(link);
      const riskCell = element("td");
      const riskColor = { Low: "Green", Mid: "Orange", High: "Red" }[risk];
      riskCell.append(
        createTag(risk, "light", TAG_COLORS.find((c) => c.name === riskColor))
      );
      row.append(
        element("td", "", region),
        element("td", "", type),
        storeCell,
        element("td", "table-number", rate),
        element("td", "table-number", stockout),
        riskCell
      );
      body.append(row);
    });

    table.append(head, body);
    return table;
  }

  function createSpecTable(columns, rows, swatchColumn = -1) {
    const scroll = element("div", "spec-table-scroll");
    const table = element("table", "spec-table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    columns.forEach((label) => headRow.append(element("th", "", label)));
    head.append(headRow);
    const body = document.createElement("tbody");
    rows.forEach((cells) => {
      const row = document.createElement("tr");
      cells.forEach((value, index) => {
        const cell = element("td");
        const isSwatch = Array.isArray(swatchColumn)
          ? swatchColumn.includes(index)
          : index === swatchColumn;
        if (isSwatch && value.startsWith("#")) {
          const swatch = element("span", "spec-swatch");
          swatch.style.background = value;
          swatch.setAttribute("aria-hidden", "true");
          cell.append(swatch, document.createTextNode(value));
        } else {
          cell.textContent = value;
        }
        row.append(cell);
      });
      body.append(row);
    });
    table.append(head, body);
    scroll.append(table);
    return scroll;
  }

  function renderMetricCardDocumentation() {
    const wrapper = element("div", "component-doc metric-card-doc");

    const categorySection = componentSection(
      "数据分类卡片：指标区域为白底，目标标签多可进行分类"
    );
    const categoryGrid = element("div", "metric-card-grid");
    categoryGrid.append(
      createMetricCard({ title: "Sell out Unit", value: "262,327", tone: "primary" }),
      createMetricCard({ title: "Store Count", value: "1,045", tone: "blue" }),
      createMetricCard({ title: "Weeks of Supply", value: "122", tone: "orange" }),
      createMetricCard({
        title: "Weeks of Supply",
        value: "122",
        tone: "orange",
        tooltipTitle: "Backward Week of Supply",
        tooltipText: "最新销售库存 / 过去四周的平均销量"
      })
    );
    categorySection.body.append(categoryGrid);

    const titleSection = componentSection("常规指标卡");
    const titleGrid = element("div", "metric-card-grid metric-card-grid-compact");
    titleGrid.append(
      metricCardExample(
        "常规（双语）-一级指标：指标区域为白底",
        createMetricCard({
          title: "Sell out Unit",
          localTitle: "销量",
          value: "19,234",
          tone: "primary",
          ly: "154,362"
        })
      ),
      metricCardExample(
        "常规-二级指标：指标区域为白底",
        createMetricCard({ title: "Sell out Unit", value: "262,327", tone: "subtle" })
      ),
      metricCardExample(
        "常规：指标区域为灰底",
        createMetricCard({ title: "Sell out Unit", value: "262,327", tone: "neutral" })
      )
    );
    titleSection.body.append(titleGrid);

    const specialSection = componentSection("特殊：折线 + 标签");
    const specialGrid = element("div", "metric-card-grid metric-card-grid-single");
    specialGrid.append(
      createMetricCard({
        title: "Stockout Stores",
        value: "142",
        tone: "neutral",
        tag: "MoM+3.6%",
        sparkline: true
      })
    );
    specialSection.body.append(specialGrid);

    const secondarySection = componentSection("二级指标-横向");
    const secondaryCanvas = element("div", "metric-secondary-canvas");
    secondaryCanvas.append(
      createSecondaryMetricList([
        { title: "In Stock Rate", value: "90.5%", yoy: ["12.5%", "up"], mom: ["12.5%", "up"] },
        { title: "Store Count", value: "320", yoy: ["12.5%", "up"], mom: ["12.5%", "up"] },
        { title: "Weeks of Supply", value: "123", yoy: ["12.5%", "up"], mom: ["2.5%", "down"] }
      ])
    );
    secondarySection.body.append(secondaryCanvas);

    const pairRow = element("div", "metric-pair-row");
    pairRow.append(specialSection.section, secondarySection.section);

    const trendSection = componentSection("同比 / 环比");
    const trendGrid = element("div", "trend-convention-grid");
    trendGrid.append(
      renderTrendConvention("通用版", "general"),
      renderTrendConvention("美国版", "us")
    );
    trendSection.body.append(trendGrid);

    const specSection = componentSection("Specifications");
    const specs = element("div", "metric-spec-grid");
    [
      ["Card Radius", "6px"],
      ["Padding / Border", "16px / None"],
      ["Title", "14px / Medium"],
      ["Primary Data", "DIN PRO / 28px / Bold"],
      ["Comparison", "12px / Regular"],
      ["Category Fill", "#E7F4F9 / #E5EEFC / #F7F1E8 / #F7F8FA / #FFFFFF"]
    ].forEach(([term, value]) => {
      const item = element("div", "metric-spec-item");
      item.append(element("span", "", term), element("strong", "", value));
      specs.append(item);
    });
    specSection.body.append(specs);

    wrapper.append(
      categorySection.section,
      titleSection.section,
      pairRow,
      trendSection.section,
      specSection.section
    );
    return wrapper;
  }

  function createSecondaryMetricList(items) {
    const list = element("div", "metric-secondary-list");
    items.forEach((item) => {
      const row = element("div", "metric-secondary-row");
      row.append(
        element("span", "metric-secondary-title", item.title),
        element("span", "metric-secondary-value", item.value)
      );
      [["YoY", item.yoy], ["MoM", item.mom]].forEach(([label, [value, direction]]) => {
        const group = element("span", "metric-secondary-compare");
        const trend = element(
          "span",
          `metric-secondary-trend trend-value trend-${direction}-general`
        );
        // Width is reserved for a 5-character value (xx.x%) so labels stay 12px away.
        const number = element("span", "metric-secondary-number");
        const sizer = element("span", "metric-secondary-sizer", "00.0%");
        sizer.setAttribute("aria-hidden", "true");
        number.append(sizer, element("span", "", value));
        trend.append(number, createMetricIcon(direction));
        group.append(element("span", "metric-secondary-chip", label), trend);
        row.append(group);
      });
      list.append(row);
    });
    return list;
  }

  function metricCardExample(label, card) {
    const example = element("div", "metric-card-example");
    example.append(element("p", "metric-card-caption", label), card);
    return example;
  }

  function createMetricCard({
    title,
    value,
    tone = "neutral",
    localTitle,
    ly = "75.5%",
    lyLabel = "LY",
    showLy = true,
    yoy = "12.5%",
    yoyDirection = "up",
    tooltipTitle,
    tooltipText,
    tag,
    sparkline = false
  }) {
    const card = element("article", `metric-card metric-tone-${tone}`);
    const heading = element("div", "metric-card-heading");
    const titleBlock = element("div", "metric-title-block");
    if (localTitle) titleBlock.append(element("span", "metric-local-title", localTitle));
    titleBlock.append(element("h3", "metric-title", title));
    heading.append(titleBlock);

    if (tooltipTitle) {
      const help = element("button", "metric-help");
      help.type = "button";
      help.setAttribute("aria-label", `About ${title}`);
      help.append(createMetricIcon("info"));
      const tooltip = element("span", "metric-tooltip");
      tooltip.setAttribute("role", "tooltip");
      tooltip.append(
        element("strong", "", tooltipTitle),
        element("span", "", tooltipText)
      );
      help.append(tooltip);
      heading.append(help);
    }

    const valueNode = element("div", "metric-value", value);
    card.append(heading, valueNode);

    if (sparkline) {
      card.classList.add("metric-card-sparkline");
      const main = element("div", "metric-sparkline-main");
      main.append(heading, valueNode, element("span", "metric-tag", tag));
      card.replaceChildren(main, createSparkline());
    } else {
      const comparisons = element("div", "metric-comparisons");
      comparisons.append(
        ...(showLy ? [metricComparison(lyLabel, ly)] : []),
        metricComparison(
          "YoY",
          yoy,
          yoyDirection === "flat" ? "trend-flat" : `trend-${yoyDirection}-general`,
          yoyDirection
        )
      );
      card.append(comparisons);
    }
    return card;
  }

  function metricComparison(label, value, className = "", direction = "") {
    const row = element("div", "metric-comparison");
    const valueNode = element(
      "span",
      `metric-comparison-value trend-value ${className}`.trim()
    );
    valueNode.append(document.createTextNode(value));
    if (direction === "flat") valueNode.append(document.createTextNode(" −"));
    else if (direction) valueNode.append(createMetricIcon(direction));
    row.append(element("span", "metric-comparison-label", label), valueNode);
    return row;
  }

  // Icons come from the icon library (assets/icons/source).
  function libraryIcon(id, size, className = "") {
    const host = element("span", `lib-icon ${className}`.trim());
    host.setAttribute("aria-hidden", "true");
    const markup = LIBRARY_ICONS.get(id);
    const svg = markup ? createSafeSvg(markup, size) : null;
    if (svg) host.append(svg);
    return host;
  }

  function chevronIcon() {
    return libraryIcon("chevron-down", 28, "select-chevron");
  }

  function createMetricIcon(name) {
    const icons = {
      info: ["info-exclamation", 28],
      up: ["triangle-up", 24],
      down: ["triangle-down", 24]
    };
    const [id, size] = icons[name];
    return libraryIcon(id, size, `metric-icon metric-icon-${name}`);
  }

  function createSparkline() {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("class", "metric-sparkline");
    svg.setAttribute("viewBox", "0 0 160 64");
    svg.setAttribute("aria-hidden", "true");
    const d = "M4 40 L52 50 L96 28 L136 54 L156 12";
    const glow = document.createElementNS(namespace, "path");
    glow.setAttribute("d", d);
    glow.setAttribute("fill", "none");
    glow.setAttribute("stroke", "#00AAA6");
    glow.setAttribute("stroke-opacity", "0.12");
    glow.setAttribute("stroke-width", "8");
    glow.setAttribute("stroke-linecap", "round");
    glow.setAttribute("stroke-linejoin", "round");
    glow.setAttribute("transform", "translate(0 4)");
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#00AAA6");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(glow, path);
    return svg;
  }

  function renderTrendConvention(title, convention) {
    const group = element("section", "trend-convention");
    group.append(element("h3", "trend-convention-title", title));
    const items = element("div", "trend-items");
    const values = convention === "us"
      ? [
          ["上升", "12.5%", "trend-up-us", "up", "text-success #52C41A"],
          ["下降", "12.5%", "trend-down-us", "down", "text-danger #F83A3A"],
          ["持平", "12.5%", "trend-flat", "flat", "text-tertiary #86909C"]
        ]
      : [
          ["上升", "12.5%", "trend-up-general", "up", "text-danger #F83A3A"],
          ["下降", "12.5%", "trend-down-general", "down", "text-processing #3491FA"],
          ["持平", "12.5%", "trend-flat", "flat", "text-tertiary #86909C"]
        ];
    values.forEach(([label, value, className, direction, colorSpec]) => {
      const item = element("div", "trend-item");
      const valueNode = element("strong", `trend-value ${className}`, value);
      if (direction === "flat") {
        valueNode.append(document.createTextNode(" −"));
      } else {
        valueNode.append(createMetricIcon(direction));
      }
      const [token, hex] = colorSpec.split(" ");
      const spec = element("span", "trend-color-spec");
      const dot = element("i", `trend-color-dot ${className}`);
      dot.setAttribute("aria-hidden", "true");
      const specText = element("span", "trend-color-text");
      specText.append(element("span", "", token), element("span", "", hex));
      spec.append(dot, specText);
      item.append(element("span", "trend-label", label), valueNode, spec);
      items.append(item);
    });
    group.append(items);
    return group;
  }

  /* ---------- Spacing ---------- */

  function renderSpacing() {
    const wrapper = element("div", "component-doc spacing-doc");

    const skeleton = componentSection("Page Skeleton");
    const toggle = element("label", "choice spacing-toggle");
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = true;
    toggle.append(toggleInput, choiceMark("checkbox"), element("span", "", "显示间距标注"));

    const frame = element("div", "sp-frame show-marks");
    toggleInput.addEventListener("change", () =>
      frame.classList.toggle("show-marks", toggleInput.checked)
    );

    // A spacer that is part of the real layout, so the annotation equals the actual gap.
    const gap = (size, direction, marked = false) => {
      const node = element("div", `sp-gap is-${direction}${marked ? " is-marked" : ""}`);
      node.style[direction === "v" ? "height" : "width"] = `${size}px`;
      if (marked) node.append(element("span", "sp-badge", String(size)));
      return node;
    };
    const row = (items, size, markFirstGap = true) => {
      const node = element("div", "sp-row");
      items.forEach((item, index) => {
        if (index) node.append(gap(size, "h", markFirstGap && index === 1));
        node.append(item);
      });
      return node;
    };
    const mark = (className, size) => {
      const node = element("span", `sp-mark ${className}`);
      node.append(element("span", "sp-badge", String(size)));
      return node;
    };
    const box = (className = "") => element("div", `sp-box ${className}`.trim());

    // Header
    const header = element("div", "sp-header");
    const actions = element("div", "sp-header-actions");
    actions.append(libraryIcon("info-question", 24), libraryIcon("download", 24));
    header.append(element("span", "sp-title", "Canada Sales Analysis"), actions, mark("is-header-height", 50));

    // Filters
    const filterBox = box();
    const filters = ["Brand", "Product Line", "Category", "Model", "Key Model", "Store Type", "Store"].map(
      (label) => labeledField(label, createDropdown(["All", "Option A", "Option B"], "All"), "vertical")
    );
    filterBox.append(row(filters, 12));

    // Metric cards
    const metricBox = box("has-padding-marks");
    metricBox.append(mark("is-pad-top", 20), mark("is-pad-left", 20));
    const metrics = [
      ["Sell out Unit", "262,327"],
      ["Online Sell out Unit", "83,650"],
      ["Store Count", "1,045"],
      ["Average Sell out per Store", "251"]
    ].map(([title, value]) => createMetricCard({ title, value, tone: "subtle" }));
    metricBox.append(row(metrics, 12));

    // Chart containers
    const chartBox = (title) => {
      const node = box("sp-chart");
      node.append(element("h3", "sp-chart-title", title));
      return node;
    };
    const chartsTop = row([chartBox("Sell out Unit by Product Line"), chartBox("Sell out Unit by Stores")], 16);
    const chartsBottom = row([chartBox("Sell out Amount by Product Line"), chartBox("Sell out Amount by Stores")], 16, false);

    frame.append(
      mark("is-margin-top", 32),
      mark("is-margin-left", 32),
      mark("is-margin-right", 32),
      mark("is-margin-bottom", 32),
      header,
      gap(16, "v", true),
      filterBox,
      gap(16, "v", true),
      metricBox,
      gap(16, "v", true),
      chartsTop,
      gap(16, "v", true),
      chartsBottom
    );
    // Toggle sits in the section title row, right-aligned with the skeleton below.
    const skeletonTitle = skeleton.section.querySelector(".section-title");
    const skeletonHead = element("div", "spacing-section-head");
    skeletonTitle.replaceWith(skeletonHead);
    skeletonHead.append(skeletonTitle, toggle);
    skeleton.body.append(frame);

    const rules = componentSection("Spacing Rules");
    rules.body.append(
      createSpecTable(
        ["位置", "间距", "说明"],
        [
          ["页边距", "32px", "页面内容区与窗口四周的距离"],
          ["页面内容容器之间", "16px", "标题栏、筛选区、指标区、图表区等容器之间，横向与纵向一致"],
          ["指标卡之间", "12px / 16px", "同一容器内用 12px；指标卡作为独立容器平铺时用 16px"],
          ["下拉筛选之间", "12px", "同一筛选区内相邻下拉框的距离"],
          ["容器内边距", "20px", "筛选区、指标区、图表区等白色容器内容与容器边缘的距离"],
          ["标题栏高度", "50px", "页面标题栏的高度，标题与右侧操作图标垂直居中"]
        ]
      )
    );

    wrapper.append(skeleton.section, rules.section);
    return wrapper;
  }

  /* ---------- Overview ---------- */

  function renderOverview() {
    const wrapper = element("div", "overview");
    wrapper.append(element("p", "overview-intro", "本Skill适用于海外通用报表及数据看板。版本：V1.1"));

    const columns = element("div", "overview-columns");
    columns.append(renderUsageFlow(), renderPromptReference());
    wrapper.append(columns, renderInstallGuide());
    return wrapper;
  }

  function overviewBlock(title, className) {
    const block = element("section", `overview-block ${className}`);
    block.append(element("h2", "overview-label", title));
    const body = element("div", "overview-panel");
    block.append(body);
    return { block, body };
  }

  function renderUsageFlow() {
    const { block, body } = overviewBlock("使用流程", "overview-flow-block");
    const legend = element("div", "flow-legend");
    legend.append(element("span", "flow-legend-chip", "–"), element("span", "", "为 Skill 介入环节"));

    const node = (text, skill = false) => element("div", `flow-node${skill ? " is-skill" : ""}`, text);
    const arrow = () => {
      const line = element("div", "flow-arrow");
      line.setAttribute("aria-hidden", "true");
      return line;
    };

    const loop = element("div", "flow-loop");
    const loopNote = element("div", "flow-loop-note");
    loopNote.append(element("span", "", "至少 2 轮，"), element("span", "", "问题解决率需"), element("span", "", "≥ 80%"));
    const leftArc = element("span", "flow-loop-arc is-left");
    const rightArc = element("span", "flow-loop-arc is-right");
    [leftArc, rightArc].forEach((arc) => arc.setAttribute("aria-hidden", "true"));
    loop.append(node("UI 走查", true), leftArc, rightArc, loopNote, node("调整优化"));

    const flow = element("div", "flow");
    flow.setAttribute("role", "list");
    flow.append(
      legend,
      node("需求确认"),
      arrow(),
      node("生成页面", true),
      arrow(),
      node("报表开发"),
      arrow(),
      loop
    );
    body.append(flow);
    return block;
  }

  function renderPromptReference() {
    const PROMPT_EXAMPLES = [
      {
        title: "示例 / 生成页面",
        lead: "生成一个零售报表，使用 xxx 模板。",
        items: [
          "标题：Canada VPL Sales Summary；",
          "筛选：时间 - WTD/MTD/YTD 三种维度及对应下拉选择；其他下拉选择 - 品牌、品线、型号、重点型号、门店；",
          "指标卡：Sell out Unit, Sell out Amount, MiniLED Sell out Unit, Key Products Sellout, 0 Sell out Ratio；每个指标卡都有 YoY 对比；",
          "图表：根据所选时间段展示的 Sell out Unit Trend；",
          "明细表：Region, Store, Product Line, Sell out Unit, Sell out Amount, Key Product Sell out"
        ]
      },
      {
        title: "示例 / UI 走查",
        lead: "检查页面整体布局、设计规范、组件样式，可视化地给出调整建议。"
      },
      {
        title: "示例 / UI 复查",
        lead: "复查调整后的页面；复查通过的标准为：前一轮走查问题中，布局排版、颜色规范类问题解决 80%、组件样式问题解决70%。"
      }
    ];
    const { block, body } = overviewBlock("提示词参考", "overview-prompt-block");
    PROMPT_EXAMPLES.forEach((example) => {
      const item = element("article", "prompt-example");
      const header = element("div", "prompt-example-header");
      const copy = element("button", "prompt-copy", "复制");
      copy.type = "button";
      copy.setAttribute("aria-label", `复制${example.title}`);
      const text = [
        example.lead,
        ...(example.items || []).map((line, index) => `${index + 1}. ${line}`)
      ].join("\n");
      copy.addEventListener("click", async () => {
        showToast((await copyText(text)) ? "已复制提示词" : "复制失败");
      });
      header.append(element("h3", "prompt-example-title", example.title), copy);
      item.append(header, element("p", "prompt-example-lead", example.lead));
      if (example.items) {
        const list = element("ol", "prompt-example-list");
        example.items.forEach((line) => list.append(element("li", "", line)));
        item.append(list);
      }
      body.append(item);
    });
    return block;
  }

  function renderInstallGuide() {
    const { block, body } = overviewBlock("使用方式", "overview-install-block");

    const steps = [
      {
        title: "1. 安装 Skill",
        wide: true,
        lines: [
          ["text", "把整个 hidata-dashboard-ui 文件夹复制到以下任一位置，复制后新建一个 Kiro 对话，Skill 即可被识别。"]
        ],
        columns: [
          {
            title: "所有项目可用 · macOS",
            lines: [
              ["code", "~/.kiro/skills/hidata-dashboard-ui/"],
              ["text", "~ 指用户主目录，即 /Users/你的用户名，不是 Kiro 的安装位置。"],
              ["text", ".kiro 是隐藏文件夹。在访达中按 Cmd + Shift + . 显示，再按一次恢复隐藏。"]
            ]
          },
          {
            title: "所有项目可用 · Windows",
            lines: [
              ["code", "C:\\Users\\你的用户名\\.kiro\\skills\\hidata-dashboard-ui\\"],
              ["text", "也可以在文件资源管理器地址栏输入 %USERPROFILE%\\.kiro 后回车，直接打开。"],
              ["text", "如果看不到 .kiro 文件夹：Windows 11 点「查看 → 显示 → 隐藏的项目」；Windows 10 在「查看」中勾选「隐藏的项目」。"]
            ]
          },
          {
            title: "只在当前项目可用",
            lines: [
              ["code", "<项目根目录>/.kiro/skills/hidata-dashboard-ui/"],
              ["text", "只在这个项目中生效。适合团队把 Skill 跟项目一起提交到代码仓库。"],
              ["text", "macOS 和 Windows 的目录结构相同，显示隐藏文件夹的方法同左。"]
            ]
          }
        ]
      },
      {
        title: "2. 调用 Skill",
        lines: [
          ["text", "自动调用：在 Kiro 对话中描述报表需求，提到「报表」「指标页」「趋势页」等，Kiro 会自动加载本 Skill。"],
          ["text", "指定调用：在提示词开头写明："],
          ["code", "使用 hidata-dashboard-ui skill，生成一个零售报表……"],
          ["text", "按「需求确认 → 生成页面 → UI 走查 → 调整优化」的流程使用，各环节可直接复制上方的提示词参考修改。"]
        ]
      },
      {
        title: "3. 查看规范",
        lines: [
          ["text", "用 Chrome 打开以下文件，可查看全部规范、组件和图标，并下载图标："],
          ["code", "hidata-dashboard-ui/Hidata-dashboard-ui.html"],
          ["text", "建议使用 Chrome 打开，Safari 下字体显示不完整。"]
        ]
      },
      {
        title: "4. 更新版本",
        lines: [
          ["text", "收到新版本后，用新的 hidata-dashboard-ui 文件夹整体替换旧文件夹，再新建对话即可。"]
        ]
      }
    ];

    const grid = element("div", "install-steps");
    const appendLines = (target, lines) => {
      lines.forEach(([kind, content]) => {
        if (kind === "code") {
          target.append(element("code", "install-code", content));
        } else {
          target.append(element("p", "install-step-text", content));
        }
      });
    };
    steps.forEach((step) => {
      const card = element("article", step.wide ? "install-step install-step-wide" : "install-step");
      card.append(element("h3", "install-step-title", step.title));
      appendLines(card, step.lines);
      if (step.columns) {
        const columns = element("div", "install-columns");
        step.columns.forEach((column) => {
          const item = element("div", "install-column");
          item.append(element("h4", "install-column-title", column.title));
          appendLines(item, column.lines);
          columns.append(item);
        });
        card.append(columns);
      }
      grid.append(card);
    });
    body.append(grid);
    return block;
  }

  /* ---------- Button ---------- */

  function createButton(text, variant, stateClass = "") {
    const button = element("button", `report-button report-button-${variant} ${stateClass}`.trim(), text);
    button.type = "button";
    return button;
  }

  function renderButtonDocumentation() {
    const wrapper = element("div", "component-doc button-doc");
    const variants = [
      {
        id: "primary",
        title: "Primary · 主按钮",
        states: [
          ["Default", "", "#00AAA6", "#FFFFFF"],
          ["Hover", "is-hover", "#009093", "#FFFFFF"]
        ]
      },
      {
        id: "secondary",
        title: "Secondary · 次按钮",
        states: [
          ["Default", "", "#F2F3F5", "#4E5969"],
          ["Hover", "is-hover", "#F2F3F5", "#00AAA6"]
        ]
      },
      {
        id: "text",
        title: "Text · 文字按钮",
        states: [
          ["Default", "", "Transparent", "#00AAA6"],
          ["Hover", "is-hover", "#F2F3F5", "#00AAA6"]
        ]
      }
    ];

    const demo = componentSection("Interactive Example");
    const preview = element("div", "component-preview button-preview");
    variants.forEach((variant) =>
      preview.append(createButton("Button", variant.id))
    );
    demo.body.append(preview);

    const states = componentSection("State Styles");
    const grid = element("div", "button-state-grid");
    variants.forEach((variant) => {
      variant.states.forEach(([name, className, background, text]) => {
        const card = element("article", "dropdown-state-card");
        card.append(element("h4", "dropdown-state-name", `${variant.title} · ${name}`));
        const sample = element("div", "state-control-preview button-state-preview");
        const button = createButton("Button", variant.id, className);
        button.tabIndex = -1;
        sample.append(button);
        const specs = element("dl", "dropdown-state-specs");
        [
          ["Background", background],
          ["Text", text],
          ["Typography", "14px / Regular"]
        ].forEach(([term, value]) => {
          const row = element("div", "state-spec-row");
          row.append(element("dt", "", term), element("dd", "", value));
          specs.append(row);
        });
        card.append(sample, specs);
        grid.append(card);
      });
    });
    states.body.append(grid);

    const specs = componentSection("Specifications");
    specs.body.append(
      createSpecTable(
        ["Property", "Value"],
        [
          ["Height", "28px / 32px"],
          ["Padding", "0 16px"],
          ["Radius", "4px"],
          ["Typography", "14px / Regular"],
          ["Border", "None"]
        ]
      )
    );

    wrapper.append(demo.section, states.section, specs.section);
    return wrapper;
  }

  /* ---------- Tag ---------- */

  function createTag(text, type, color) {
    const tag = element("span", `report-tag report-tag-${type}`, text);
    if (type === "light") {
      tag.style.background = color.light[0];
      tag.style.color = color.light[1];
    } else if (type === "solid") {
      tag.style.background = color.solid;
    } else {
      tag.style.color = color.outline;
      tag.style.borderColor = color.outline;
    }
    return tag;
  }

  function renderTagDocumentation() {
    const wrapper = element("div", "component-doc tag-doc");
    const types = [
      ["light", "Light · 浅色填充"],
      ["solid", "Solid · 实色填充"],
      ["outline", "Outline · 描边"]
    ];

    const demo = componentSection("Types");
    const grid = element("div", "tag-type-grid");
    types.forEach(([type, title]) => {
      const card = demoCard(title);
      const list = element("div", "tag-list");
      TAG_COLORS.forEach((color) => list.append(createTag("Label", type, color)));
      card.append(list);
      grid.append(card);
    });
    demo.body.append(grid);

    const colors = componentSection("Colors");
    colors.body.append(
      createSpecTable(
        ["Color", "Light 背景", "Light 文字", "Solid 背景", "Outline 描边 / 文字"],
        TAG_COLORS.map((c) => [c.name, c.light[0], c.light[1], c.solid, c.outline]),
        [1, 2, 3, 4]
      )
    );

    const specs = componentSection("Specifications");
    specs.body.append(
      createSpecTable(
        ["Property", "Value"],
        [
          ["Height", "24px"],
          ["Padding", "0 8px"],
          ["Radius", "4px"],
          ["Typography", "12px / Regular"],
          ["Solid Text", "#FFFFFF"],
          ["Outline Border / Background", "1px / Transparent"]
        ]
      )
    );

    wrapper.append(demo.section, colors.section, specs.section);
    return wrapper;
  }

  /* ---------- Radio & Checkbox ---------- */

  function renderChoiceControls() {
    const wrapper = element("div", "component-doc combined-component-doc");
    const options = ["All", "PAD & VPL", "VPL", "Control"];

    const radio = componentFamily("Radio");
    radio.body.append(
      choiceStateSection("radio", [
        { name: "Default", mark: "", specs: [["Background", "#FFFFFF"], ["Border", "#C9CDD4"]] },
        { name: "Hover", mark: "is-hover", specs: [["Background", "#FFFFFF"], ["Border", "#00AAA6"]] },
        { name: "Selected", mark: "is-checked", specs: [["Background", "#00AAA6"], ["Dot", "#FFFFFF · 6px"]] }
      ]),
      choiceExample("radio", options, ["All"])
    );

    const checkbox = componentFamily("Checkbox");
    checkbox.body.append(
      choiceStateSection("checkbox", [
        { name: "Default", mark: "", specs: [["Background", "#FFFFFF"], ["Border", "#C9CDD4"]] },
        { name: "Hover", mark: "is-hover", specs: [["Background", "#FFFFFF"], ["Border", "#00AAA6"]] },
        { name: "Selected", mark: "is-checked", specs: [["Background", "#00AAA6"], ["Check", "#FFFFFF"]] }
      ]),
      choiceExample("checkbox", options.slice(1), ["VPL", "Control"])
    );

    wrapper.append(radio.section, checkbox.section);
    return wrapper;
  }

  function choiceMark(type, stateClass = "") {
    const mark = element("span", `${type === "radio" ? "radio-mark" : "check-mark"} ${stateClass}`.trim());
    mark.setAttribute("aria-hidden", "true");
    return mark;
  }

  function choiceStateSection(type, states) {
    const section = element("section", "component-section");
    section.append(element("h3", "section-title", "State Styles"));
    const grid = element("div", "dropdown-state-grid");
    states.forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", state.name));
      const preview = element("div", "state-control-preview choice-state-preview");
      const sample = element("span", "choice is-static");
      sample.append(choiceMark(type, state.mark), element("span", "", "VPL"));
      preview.append(sample);
      const specs = element("dl", "dropdown-state-specs");
      [
        ...state.specs,
        ["Size / Border / Radius", type === "radio" ? "14px / 2px / 50%" : "14px / 2px / 2px"],
        ["Text", "#4E5969 · 14px / Regular"],
        ["Mark Gap / Item Gap", "8px / 24px"]
      ].forEach(([term, value]) => {
        const row = element("div", "state-spec-row");
        row.append(element("dt", "", term), element("dd", "", value));
        specs.append(row);
      });
      card.append(preview, specs);
      grid.append(card);
    });
    section.append(grid);
    return section;
  }

  function choiceExample(type, options, selected) {
    const demo = componentSection("Interactive Example", undefined, 3);
    const preview = element("div", "component-preview choice-preview");
    const group = element("div", "choice-group");
    group.setAttribute("role", type === "radio" ? "radiogroup" : "group");
    const name = `choice-${type}-${Math.random().toString(36).slice(2)}`;
    options.forEach((option) => {
      const label = element("label", "choice");
      const input = document.createElement("input");
      input.type = type;
      input.name = name;
      input.value = option;
      input.checked = selected.includes(option);
      label.append(input, choiceMark(type), element("span", "", option));
      group.append(label);
    });
    preview.append(group);
    demo.body.append(preview);
    return demo.section;
  }

  function renderFiltersNavigation() {
    const wrapper = element("div", "component-doc combined-component-doc");

    const dropdown = componentFamily("Dropdown");
    const menus = componentSection("Selection Menus", undefined, 3);
    const menuGrid = element("div", "selection-menu-grid");
    menuGrid.append(renderSingleSelectDemo(), renderMultiSelectDemo());
    menus.body.append(
      menuGrid,
      renderOptionStates("single"),
      renderOptionStates("multi")
    );
    dropdown.body.append(
      renderDropdownStates("outline"),
      renderDropdownStates("filled"),
      renderLabelLayouts(),
      menus.section
    );

    const filterTag = componentFamily("Filter Tag");
    filterTag.body.append(
      renderFilterTagStates("on-white"),
      renderFilterTagStates("on-gray"),
      renderFilterTagDemo()
    );

    const tabs = componentFamily("Tabs");
    tabs.body.append(renderTabStates(), renderTabsDemo());

    const combos = componentFamily("Filter Bar Examples");
    combos.body.append(renderFilterBarExamples());

    wrapper.append(dropdown.section, filterTag.section, tabs.section, combos.section);
    return wrapper;
  }

  function renderLabelLayouts() {
    const section = componentSection("Label Layout", undefined, 3);
    const grid = element("div", "selection-menu-grid");

    const horizontal = demoCard("Horizontal · 水平标题");
    const hPreview = element("div", "component-preview label-layout-preview");
    hPreview.append(
      labeledField("Brand", createSelectTrigger("All", false, "outline"), "horizontal"),
      labeledField("Brand", createChipTrigger(["Text", "Text"], 3), "horizontal"),
      labeledField("Brand", createSelectTrigger("All", false, "filled"), "horizontal")
    );
    horizontal.append(hPreview, labelSpecs("8px", "Left of control"));

    const vertical = demoCard("Vertical · 垂直标题");
    const vPreview = element("div", "component-preview label-layout-preview");
    vPreview.append(
      labeledField("Brand", createSelectTrigger("All", false, "outline"), "vertical"),
      labeledField("Brand", createChipTrigger(["Text", "Text"], 3), "vertical"),
      labeledField("Brand", createSelectTrigger("All", false, "filled"), "vertical")
    );
    vertical.append(vPreview, labelSpecs("4px", "Above control"));

    grid.append(horizontal, vertical);
    section.body.append(grid);
    return section.section;
  }

  function labelSpecs(gap, position) {
    const specs = element("dl", "dropdown-state-specs label-specs");
    [
      ["Label Text", "#4E5969"],
      ["Typography", "14px / Regular"],
      ["Position", position],
      ["Label Gap", gap]
    ].forEach(([term, value]) => {
      const row = element("div", "state-spec-row");
      row.append(element("dt", "", term), element("dd", "", value));
      specs.append(row);
    });
    return specs;
  }

  function labeledField(label, control, layout) {
    const field = element("div", `labeled-field is-${layout}`);
    field.append(element("span", "field-label", label), control);
    return field;
  }

  function createChipTrigger(chips, extra) {
    const trigger = element("div", "select-trigger chip-trigger");
    const values = element("span", "chip-values");
    const all = [...chips, ...Array.from({ length: extra || 0 }, (_, i) => `Text ${i + 3}`)];
    fillChipValues(values, all, chips.length);
    trigger.append(values, chevronIcon());
    return trigger;
  }

  function fillChipValues(container, values, maxShown, placeholder = "", onRemove) {
    if (!values.length) {
      container.replaceChildren(element("span", "chip-placeholder", placeholder));
      return;
    }
    const nodes = values.slice(0, maxShown).map((value) => {
      const chip = element("span", "select-chip");
      chip.append(element("span", "chip-label", value));
      const close = element("button", "chip-close");
      close.type = "button";
      close.setAttribute("aria-label", `Remove ${value}`);
      if (onRemove) {
        close.addEventListener("click", (event) => {
          event.stopPropagation();
          onRemove(value);
        });
      } else {
        close.tabIndex = -1;
      }
      chip.append(close);
      return chip;
    });
    const hidden = values.length - maxShown;
    if (hidden > 0) nodes.push(element("span", "select-chip chip-count", `+${hidden}`));
    container.replaceChildren(...nodes);
  }

  function createDropdown(options, initialValue, variant = "filled", onChange) {
    const root = element("div", "dropdown");
    const trigger = element(
      "button",
      `select-trigger${variant === "filled" ? " is-filled" : ""}`
    );
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const valueNode = element("span", "select-value", initialValue);
    trigger.append(valueNode, chevronIcon());

    const menu = element("div", "demo-dropdown-menu dropdown-popover");
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    let current = initialValue;

    const close = () => {
      menu.hidden = true;
      trigger.classList.remove("is-active");
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      document.querySelectorAll(".dropdown").forEach((item) => {
        if (item !== root && item._close) item._close();
      });
      menu.hidden = false;
      trigger.classList.add("is-active");
      trigger.setAttribute("aria-expanded", "true");
    };
    const renderOptions = () => {
      menu.replaceChildren(
        ...options.map((option) => {
          const node = menuOption(option, option === current);
          node.setAttribute("role", "option");
          node.setAttribute("aria-selected", String(option === current));
          node.addEventListener("click", () => {
            current = option;
            valueNode.textContent = option;
            renderOptions();
            close();
            trigger.focus();
            if (onChange) onChange(option);
          });
          return node;
        })
      );
    };

    trigger.addEventListener("click", () => (menu.hidden ? open() : close()));
    root._close = close;
    renderOptions();
    root.append(trigger, menu);
    return root;
  }

  function createFilterTagGroup(labels, variant) {
    const group = element("div", `filter-tag-group ${variant}`);
    const controls = labels.map((label, index) => {
      const control = element(
        "button",
        `filter-tag${index === 0 ? " is-active" : ""}`,
        label
      );
      control.type = "button";
      control.setAttribute("aria-pressed", String(index === 0));
      control.addEventListener("click", () => {
        controls.forEach((item) => {
          const active = item === control;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
      });
      return control;
    });
    group.append(...controls);
    return group;
  }

  // Period Filter Tag and week Dropdown share one gray track, separated by a short divider.
  function createTimeCombo(weeks, initial) {
    const combo = element("div", "time-combo");
    combo.append(
      createFilterTagGroup(["WTD", "MTD", "YTD"], "on-white"),
      element("span", "time-combo-divider"),
      createDropdown(weeks, initial, "filled")
    );
    return combo;
  }

  function renderFilterBarExamples() {
    const wrapper = element("div", "filter-bar-examples");

    const weeks = ["2026-WK1", "2026-WK2", "2026-WK3", "2026-WK4", "2026-WK5"];
    const brands = ["All", "Hisense", "Toshiba", "Sharp"];

    const rowTwo = element("div", "filter-bar");
    rowTwo.append(
      createFilterTagGroup(["WTD", "MTD", "YTD"], "on-white"),
      labeledField("Week", createDropdown(weeks, "2026-WK1"), "horizontal"),
      labeledField("Brand", createDropdown(brands, "All"), "horizontal")
    );

    const rowThree = element("div", "filter-bar is-vertical");
    rowThree.append(
      labeledField("Time", createFilterTagGroup(["WTD", "MTD", "YTD"], "on-white"), "vertical"),
      labeledField("Week", createDropdown(weeks, "2026-WK1"), "vertical"),
      labeledField("Brand", createDropdown(brands, "All"), "vertical")
    );

    const rowCombo = element("div", "filter-bar is-vertical");
    rowCombo.append(
      labeledField("Time", createTimeCombo(weeks, "2026-WK1"), "vertical"),
      labeledField("Brand", createDropdown(brands, "All"), "vertical")
    );

    [
      ["Filter Tag + Dropdown · Horizontal", rowTwo],
      ["Filter Tag + Dropdown · Vertical", rowThree],
      ["Filter Tag + Week · Combined", rowCombo]
    ].forEach(([title, row]) => {
      const card = demoCard(title);
      const preview = element("div", "component-preview filter-bar-preview");
      preview.append(row);
      card.append(preview);
      wrapper.append(card);
    });
    return wrapper;
  }

  function renderDropdownStates(variant = "outline") {
    const filled = variant === "filled";
    const section = element("section", "component-section");
    section.append(
      element(
        "h3",
        "section-title",
        filled ? "State Styles · Filled" : "State Styles · Outline"
      )
    );
    const grid = element("div", "dropdown-state-grid");
    const fill = filled ? "#F7F8FA" : "#FFFFFF";
    const states = [
      {
        name: "Default",
        className: "",
        background: fill,
        border: filled ? "None" : "#E5E6EB",
        text: "#4E5969"
      },
      {
        name: "Hover",
        className: "is-hover",
        background: fill,
        border: "#00AAA6",
        text: "#4E5969"
      },
      {
        name: "Active",
        className: "is-active",
        background: fill,
        border: "#00AAA6",
        text: "#1D2129"
      }
    ];

    states.forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", state.name));
      const preview = element(
        "div",
        `select-trigger state-trigger-sample ${filled ? "is-filled" : ""} ${state.className}`
          .replace(/\s+/g, " ")
          .trim()
      );
      preview.append(
        element("span", "select-value", "2026-WK1"),
        chevronIcon()
      );
      const specs = element("dl", "dropdown-state-specs");
      [
        ["Background", state.background],
        ["Border", state.border],
        ["Text", state.text],
        ["Radius", "6px"],
        ["Typography", "14px / Regular"]
      ].forEach(([term, value]) => {
        const row = element("div", "state-spec-row");
        row.append(element("dt", "", term), element("dd", "", value));
        specs.append(row);
      });
      card.append(preview, specs);
      grid.append(card);
    });

    section.append(grid);
    return section;
  }

  function renderSingleSelectDemo() {
    const card = demoCard("Single Select · Cascader");
    let selectedYear = "2026";
    let selectedWeek = "WK1";
    const trigger = createSelectTrigger(`${selectedYear}-${selectedWeek}`, true);
    const menu = element("div", "demo-dropdown-menu cascader-menu");
    const yearColumn = element("div", "menu-column");
    const weekColumn = element("div", "menu-column");

    const renderOptions = () => {
      yearColumn.replaceChildren(
        ...["2026", "2025", "2024"].map((year) => {
          const option = menuOption(year, year === selectedYear, true);
          option.addEventListener("click", () => {
            selectedYear = year;
            renderOptions();
          });
          return option;
        })
      );
      weekColumn.replaceChildren(
        ...["WK1", "WK2", "WK3", "WK4", "WK5"].map((week) => {
          const option = menuOption(week, week === selectedWeek);
          option.addEventListener("click", () => {
            selectedWeek = week;
            trigger.querySelector(".select-value").textContent =
              `${selectedYear}-${selectedWeek}`;
            renderOptions();
          });
          return option;
        })
      );
    };

    renderOptions();
    menu.append(yearColumn, weekColumn);
    const preview = element("div", "component-preview menu-demo-preview");
    preview.append(trigger, menu);
    card.append(preview);
    return card;
  }

  function renderMultiSelectDemo() {
    const card = demoCard("Multi Select · Checkbox");
    const options = ["COSTCO", "SAM", "AMAZON", "LOWE’S"];
    const selected = new Set(["COSTCO", "SAM", "LOWE’S"]);
    const trigger = element("div", "select-trigger chip-trigger is-active");
    trigger.setAttribute("aria-label", "Selected customers");
    const chipValues = element("span", "chip-values");
    trigger.append(chipValues, chevronIcon());
    const menu = element("div", "demo-dropdown-menu multi-menu");

    const render = () => {
      const values = options.filter((option) => selected.has(option));
      fillChipValues(chipValues, values, 2, "Select Customer", (value) => {
        selected.delete(value);
        render();
      });

      const allOption = element("button", "menu-option multi-option");
      allOption.type = "button";
      const allSelected = selected.size === options.length;
      const partiallySelected = selected.size > 0 && !allSelected;
      allOption.append(
        checkboxMark(allSelected, partiallySelected),
        element("span", "", "ALL")
      );
      allOption.setAttribute("aria-pressed", String(allSelected));
      allOption.addEventListener("click", () => {
        if (allSelected) selected.clear();
        else options.forEach((option) => selected.add(option));
        render();
      });

      const optionNodes = options.map((label) => {
        const active = selected.has(label);
        const option = element(
          "button",
          `menu-option multi-option${active ? " is-selected" : ""}`
        );
        option.type = "button";
        option.setAttribute("aria-pressed", String(active));
        option.append(checkboxMark(active), element("span", "", label));
        option.addEventListener("click", () => {
          if (active) selected.delete(label);
          else selected.add(label);
          render();
        });
        return option;
      });
      menu.replaceChildren(allOption, ...optionNodes);
    };

    render();
    const preview = element("div", "component-preview menu-demo-preview");
    preview.append(trigger, menu);
    card.append(preview);
    return card;
  }

  function renderFilterTagStates(variant = "on-gray") {
    const onWhite = variant === "on-white";
    const section = element("section", "component-section");
    section.append(
      element(
        "h3",
        "section-title",
        onWhite
          ? "State Styles · 白底（容器 #F2F3F5）"
          : "State Styles · 灰底（容器 #FFFFFF）"
      )
    );
    const grid = element("div", "dropdown-state-grid");
    const container = onWhite ? "#F2F3F5" : "#FFFFFF";
    const states = onWhite
      ? [
          { name: "Default", className: "", background: "Transparent", border: "Transparent", text: "#86909C", typography: "14px / Regular" },
          { name: "Hover", className: "is-hover", background: "Transparent", border: "Transparent", text: "#00AAA6", typography: "14px / Regular" },
          { name: "Active", className: "is-active", background: "#FFFFFF", border: "Transparent", text: "#00AAA6", typography: "14px / Regular" }
        ]
      : [
          { name: "Default", className: "", background: "Transparent", border: "Transparent", text: "#86909C", typography: "14px / Regular" },
          { name: "Hover", className: "is-hover", background: "#E8FFFB", border: "Transparent", text: "#009093", typography: "14px / Regular" },
          { name: "Active", className: "is-active", background: "#00AAA6", border: "Transparent", text: "#FFFFFF", typography: "14px / Medium" }
        ];

    states.forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", state.name));
      const preview = element(
        "div",
        `state-control-preview filter-tag-state-preview ${variant}-surface`
      );
      const group = element("div", `filter-tag-group ${variant}`);
      group.append(
        element(
          "div",
          `filter-tag state-filter-tag-sample ${state.className}`.trim(),
          "WTD"
        )
      );
      preview.append(group);
      const specs = createStateSpecs(state, "4px");
      const containerRow = element("div", "state-spec-row");
      containerRow.append(element("dt", "", "Container"), element("dd", "", container));
      specs.prepend(containerRow);
      card.append(preview, specs);
      grid.append(card);
    });

    section.append(grid);
    return section;
  }

  function renderFilterTagDemo() {
    const demo = componentSection("Interactive Example", undefined, 3);
    const grid = element("div", "selection-menu-grid");
    [
      ["白底", "on-white"],
      ["灰底", "on-gray"]
    ].forEach(([title, variant]) => {
      const card = demoCard(title);
      const preview = element(
        "div",
        `component-preview compact-component-preview ${variant}-surface`
      );
      preview.append(createFilterTagGroup(["WTD", "MTD", "YTD"], variant));
      card.append(preview);
      grid.append(card);
    });
    demo.body.append(grid);
    return demo.section;
  }

  function renderTabStates() {
    const section = element("section", "component-section");
    section.append(element("h3", "section-title", "State Styles"));
    const grid = element("div", "dropdown-state-grid");
    const states = [
      { name: "Default", className: "", background: "Transparent", border: "Transparent", text: "#86909C", typography: "16px / Regular" },
      { name: "Hover", className: "is-hover", background: "Transparent", border: "Transparent", text: "#00AAA6", typography: "16px / Regular" },
      { name: "Active", className: "is-active", background: "Transparent", border: "#00AAA6 / Bottom 2px", text: "#1D2129", typography: "16px / Medium" }
    ];

    states.forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h4", "dropdown-state-name", state.name));
      const preview = element("div", "state-control-preview state-tab-preview");
      preview.append(
        element(
          "div",
          `tab state-tab-sample ${state.className}`.trim(),
          "Core Overview"
        )
      );
      card.append(preview, createStateSpecs(state, "0px"));
      grid.append(card);
    });

    section.append(grid);
    return section;
  }

  function renderTabsDemo() {
    const demo = componentSection("Interactive Example", undefined, 3);
    const preview = element("div", "component-preview tabs-demo-preview");
    const tablist = element("div", "tabs-list");
    tablist.setAttribute("role", "tablist");
    const panel = element("div", "tab-panel");
    panel.setAttribute("role", "tabpanel");
    const labels = ["Core Overview", "Customer Performance", "Product Line"];
    const tabs = labels.map((label, index) => {
      const tab = element("button", `tab${index === 0 ? " is-active" : ""}`, label);
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(index === 0));
      tab.addEventListener("click", () => {
        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panel.textContent = `${label} content`;
      });
      return tab;
    });
    tablist.append(...tabs);
    panel.textContent = `${labels[0]} content`;
    preview.append(tablist, panel);
    demo.body.append(preview);
    return demo.section;
  }

  function createStateSpecs(state, radius) {
    const specs = element("dl", "dropdown-state-specs");
    [
      ["Background", state.background],
      ["Border", state.border],
      ["Text", state.text],
      ["Radius", radius],
      ["Typography", state.typography]
    ].forEach(([term, value]) => {
      const row = element("div", "state-spec-row");
      row.append(element("dt", "", term), element("dd", "", value));
      specs.append(row);
    });
    return specs;
  }

  function componentFamily(title) {
    const section = element("section", "component-family");
    const heading = element("h2", "component-family-title", title);
    const body = element("div", "component-family-body");
    section.append(heading, body);
    return { section, body };
  }

  function componentSection(title, description, headingLevel = 2) {
    const section = element("section", "component-section");
    const heading = element(`h${headingLevel}`, "section-title", title);
    const body = element("div", "component-section-body");
    section.append(heading);
    if (description) {
      section.append(element("p", "component-description", description));
    }
    section.append(body);
    return { section, body };
  }

  function demoCard(title) {
    const card = element("article", "component-demo-card");
    card.append(element("h3", "demo-card-title", title));
    return card;
  }

  function createSelectTrigger(value, active = false, variant = "outline") {
    const trigger = element(
      "button",
      `select-trigger${variant === "filled" ? " is-filled" : ""}${active ? " is-active" : ""}`
    );
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", String(active));
    trigger.append(
      element("span", "select-value", value),
      chevronIcon()
    );
    trigger.addEventListener("click", () => {
      const open = trigger.classList.toggle("is-active");
      trigger.setAttribute("aria-expanded", String(open));
    });
    return trigger;
  }

  function renderOptionStates(kind) {
    const multi = kind === "multi";
    const section = element("section", "option-state-section");
    section.append(
      element(
        "h4",
        "option-state-title",
        multi ? "Multi Select Option" : "Single Select Option"
      )
    );
    const grid = element("div", "dropdown-state-grid");
    const states = multi
      ? [
          { name: "Selected", className: "is-selected", label: "SAM", checked: true, background: "#FFFFFF", text: "#4E5969", checkbox: "#00AAA6 / Checked" },
          { name: "Hover", className: "is-hover", label: "AMAZON", checked: false, background: "#F7F8FA", text: "#4E5969", checkbox: "#C9CDD4 / 2px Border" },
          { name: "Default", className: "", label: "AMAZON", checked: false, background: "#FFFFFF", text: "#4E5969", checkbox: "#C9CDD4 / 2px Border" }
        ]
      : [
          { name: "Selected", className: "is-selected", label: "WK1", background: "#FFFFFF", text: "#00AAA6" },
          { name: "Hover", className: "is-hover", label: "WK2", background: "#F7F8FA", text: "#1D2129" },
          { name: "Default", className: "", label: "WK3", background: "#FFFFFF", text: "#1D2129" }
        ];

    states.forEach((state) => {
      const card = element("article", "dropdown-state-card");
      card.append(element("h5", "dropdown-state-name", state.name));
      const preview = element("div", "state-control-preview option-state-preview");
      const option = element(
        "div",
        `menu-option state-option-sample${multi ? " multi-option" : ""} ${state.className}`.trim()
      );
      if (multi) option.append(checkboxMark(state.checked));
      option.append(element("span", "", state.label));
      preview.append(option);

      const rows = [
        ["Background", state.background],
        ["Text", state.text]
      ];
      if (multi) rows.push(["Checkbox", state.checkbox]);
      rows.push(["Typography", state.typography || "14px / Regular"]);

      const specs = element("dl", "dropdown-state-specs");
      rows.forEach(([term, value]) => {
        const row = element("div", "state-spec-row");
        row.append(element("dt", "", term), element("dd", "", value));
        specs.append(row);
      });
      card.append(preview, specs);
      grid.append(card);
    });

    section.append(grid);
    return section;
  }

  function menuOption(label, active, hasChild = false) {
    const option = element(
      "button",
      `menu-option${active ? " is-selected" : ""}`
    );
    option.type = "button";
    option.setAttribute("aria-pressed", String(active));
    option.append(element("span", "", label));
    if (hasChild) option.append(libraryIcon("chevron-right", 28, "submenu-chevron"));
    return option;
  }

  function checkboxMark(checked, partial = false) {
    const mark = element(
      "span",
      `checkbox-mark${checked ? " is-checked" : ""}${partial ? " is-partial" : ""}`
    );
    mark.setAttribute("aria-hidden", "true");
    return mark;
  }

  function renderIconLibrary() {
    const wrapper = document.createDocumentFragment();
    const presets = [
      ["text-primary", "#1D2129"],
      ["text-secondary", "#4E5969"],
      ["text-tertiary", "#86909C"],
      ["text-placeholder", "#C9CDD4"],
      ["primary-6", "#00AAA6"],
      ["text-danger", "#F83A3A"]
    ];
    const state = { color: "#1D2129", size: 24, format: "svg", scale: 2 };

    const toolbar = element("div", "icon-toolbar");
    const results = element("div", "icon-results");

    const toolbarField = (label, control) => {
      const wrapperNode = element("div", "field icon-toolbar-field");
      wrapperNode.append(element("span", "icon-toolbar-label", label), control);
      return wrapperNode;
    };

    const sizeField = toolbarField(
      "尺寸",
      createDropdown(["16px", "20px", "24px"], `${state.size}px`, "outline", (value) => {
        state.size = Number.parseInt(value, 10);
        update();
      })
    );
    const formatField = toolbarField(
      "下载格式",
      createDropdown(["SVG", "PNG"], "SVG", "outline", (value) => {
        state.format = value.toLowerCase();
        update();
      })
    );
    const scaleField = toolbarField(
      "PNG 倍率",
      createDropdown(["1x", "2x", "3x"], `${state.scale}x`, "outline", (value) => {
        state.scale = Number.parseInt(value, 10);
        update();
      })
    );

    const colorWrapper = element("div", "field icon-toolbar-field icon-color-field");
    const colorLabel = element("span", "icon-toolbar-label", "颜色");
    const colorRow = element("div", "icon-color-row");
    const swatches = presets.map(([token, hex]) => {
      const swatch = element("button", "icon-color-swatch");
      swatch.type = "button";
      swatch.title = `${token} ${hex}`;
      swatch.setAttribute("aria-label", `${token} ${hex}`);
      swatch.style.background = hex;
      swatch.dataset.hex = hex;
      swatch.addEventListener("click", () => setColor(hex));
      return swatch;
    });
    // Custom color: a rainbow wheel button that opens the native color picker.
    const wheel = element("label", "icon-color-wheel");
    wheel.title = "自定义颜色";
    const picker = document.createElement("input");
    picker.type = "color";
    picker.className = "icon-color-input";
    picker.setAttribute("aria-label", "自定义颜色");
    wheel.append(picker);
    const hexText = element("span", "icon-color-hex");
    colorRow.append(...swatches, wheel, hexText);
    colorWrapper.append(colorLabel, colorRow);

    toolbar.append(colorWrapper, sizeField, formatField, scaleField);

    function setColor(hex) {
      state.color = hex.toUpperCase();
      picker.value = state.color.toLowerCase();
      hexText.textContent = state.color;
      let preset = false;
      swatches.forEach((swatch) => {
        const active = swatch.dataset.hex === state.color;
        preset = preset || active;
        swatch.setAttribute("aria-pressed", String(active));
      });
      wheel.classList.toggle("is-active", !preset);
      update();
    }

    function update() {
      // PNG scale only applies to PNG; hide it rather than inventing a disabled state.
      scaleField.hidden = state.format !== "png";
      renderIconResults(results, catalog.icons || [], state);
    }

    picker.addEventListener("input", () => setColor(picker.value));

    wrapper.append(toolbar, results);
    setColor(state.color);
    return wrapper;
  }

  function renderIconResults(root, icons, state) {
    const size = state.size;
    if (!icons.length) {
      const message = (catalog.icons || []).length
        ? "没有符合当前条件的图标。"
        : "图标资源尚未提供。把 SVG 放入 assets/icons/source 后重新构建即可。";
      root.replaceChildren(element("div", "icon-empty", message));
      return;
    }

    const grid = element("div", "icon-grid");
    icons.forEach((icon) => {
      const card = element("article", "icon-card");
      const preview = element("div", "icon-preview");
      preview.style.color = state.color;
      const svgHost = element("span", "icon-svg-host");
      svgHost.style.width = `${size}px`;
      svgHost.style.height = `${size}px`;
      const svg = createSafeSvg(icon.svg, size);
      if (svg) {
        svgHost.append(svg);
      } else {
        svgHost.textContent = "无效 SVG";
      }
      preview.append(svgHost);

      const title = element("strong", "icon-card-title", icon.id);
      title.title = icon.description || icon.name;
      const actions = element("div", "icon-actions");
      const copyButton = button("复制 SVG", () => copySvg(icon, state));
      const downloadLabel =
        state.format === "png" ? `下载 PNG ${state.scale}x` : "下载 SVG";
      const downloadButton = button(downloadLabel, () => downloadIcon(icon, state));
      actions.append(copyButton, downloadButton);
      card.append(preview, title, actions);
      grid.append(card);
    });
    root.replaceChildren(grid);
  }

  // Bakes the chosen color and size into the exported SVG markup.
  function buildIconMarkup(icon, state) {
    const svg = createSafeSvg(icon.svg, state.size);
    if (!svg) return null;
    svg.removeAttribute("aria-hidden");
    return new XMLSerializer()
      .serializeToString(svg)
      .replace(/currentColor/g, state.color);
  }

  async function copySvg(icon, state) {
    const markup = buildIconMarkup(icon, state);
    if (!markup) {
      showToast("SVG 未通过安全检查。");
      return;
    }
    const copied = await copyText(markup);
    showToast(
      copied
        ? `已复制 ${icon.id}.svg`
        : "浏览器未允许复制，请使用本地服务器预览。"
    );
  }

  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`已下载 ${filename}`);
  }

  async function downloadIcon(icon, state) {
    const markup = buildIconMarkup(icon, state);
    if (!markup) {
      showToast("SVG 未通过安全检查。");
      return;
    }
    const baseName = `${icon.id}-${state.size}`;
    if (state.format !== "png") {
      saveBlob(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }), `${baseName}.svg`);
      return;
    }
    try {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
      await image.decode();
      const pixels = state.size * state.scale;
      const canvas = document.createElement("canvas");
      canvas.width = pixels;
      canvas.height = pixels;
      canvas.getContext("2d").drawImage(image, 0, 0, pixels, pixels);
      canvas.toBlob((blob) => {
        if (blob) saveBlob(blob, `${baseName}@${state.scale}x.png`);
        else showToast("PNG 导出失败，请使用 Chrome 打开。");
      }, "image/png");
    } catch {
      showToast("PNG 导出失败，请使用 Chrome 打开。");
    }
  }

  function createSafeSvg(svgMarkup, size) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(svgMarkup, "image/svg+xml");
    const svg = parsed.documentElement;
    const forbidden = parsed.querySelector(
      "parsererror, script, foreignObject, iframe, object, embed"
    );
    if (forbidden || svg.localName !== "svg") return null;

    parsed.querySelectorAll("*").forEach((node) => {
      Array.from(node.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim().toLowerCase();
        if (
          name.startsWith("on") ||
          name === "href" ||
          name === "xlink:href" ||
          (name === "style" && value.includes("url("))
        ) {
          node.removeAttribute(attribute.name);
        }
      });
    });

    const safeSvg = document.importNode(svg, true);
    safeSvg.setAttribute("width", String(size));
    safeSvg.setAttribute("height", String(size));
    safeSvg.setAttribute("aria-hidden", "true");
    return safeSvg;
  }

  function button(label, handler) {
    const control = element("button", "", label);
    control.type = "button";
    control.addEventListener("click", handler);
    return control;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Continue to the local-file fallback.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function closeMobileNavigation() {
    sidebar.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开目录");
  }

  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
  }
})();
