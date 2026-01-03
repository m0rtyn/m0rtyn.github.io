// Load styles once for all component instances
const styleSheet = new CSSStyleSheet();
const cssLoaded = fetch(new URL('./link-card.css', import.meta.url))
  .then((r) => r.text())
  .then((css) => styleSheet.replace(css));

// Load HTML template once for all component instances
let htmlTemplate = '';
const htmlLoaded = fetch(new URL('./link-card.html', import.meta.url))
  .then((r) => r.text())
  .then((html) => (htmlTemplate = html));

const BASE_DELAY = 0.2; // Initial delay in seconds
const DELAY_STEP = 0.05; // Delay step between cards

/**
 * Simple template interpolation: replaces {{key}} with values
 * @param {string} template
 * @param {Record<string, string>} data
 */
const interpolate = (template, data) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');

class LinkCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) return;
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
    Promise.all([cssLoaded, htmlLoaded]).then(() => this.render());
  }

  static get observedAttributes() {
    return ['title', 'description', 'link', 'icon', 'delay'];
  }

  /**
   * Calculates animation delay:
   * 1. If delay attribute is set — uses it
   * 2. Otherwise calculates based on index among link-card siblings in parent
   */
  getAnimationDelay() {
    const delayAttr = this.getAttribute('delay');
    if (delayAttr) {
      return delayAttr;
    }

    // Automatic calculation based on index
    const parent = this.parentElement;
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll('link-card'));
      const index = siblings.indexOf(this);
      return `${BASE_DELAY + index * DELAY_STEP}s`;
    }

    return `${BASE_DELAY}s`;
  }

  connectedCallback() {
    // Set delay when element is added to DOM
    this.style.setProperty('--enter-delay', this.getAnimationDelay());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    if (!this.shadowRoot || !htmlTemplate) return;

    const data = {
      title: this.getAttribute('title') || 'No Title',
      description: this.getAttribute('description') || 'No description provided.',
      link: this.getAttribute('link') || '#',
      icon: this.getAttribute('icon') || '🔗',
    };

    this.shadowRoot.innerHTML = interpolate(htmlTemplate, data);

    const card = /** @type {HTMLElement | null} */ (
      this.shadowRoot.querySelector('.card')
    );
    if (card) {
      card.addEventListener('mousemove', (/** @type {MouseEvent} */ e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    }
  }
}

customElements.define('link-card', LinkCard);