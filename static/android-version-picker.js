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
  /** @type Element */
  #root;
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
    // this.#root = this.attachShadow({ mode: "open" });
    this.#root = this;
    this.#styles = document.createElement("style");
    this.#versionListElement = document.createElement("div");
    const fieldset = document.createElement("fieldset");
    const inputField = document.createElement("div");
    const betaToggleField = document.createElement("div");
    const legend = document.createElement("legend");
    this.#inputElement = document.createElement("input");
    this.#betaToggleElement = document.createElement("input");
    const inputLabel = document.createElement("label");
    const betaToggleLabel = document.createElement("label");

    legend.innerText = "Filter settings";
    legend.className = "ds-label";
    fieldset.className = "ds-fieldset";
    inputField.className = "ds-field";
    betaToggleField.className = "ds-field";
    inputLabel.innerText = "Filter version";
    betaToggleLabel.innerText = "Include beta versions?";
    inputLabel.htmlFor = "input-element";
    inputLabel.className = "ds-label";
    betaToggleLabel.className = "ds-label";
    this.#inputElement.id = "input-element";
    this.#inputElement.className = "ds-input";
    this.#betaToggleElement.className = "ds-input";
    this.#betaToggleElement.role = "switch";
    this.#inputElement.placeholder = "1.2.13";
    betaToggleLabel.htmlFor = "beta-toggle";
    this.#betaToggleElement.id = "beta-toggle";
    this.#betaToggleElement.type = "checkbox";

    this.#root.appendChild(this.#styles);
    inputField.appendChild(inputLabel);
    inputField.appendChild(this.#inputElement);
    betaToggleField.appendChild(this.#betaToggleElement);
    betaToggleField.appendChild(betaToggleLabel);
    fieldset.appendChild(legend);
    fieldset.appendChild(inputField);
    fieldset.appendChild(betaToggleField);
    this.#root.appendChild(fieldset);
    this.#root.appendChild(this.#versionListElement);
    this.#styles.innerHTML = `
      ${McbeAndroidVersionPickerElement.tagName} p {
        margin-top: 0;
        margin-bottom: 0;
      }
      ${McbeAndroidVersionPickerElement.tagName} fieldset {
        margin-bottom: 16px;
      }
      ${McbeAndroidVersionPickerElement.tagName} label {
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
                <details class="ds-details" data-color="neutral" ${
                  Object.keys(groupedByMajorMinor).length === 1 ? " open" : ""
                }>
                  <summary>${titleVersion}</summary>
                  <div>
                    ${versions
                      .map(
                        (p) => `
                          <h3 class="ds-heading" data-size="lg">${p.version_name}</h3>
                          ${p.beta ? '<span class="ds-tag" data-color="brand2">Beta version</span>' : ""}
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
                </div>
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
