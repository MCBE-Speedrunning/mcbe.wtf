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
    document.startViewTransition(() => {
      document.querySelector("html").dataset.colorScheme = theme;
    });
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

function determineTransitionType(currentURL, destinationURL) {
  // Find the index number of a page
  function determinePageIndex(url) {
    // Split the URL at the "/" character
    const array = url.split("/");
    return array.length;
  }

  // Get the page index of the current and destination URLs
  const currentPageIndex = determinePageIndex(currentURL);
  const destinationPageIndex = determinePageIndex(destinationURL);

  // Return "forwards" or "backwards" depending on whether currentPageIndex
  // is bigger or smaller than destinationPageIndex
  if (currentPageIndex > destinationPageIndex) {
    return "backwards";
  } else if (currentPageIndex <= destinationPageIndex) {
    return "forwards";
  }
};

function pageswap(e) {
  if (!e.viewTransition) return;
  // Grab the old and new navigation entries on the outgoing page from the pageswap event object's
  // activation property, pass these to the determineTransitionType() function to determine the type
  const transitionType = determineTransitionType(
    // Grab the current and destination URLs from the provided navigation entries
    e.activation.from.url,
    e.activation.entry.url,
  );
  // Add the type to the active ViewTransition via its types property
  e.viewTransition.types.add(transitionType);
}

function pagereveal(e) {
  if (!e.viewTransition) return;
  // Grab the old and new navigation entries on the incoming page from the Navigation.activation
  // object, pass these to the determineTransitionType() function to determine the type
  const transitionType = determineTransitionType(
    // Grab the current and destination URLs from the provided navigation entries
    navigation.activation.from.url,
    navigation.activation.entry.url,
  );

  // If the type is undefined, don't add anything to the transition types
  if (transitionType !== undefined) {
    // Add the type to the active ViewTransition via its types property
    e.viewTransition.types.add(transitionType);
  }
}

window.addEventListener("pageswap", pageswap);
window.addEventListener("pagereveal", pagereveal);

customElements.define(McbeThemeSwitchElement.tagName, McbeThemeSwitchElement);
customElements.define(McbeCopyCodeElement.tagName, McbeCopyCodeElement);
