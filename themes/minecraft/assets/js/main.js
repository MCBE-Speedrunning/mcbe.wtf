class McbeThemeSwitchElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-theme-switch");
  static #themeKey = "mcbe-theme";
  static #lightTheme = "light";
  static #darkTheme = "dark";
  /** @type HTMLInputElement */
  #themeToggleElement;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#themeToggleElement = document.createElement("input");
    this.#themeToggleElement.className = "ds-input";
    this.#themeToggleElement.role = "switch";
    this.#themeToggleElement.id = "theme-toggle";
    this.#themeToggleElement.type = "checkbox";
    const theme = McbeThemeSwitchElement.#getThemeFromStorage();
    this.#themeToggleElement.checked =
      theme === McbeThemeSwitchElement.#darkTheme;
    localStorage.setItem(McbeThemeSwitchElement.#themeKey, theme);
    document.querySelector("html").dataset.colorScheme = theme;

    this.appendChild(this.#themeToggleElement);
    this.#themeToggleElement.addEventListener(
      "change",
      this.#toggleTheme.bind(this),
    );
  }

  disconnectedCallback() {
    this.#themeToggleElement.removeEventListener(
      "change",
      this.#toggleTheme.bind(this),
    );
  }

  #toggleTheme() {
    const theme = this.#themeToggleElement.checked
      ? McbeThemeSwitchElement.#darkTheme
      : McbeThemeSwitchElement.#lightTheme;
    document.querySelector("html").dataset.colorScheme = theme;
    localStorage.setItem(McbeThemeSwitchElement.#themeKey, theme);
  }

  static #getThemeFromStorage() {
    return (localStorage.getItem(McbeThemeSwitchElement.#themeKey) ??
      window.matchMedia("(prefers-color-scheme: dark)"))
      ? McbeThemeSwitchElement.#darkTheme
      : McbeThemeSwitchElement.#lightTheme;
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
