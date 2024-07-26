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

/** @type {NodeListOf<HTMLFormElement>} */
const forms = document.querySelectorAll("form.rs-calc");

if (!forms.length) throw new Error("Form not found");

forms.forEach((e) =>
  e.addEventListener("submit", (e) => {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.target;

    const data = new FormData(form);

    const spawnX = data.get("spawn-x");
    const spawnZ = data.get("spawn-z");

    const spawnXNumber = Number(spawnX);
    const spawnZNumber = Number(spawnZ);

    const result = calculateCoordinates(spawnXNumber, spawnZNumber);

    form
      .querySelectorAll(".spawnX")
      .forEach((e) => (e.innerText = result.spawnX));
    form
      .querySelectorAll(".spawnZ")
      .forEach((e) => (e.innerText = result.spawnZ));

    form
      .querySelectorAll(".positiveX")
      .forEach((e) => (e.innerText = result.positiveX));
    form
      .querySelectorAll(".positiveZ")
      .forEach((e) => (e.innerText = result.positiveZ));

    form
      .querySelectorAll(".negativeX")
      .forEach((e) => (e.innerText = result.negativeX));
    form
      .querySelectorAll(".negativeZ")
      .forEach((e) => (e.innerText = result.negativeZ));

    form
      .querySelectorAll(".midPositiveX")
      .forEach((e) => (e.innerText = result.midPositiveX));
    form
      .querySelectorAll(".midPositiveZ")
      .forEach((e) => (e.innerText = result.midPositiveZ));

    form
      .querySelectorAll(".midNegativeX")
      .forEach((e) => (e.innerText = result.midNegativeX));
    form
      .querySelectorAll(".midNegativeZ")
      .forEach((e) => (e.innerText = result.midNegativeZ));

    form
      .querySelectorAll(".spawnToX")
      .forEach((e) => (e.innerText = result.spawnToX));
    form
      .querySelectorAll(".spawnToZ")
      .forEach((e) => (e.innerText = result.spawnToZ));

    form
      .querySelectorAll("details")
      .forEach((e) => (e.open = true));
  }),
);
