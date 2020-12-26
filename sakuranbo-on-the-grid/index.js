(() => {
  const containerGridEl = document.querySelector(".container");
  const TEXT = "SAKURANBO";

  let ROW = 8;
  let COL = 8;

  if (window.innerWidth >= 1280) {
    ROW = 8;
    COL = 12;
  }

  let length = `${100 / COL}vw)`;
  if (window.innerWidth >= 768) {
    length = "64px";
  }

  if (window.innerWidth >= 1280) {
    length = "88px";
  }

  containerGridEl.style["grid-template-columns"] = `repeat(${COL}, ${length}`;

  const gridItemEls = TEXT.repeat(20)
    .slice(0, ROW * COL)
    .split("")
    .map((character, i) => {
      const row = Math.floor(i / COL) + 1;
      const col = (i % COL) + 1;
      return `<div class="grid-item" data-row="${row}" data-col="${col}"><span class="grid-item-text">${character}</span></div>`;
    })
    .join("");
  containerGridEl.innerHTML = gridItemEls;

  const containerEl = document.querySelector(".container");
  Array.from(containerEl.children).forEach((gridItemEl) => {
    gridItemEl.addEventListener("mouseover", (ev) => {
      const targetGridItemEl = ev.currentTarget;
      const { row: targetRow, col: targetCol } = targetGridItemEl.dataset;

      Array.from(containerEl.children).forEach((gridItemEl) => {
        const gridItemTextEl = gridItemEl.firstChild;
        const { row, col } = gridItemEl.dataset;

        const scaleValue =
          gridItemEl === targetGridItemEl
            ? 1
            : 1 /
              Math.sqrt(
                Math.abs(Math.pow(targetRow - row, 2)) +
                  Math.abs(Math.pow(targetCol - col, 2))
              );

        let fontWeight = 400;
        if (scaleValue >= 0.3) {
          fontWeight = 500;
        }
        if (scaleValue >= 0.5) {
          fontWeight = 700;
        }

        gridItemTextEl.style.transform = `scale(${scaleValue})`;
        gridItemTextEl.style.color = `hsl(${
          321 + 15 * scaleValue
        }deg 100% 49%)`;

        gridItemTextEl.style["font-weight"] = fontWeight;
      });
    });
  });

  containerGridEl.firstChild.dispatchEvent(new Event("mouseover"));
})();
