/// <reference lib="dom" />

/**
 * @typedef {object} Coordinates
 * @property {number} positiveX
 * @property {number} positiveZ
 * @property {number} negativeX
 * @property {number} negativeZ
 *
 * @property {number} midPositiveX
 * @property {number} midPositiveZ
 * @property {number} midNegativeX
 * @property {number} midNegativeZ
 *
 * @property {number} spawnX
 * @property {number} spawnZ
 * @property {number} spawnToX
 * @property {number} spawnToZ
 */

/**
 * @param {number} spawnX
 * @param {number} spawnZ
 *
 * @returns {Coordinates}
 */
function calculateCoordinates(spawnX, spawnZ) {
  // Convert to chunk Coords (no decimals)
  const spawnXCoordinate = Math.floor(spawnX / 16);
  const spawnZCoordinate = Math.floor(spawnZ / 16);

  // Calculate positions
  const positiveX = (spawnXCoordinate + 5) * 16;
  const midPositiveX = (spawnXCoordinate + 3) * 16;
  const positiveZ = (spawnZCoordinate + 5) * 16;
  const midPositiveZ = (spawnZCoordinate + 3) * 16;
  const negativeX = (spawnXCoordinate - 4) * 16 - 1;
  const midNegativeX = (spawnXCoordinate - 2) * 16 - 1;
  const negativeZ = (spawnZCoordinate - 4) * 16 - 1;
  const midNegativeZ = (spawnZCoordinate - 2) * 16 - 1;

  const spawnXNormalised = spawnXCoordinate * 16;
  const spawnZNormalised = spawnZCoordinate * 16;

  const spawnToX = spawnXNormalised + 15;
  const spawnToZ = spawnZNormalised + 15;

  return {
    positiveX,
    midPositiveX,
    positiveZ,
    midPositiveZ,
    negativeX,
    midNegativeX,
    negativeZ,
    midNegativeZ,
    spawnX: spawnXNormalised,
    spawnZ: spawnZNormalised,
    spawnToX,
    spawnToZ,
  };
}

class McbeCalculatorRsElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-calculator-rs");
  static spawnNumberXName = /** @type {const} */ ("spawn-x-number");
  static spawnNumberZName = /** @type {const} */ ("spawn-z-number");
  static observedAttributes = /** @type {const} */ ([
    McbeCalculatorRsElement.spawnNumberXName,
    McbeCalculatorRsElement.spawnNumberZName,
  ]);
  /** @type ShadowRoot */
  #shadow;
  /** @type HTMLDetailsElement */
  #details;
  /** @type HTMLStyleElement */
  #styles;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#styles = document.createElement("style");
    this.#details = document.createElement("details");
    this.#shadow.appendChild(this.#styles);
    this.#shadow.appendChild(this.#details);
    this.#details.open = true;
    this.#styles.innerHTML = `p {
  margin-top: 0;
  margin-bottom: 0;
}`;
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const spawnNumberX = parseFloat(
      this.getAttribute(McbeCalculatorRsElement.spawnNumberXName),
    );
    const spawnNumberZ = parseFloat(
      this.getAttribute(McbeCalculatorRsElement.spawnNumberZName),
    );

    if (Number.isNaN(spawnNumberX) || Number.isNaN(spawnNumberZ)) {
      this.#details.style.display = "none";
      return;
    }

    const result = calculateCoordinates(spawnNumberX, spawnNumberZ);
    this.#details.style.display = "block";
    this.#details.innerHTML = `
    <summary>Results</summary>
    <p>
    From X: ${result.spawnX}
    From Z: ${result.spawnZ}
    To X: ${result.spawnToX}
    To Z: ${result.spawnToZ}
    </p>
    <p>
    ⬅️ : ${result.positiveX}
    ⬆️ : ${result.positiveZ}
    </p>
    <p>
    ➡️ : ${result.negativeX}
    ⬇️ : ${result.negativeZ}
    </p>
    <p>
    ↖️ : X: ${result.midPositiveX} Z: ${result.midPositiveZ}
    </p>
    <p>
    ↙️ : X: ${result.midPositiveX} Z: ${result.midNegativeZ}
    </p>
    <p>
    ↘️ : X: ${result.midNegativeX} Z: ${result.midNegativeZ}
    </p>
    <p>
    ↗️ : X: ${result.midNegativeX} Z: ${result.midPositiveZ}
    </p>`;
  }
}

customElements.define(McbeCalculatorRsElement.tagName, McbeCalculatorRsElement);

/** @type {NodeListOf<HTMLFormElement>} */
const forms = document.querySelectorAll("form.rs-calc");

if (!forms.length) throw new Error("Form not found");
forms.forEach((e) => {
  const calc = document.createElement(McbeCalculatorRsElement.tagName);
  e.appendChild(calc);
  e.addEventListener("submit", (e) => {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.target;

    const data = new FormData(form);

    const spawnX = data.get("spawn-x");
    const spawnZ = data.get("spawn-z");

    const calc = form.querySelector(McbeCalculatorRsElement.tagName);

    calc.setAttribute(McbeCalculatorRsElement.spawnNumberXName, spawnX);
    calc.setAttribute(McbeCalculatorRsElement.spawnNumberZName, spawnZ);
  });
});
