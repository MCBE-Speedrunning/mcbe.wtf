class McbeThemeSwitchElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-theme-switch");
  static #themeKey = "mcbe-theme";
  static #lightTheme = "light";
  static #darkTheme = "dark";
  static #contrastTheme = "contrast";
  /** @type HTMLInputElement */
  #toggleGroupElement;
  /** @type HTMLButtonElement[] */
  #colorSchemeButtons = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.#toggleGroupElement = document.createElement("fieldset");
    this.#toggleGroupElement.className = "ds-toggle-group";
    this.#toggleGroupElement.addEventListener(
      "change",
      this.#changeTheme.bind(this),
    );

    const theme = McbeThemeSwitchElement.#getThemeFromStorage();
    localStorage.setItem(McbeThemeSwitchElement.#themeKey, theme);
    document.querySelector("html").dataset.colorScheme = theme;

    for (const colorScheme of [
      McbeThemeSwitchElement.#lightTheme,
      McbeThemeSwitchElement.#darkTheme,
      // Contrast has been disabled for now
      // https://github.com/digdir/designsystemet/pull/2827
      // McbeThemeSwitchElement.#contrastTheme,
    ]) {
      const label = document.createElement("label");
      label.className = "ds-button";
      label.dataset.variant = "tertiary";
      label.textContent = colorScheme;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "colorscheme";
      input.value = colorScheme;
      input.checked = colorScheme === theme;
      label.appendChild(input);
      this.#colorSchemeButtons.push(label);
      this.#toggleGroupElement.appendChild(label);
    }

    this.appendChild(this.#toggleGroupElement);
  }

  disconnectedCallback() {
    this.#colorSchemeButtons.forEach((btn) =>
      btn.addEventListener("click", this.#changeTheme.bind(this)),
    );
  }

  /**
   * @param {ChangeEvent} event
   */
  #changeTheme(event) {
    const theme = event.target.value;
    document.querySelector("html").dataset.colorScheme = theme;
    localStorage.setItem(McbeThemeSwitchElement.#themeKey, theme);
  }

  static #getThemeFromStorage() {
    return (
      localStorage.getItem(McbeThemeSwitchElement.#themeKey) ??
      (window.matchMedia("(prefers-color-scheme: dark)")
        ? McbeThemeSwitchElement.#darkTheme
        : McbeThemeSwitchElement.#lightTheme)
    );
  }
}

class McbeCopyCodeElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-copy-code");
  /** @type HTMLInputElement */
  #copyButton;
  static #callToAction = "Copy snippet";
  static #success = "Copied";
  static #failed = "Copy failed";

  constructor() {
    super();
  }

  connectedCallback() {
    this.#copyButton = document.createElement("button");
    this.#copyButton.className = "ds-button";
    this.#copyButton.dataset.variant = "primary";
    this.#copyButton.textContent = McbeCopyCodeElement.#callToAction;
    this.#copyButton.addEventListener("click", this.#copyCode.bind(this));
    this.appendChild(this.#copyButton);
  }

  disconnectedCallback() {
    this.#copyButton.removeEventListener("click", this.#copyCode.bind(this));
  }

  #copyCode() {
    console.log(this.dataset);
    navigator.clipboard
      .writeText(this.dataset.code)
      .then(() => {
        this.#copyButton.textContent = McbeCopyCodeElement.#success;
        setTimeout(
          () =>
            (this.#copyButton.textContent = McbeCopyCodeElement.#callToAction),
          6_000,
        );
      })
      .catch((err) => {
        console.error("Failed to copy", err);
        return (this.#copyButton.textContent = McbeCopyCodeElement.#failed);
      });
  }
}

customElements.define(McbeThemeSwitchElement.tagName, McbeThemeSwitchElement);
customElements.define(McbeCopyCodeElement.tagName, McbeCopyCodeElement);
