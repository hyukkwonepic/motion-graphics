let VIEW = "mobile";
let TEXT = "SAKURANBO";
let ROW_COUNT = 8;
let COL_COUNT = 8;
let LENGTH = `${100 / COL_COUNT}vw`;

const setConfigForMobile = () => {
  ROW_COUNT = 8;
  COL_COUNT = 8;
  LENGTH = `${100 / COL_COUNT}vw`;
};

const setConfigForTablet = () => {
  ROW_COUNT = 8;
  COL_COUNT = 8;
  LENGTH = "64px";
  VIEW = "tablet";
};

const setConfigForDesktop = () => {
  ROW_COUNT = 8;
  COL_COUNT = 12;
  LENGTH = "88px";
};

const getRootEl = () => document.querySelector("#root");

const getContainerEl = () => document.querySelector(".container");

const getFirstGridItem = () => {
  const containerEl = getContainerEl();
  return containerEl.firstChild;
};

const getGridItemEls = () => {
  const containerEl = getContainerEl();
  return Array.from(containerEl.children);
};

const getCharacters = () => {
  const totalCount = ROW_COUNT * COL_COUNT;
  const characters = TEXT.repeat(Math.ceil(totalCount / TEXT.length))
    .slice(0, totalCount)
    .split("");

  return characters;
};

const getGridItemRow = (index) => Math.floor(index / COL_COUNT) + 1;
const getGridItemCol = (index) => (index % COL_COUNT) + 1;
const getGridItemMatrix = (index) => {
  const row = getGridItemRow(index);
  const col = getGridItemCol(index);
  return { row, col };
};

const getDistanceBetweenAB = (pointA, pointB) => {
  const { rowA, colA } = pointA;
  const { rowB, colB } = pointB;
  return Math.sqrt(
    Math.abs(Math.pow(rowA - rowB, 2)) + Math.abs(Math.pow(colA - colB, 2))
  );
};

const getTransformScale = (distance, weighting = 1) => {
  if (distance === 0) {
    return 1 * weighting;
  }

  return (1 / distance) * weighting;
};

const updateGridItemElByScale = (gridItemEl, scale) => {
  const gridItemTextEl = gridItemEl.firstChild;

  let fontWeight = 400;
  if (scale >= 0.3) {
    fontWeight = 500;
  }
  if (scale >= 0.5) {
    fontWeight = 700;
  }

  gridItemTextEl.dataset.scale = scale;
  gridItemTextEl.style.transform = `scale(${scale})`;
  gridItemTextEl.style.color = `hsl(${321 + 15 * scale}deg 100% 49%)`;
  gridItemTextEl.style["font-weight"] = fontWeight;
};

const renderContainerEl = () => {
  const containerEl = document.createElement("div");
  containerEl.setAttribute("class", "container");
  containerEl.setAttribute(
    "style",
    `
    grid-template-rows: repeat(${ROW_COUNT}, ${LENGTH});
    grid-template-columns: repeat(${COL_COUNT}, ${LENGTH});
    `
  );
  return containerEl;
};

const renderGridItemEl = (row, col, character) => {
  const gridItemEl = document.createElement("div");

  gridItemEl.setAttribute("class", "grid-item");
  gridItemEl.setAttribute("data-row", row);
  gridItemEl.setAttribute("data-col", col);

  gridItemEl.addEventListener("mouseover", handleGridItemMouseover);

  const gridItemTextEl = renderGridItemTextEl(character);
  gridItemEl.append(gridItemTextEl);

  return gridItemEl;
};

const handleGridItemMouseover = (ev) => {
  const targetGridItemEl = ev.currentTarget;

  const gridItemEls = getGridItemEls();
  gridItemEls.forEach((gridItemEl) => {
    const { row, col } = gridItemEl.dataset;
    const { row: targetRow, col: targetCol } = targetGridItemEl.dataset;
    const distance = getDistanceBetweenAB(
      { rowA: row, colA: col },
      { rowB: targetRow, colB: targetCol }
    );
    const scale = getTransformScale(distance, 1.25);
    updateGridItemElByScale(gridItemEl, scale);
  });
};

const renderGridItemTextEl = (character) => {
  const gridItemTextEl = document.createElement("span");
  gridItemTextEl.setAttribute("class", "grid-item-text");
  gridItemTextEl.append(character);

  return gridItemTextEl;
};

const triggerInitialEvent = () => {
  const mouseoverEvent = new Event("mouseover");
  const firstGridItem = getFirstGridItem();
  firstGridItem.dispatchEvent(mouseoverEvent);
};

const render = () => {
  const rootEl = getRootEl();
  rootEl.innerHTML = "";
  const containerEl = renderContainerEl();
  rootEl.append(containerEl);

  const characters = getCharacters();
  characters.forEach((character, i) => {
    const { row, col } = getGridItemMatrix(i, COL_COUNT);
    const gridItemEl = renderGridItemEl(row, col, character);
    containerEl.append(gridItemEl);
  });

  triggerInitialEvent();
};

window.addEventListener("load", () => {
  if (window.innerWidth >= 1280) {
    setConfigForDesktop();
  } else if (window.innerWidth >= 768) {
    setConfigForTablet();
  } else {
    setConfigForMobile();
  }

  render();
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1280 && VIEW !== "desktop") {
    setConfigForDesktop();
    VIEW = "desktop";
    render();
    return;
  }

  if (
    window.innerWidth >= 768 &&
    window.innerWidth < 1280 &&
    VIEW !== "tablet"
  ) {
    setConfigForTablet();
    render();
    return;
  }

  if (window.innerWidth < 768 && VIEW !== "mobile") {
    setConfigForMobile();
    VIEW = "mobile";
    render();
    return;
  }
});
