/// <reference lib="dom" />

/** @typedef {Object} PlayStoreCodes
 * @property {string?} armeabi-v7a
 * @property {string?} arm64-v8a
 * @property {string?} x86
 * @property {string?} x86_64
 */

/** @typedef {Object} PlayStoreVersion
 * @property {string} version_name
 * @property {PlayStoreCodes} codes
 * @property {boolean?} beta
 */

class McbeAndroidVersionPickerElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-android-version-picker");
  static #inputEventName = /** @type {keyof HTMLElementEventMap} */ ("keyup");
  static #betaToggleEventName = /** @type {keyof HTMLElementEventMap} */ (
    "change"
  );
  /**
   * Enum for the fetch status of the version list call.
   * @readonly
   * @enum {number}
   */
  static #fetchStatusEnum = {
    LOADING: 1,
    SUCCESS: 2,
    FAILED: 3,
  };
  /** @type {number} */
  #fetchStatus = McbeAndroidVersionPickerElement.#fetchStatusEnum.LOADING;
  /** @type ShadowRoot */
  #shadow;
  /** @type HTMLStyleElement */
  #styles;
  /** @type HTMLDivElement */
  #versionListElement;
  /** @type HTMLInputElement */
  #inputElement;
  /** @type HTMLInputElement */
  #betaToggleElement;
  /** @type PlayStoreVersion[] */
  #playStoreVersions;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.#playStoreVersions) {
      fetch("/android-versions-playstore.json")
        .then((res) => {
          if (res.ok) return res.json();
          else {
            throw new Error(
              "Couldn't get version list. Status code: " + res.status,
            );
          }
        })
        .then((res) => {
          this.#playStoreVersions = res;
          this.#fetchStatus =
            McbeAndroidVersionPickerElement.#fetchStatusEnum.SUCCESS;
          this.#renderList();
        })
        .catch((err) => {
          console.error(err);
          this.#fetchStatus =
            McbeAndroidVersionPickerElement.#fetchStatusEnum.FAILED;
          this.#renderList();
        });
    }
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#styles = document.createElement("style");
    this.#versionListElement = document.createElement("div");
    this.#inputElement = document.createElement("input");
    this.#betaToggleElement = document.createElement("input");
    const inputLabel = document.createElement("label");
    const betaToggleLabel = document.createElement("label");

    inputLabel.innerText = "Filter version";
    betaToggleLabel.innerText = "Include beta versions?";
    inputLabel.htmlFor = "input-element";
    this.#inputElement.id = "input-element";
    this.#inputElement.placeholder = "1.2.13";
    betaToggleLabel.htmlFor = "beta-toggle";
    this.#betaToggleElement.id = "beta-toggle";
    this.#betaToggleElement.type = "checkbox";

    this.#shadow.appendChild(this.#styles);
    this.#shadow.appendChild(inputLabel);
    this.#shadow.appendChild(this.#inputElement);
    this.#shadow.appendChild(betaToggleLabel);
    this.#shadow.appendChild(this.#betaToggleElement);
    this.#shadow.appendChild(this.#versionListElement);
    this.#styles.innerHTML = `
      p {
        margin-top: 0;
        margin-bottom: 0;
      }
      label {
        display: block;
      }
    `;
    this.#inputElement.addEventListener(
      McbeAndroidVersionPickerElement.#inputEventName,
      this.#renderList.bind(this),
    );
    this.#betaToggleElement.addEventListener(
      McbeAndroidVersionPickerElement.#betaToggleEventName,
      this.#renderList.bind(this),
    );
  }

  #renderList() {
    this.#versionListElement.innerHTML = this.#getList(
      this.#inputElement.value,
      this.#betaToggleElement.checked,
    );
  }

  /**
   * @param {string} textFilter
   * @param {boolean} includeBetaVersions
   */
  #getList(textFilter, includeBetaVersions) {
    switch (this.#fetchStatus) {
      case McbeAndroidVersionPickerElement.#fetchStatusEnum.LOADING:
        return `<p>Loading...</p>`;
      case McbeAndroidVersionPickerElement.#fetchStatusEnum.FAILED:
        return `<p>An error has occured. Please try again later</p>`;
      case McbeAndroidVersionPickerElement.#fetchStatusEnum.SUCCESS: {
        const list = this.#playStoreVersions.filter((s) => {
          const textMatch = s.version_name.startsWith(textFilter.toLowerCase());
          const betaFilter = includeBetaVersions ? true : !(s.beta ?? false);
          return textMatch && betaFilter;
        });
        const groupedByMajorMinor = Object.groupBy(list, (i) => {
          const [major, minor] = i.version_name.split(".");
          return `${major}.${minor}`;
        });
        return `
          ${Object.entries(groupedByMajorMinor)
            .map(
              ([titleVersion, versions]) => `
                <details${
                  Object.keys(groupedByMajorMinor).length === 1 ? " open" : ""
                }>
                  <summary>${titleVersion}</summary>
                  ${versions
                    .map(
                      (p) => `
                        <h3>${p.version_name}</h3>
                        <p>${p.beta ? "Beta version" : ""}</p>
                        <ul>
                          ${Object.entries(p.codes)
                            .map(
                              ([arch, version]) =>
                                `<li>${arch}: ${version}</li>`,
                            )
                            .join("")}
                        </ul>
                  `,
                    )
                    .join("")}
                </details>
                `,
            )
            .join("")}`;
      }
    }
  }

  disconnectedCallback() {
    this.#inputElement.removeEventListener(
      McbeAndroidVersionPickerElement.#inputEventName,
      this.#renderList.bind(this),
    );
    this.#betaToggleElement.removeEventListener(
      McbeAndroidVersionPickerElement.#betaToggleEventName,
      this.#renderList.bind(this),
    );
  }
}

customElements.define(
  McbeAndroidVersionPickerElement.tagName,
  McbeAndroidVersionPickerElement,
);
