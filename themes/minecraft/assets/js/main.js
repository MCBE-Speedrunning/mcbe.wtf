class McbeThemeSwitchElement extends HTMLElement {
  static tagName = /** @type {const} */ ("mcbe-theme-switch");
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
    document.querySelector("html").dataset.colorScheme = this
      .#themeToggleElement.checked
      ? "dark"
      : "light";
  }
}

customElements.define(McbeThemeSwitchElement.tagName, McbeThemeSwitchElement);
