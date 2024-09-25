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

class McbeCalculatorRsElement extends HTMLDetailsElement {
  static tagName = "mcbe-calculator-rs";
  static spawnNumberXName = "spawn-x-number";
  static spawnNumberZName = "spawn-z-number";
  static observedAttributes = [
    McbeCalculatorRsElement.spawnNumberXName,
    McbeCalculatorRsElement.spawnNumberZName,
  ];
  /** @type ShadowRoot */
  #shadow;

  constructor() {
    // Always call super first in constructor
    debugger
    super();
  }

  connectedCallback() {
    debugger
    this.#shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   * @returns void
   */
  attributeChangedCallback(name, oldValue, newValue) {
    debugger
    this.render();
  }

  /**
   * @returns void
   */
  render() {
    const spawnNumberX = parseFloat(
      this.getAttribute(McbeCalculatorRsElement.spawnNumberXName),
    );
    const spawnNumberZ = parseFloat(
      this.getAttribute(McbeCalculatorRsElement.spawnNumberZName),
    );
    const result = calculateCoordinates(spawnNumberX, spawnNumberZ);
    this.#shadow.innerHTML = `<details>
    <summary>Results</summary>
    From X: ${result.spawnX}
    From Z: ${result.spawnZ}
    To X: ${result.spawnToX}
    To Z: ${result.spawnToZ}
    <br />
    <br />
    ⬅️ : ${result.positiveX}
    ⬆️ : ${result.positiveZ}
    <br />
    ➡️ : ${result.negativeX}
    ⬇️ : ${result.negativeZ}
    <br />
    ↖️ : X: ${result.midPositiveX} Z: ${result.midPositiveZ}
    <br />
    ↙️ : X: ${result.midPositiveX} Z: ${result.midNegativeZ}
    <br />
    ↘️ : X: ${result.midNegativeX} Z: ${result.midNegativeZ}
    <br />
    ↗️ : X: ${result.midNegativeX} Z: ${result.midPositiveZ}
</details>`;
  }
}

customElements.define(McbeCalculatorRsElement.tagName, McbeCalculatorRsElement, {
  extends: "div",
});

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
