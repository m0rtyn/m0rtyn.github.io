/**
 * LinkCard Web Component
 * A custom element for displaying project cards with hover effects.
 *
 * @element link-card
 * @attr {string} title - Card title
 * @attr {string} description - Card description
 * @attr {string} link - URL to navigate to
 * @attr {string} icon - Emoji icon
 * @attr {string} delay - Optional animation delay override
 */

const ANIMATION = {
  baseDelay: 0.2,
  delayStep: 0.05,
};

// Shared stylesheet for all instances
const styleSheet = new CSSStyleSheet();
const cssLoaded = fetch(new URL('./styles.css', import.meta.url))
  .then((res) => res.text())
  .then((css) => styleSheet.replace(css));

// Shared HTML template
let htmlTemplate = '';
const htmlLoaded = fetch(new URL('./template.html', import.meta.url))
  .then((res) => res.text())
  .then((html) => (htmlTemplate = html));

/**
 * Interpolates template placeholders: {{key}} → value
 * @param {string} template
 * @param {Record<string, string>} data
 * @returns {string}
 */
const interpolate = (template, data) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');

// Shared IntersectionObserver for pausing animations when offscreen
const visibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const card = entry.target.shadowRoot?.querySelector('.card');
      if (card) {
        card.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      }
    });
  },
  { rootMargin: '50px' }
);

class LinkCard extends HTMLElement {
  static observedAttributes = ['title', 'description', 'link', 'icon', 'delay'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
    this._initialized = false;
    this._mouseMoveHandler = null;
    this._rafTicking = false;
  }

  connectedCallback() {
    this.style.setProperty('--enter-delay', this._getAnimationDelay());

    if (!this._initialized) {
      Promise.all([cssLoaded, htmlLoaded]).then(() => {
        this._render();
        this._initialized = true;
        // Start observing for visibility-based animation pausing
        visibilityObserver.observe(this);
      });
    } else {
      visibilityObserver.observe(this);
    }
  }

  disconnectedCallback() {
    // Cleanup: unobserve and remove event listener
    visibilityObserver.unobserve(this);
    const card = this.shadowRoot?.querySelector('.card');
    if (card && this._mouseMoveHandler) {
      card.removeEventListener('mousemove', this._mouseMoveHandler);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this._initialized) {
      this._render();
    }
  }

  /**
   * Calculates staggered animation delay based on sibling index
   * @returns {string}
   */
  _getAnimationDelay() {
    const customDelay = this.getAttribute('delay');
    if (customDelay) return customDelay;

    const parent = this.parentElement;
    if (!parent) return `${ANIMATION.baseDelay}s`;

    const siblings = Array.from(parent.querySelectorAll('link-card'));
    const index = siblings.indexOf(this);
    return `${ANIMATION.baseDelay + index * ANIMATION.delayStep}s`;
  }

  /**
   * Renders component content
   */
  _render() {
    if (!this.shadowRoot || !htmlTemplate) return;

    const data = {
      title: this.getAttribute('title') ?? 'Untitled',
      description: this.getAttribute('description') ?? '',
      link: this.getAttribute('link') ?? '#',
      icon: this.getAttribute('icon') ?? '🔗',
    };

    this.shadowRoot.innerHTML = interpolate(htmlTemplate, data);
    this._setupMouseTracking();
  }

  /**
   * Sets up throttled mouse position tracking for aurora glow effect
   */
  _setupMouseTracking() {
    const card = this.shadowRoot?.querySelector('.card');
    if (!card) return;

    // Remove old handler if exists
    if (this._mouseMoveHandler) {
      card.removeEventListener('mousemove', this._mouseMoveHandler);
    }

    // Throttle mousemove with requestAnimationFrame
    this._mouseMoveHandler = (e) => {
      if (this._rafTicking) return;
      this._rafTicking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        this._rafTicking = false;
      });
    };

    card.addEventListener('mousemove', this._mouseMoveHandler, { passive: true });
  }
}

customElements.define('link-card', LinkCard);
