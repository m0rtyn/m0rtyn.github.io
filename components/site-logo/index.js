/**
 * SiteLogo Web Component
 * Displays "m0rtyn·cc" with randomized Unicode mathematical styles.
 *
 * @element site-logo
 */

const LOGO_CONFIG = {
  name: 'm0rtyn',
  suffix: 'cc',
  dot: '·',
};

/**
 * Unicode style definitions
 * Each style maps letters to mathematical Unicode variants
 */
const STYLES = [
  {
    name: 'regular',
    chars: { m: 'm', r: 'r', t: 't', y: 'y', n: 'n' },
    zero: '0',
  },
  {
    name: 'bold',
    chars: { m: '𝐦', r: '𝐫', t: '𝐭', y: '𝐲', n: '𝐧' },
    zero: '𝟎',
    zeroCSS: 'font-family:serif',
  },
  {
    name: 'italic',
    chars: { m: '𝑚', r: '𝑟', t: '𝑡', y: '𝑦', n: '𝑛' },
    zero: '0',
    zeroCSS: 'font-style:italic;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'bold-italic',
    chars: { m: '𝒎', r: '𝒓', t: '𝒕', y: '𝒚', n: '𝒏' },
    zero: '𝟎',
    zeroCSS: 'font-style:italic;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'script',
    chars: { m: '𝓂', r: '𝓇', t: '𝓉', y: '𝓎', n: '𝓃' },
    zero: '0',
    zeroCSS: 'font-style:italic;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'bold-script',
    chars: { m: '𝓶', r: '𝓻', t: '𝓽', y: '𝔂', n: '𝓷' },
    zero: '𝟎',
    zeroCSS: 'font-style:italic;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'fraktur',
    chars: { m: '𝔪', r: '𝔯', t: '𝔱', y: '𝔶', n: '𝔫' },
    zero: '0',
    zeroCSS: 'font-family:serif',
  },
  {
    name: 'bold-fraktur',
    chars: { m: '𝖒', r: '𝖗', t: '𝖙', y: '𝖞', n: '𝖓' },
    zero: '𝟎',
    zeroCSS: 'font-family:serif;font-weight:bold',
  },
  {
    name: 'double-struck',
    chars: { m: '𝕞', r: '𝕣', t: '𝕥', y: '𝕪', n: '𝕟' },
    zero: '𝟘',
  },
  {
    name: 'sans-bold',
    chars: { m: '𝗺', r: '𝗿', t: '𝘁', y: '𝘆', n: '𝗻' },
    zero: '𝟬',
  },
  {
    name: 'sans-italic',
    chars: { m: '𝘮', r: '𝘳', t: '𝘵', y: '𝘺', n: '𝘯' },
    zero: '0',
    zeroCSS: 'font-style:italic;font-family:sans-serif;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'sans-bold-italic',
    chars: { m: '𝙢', r: '𝙧', t: '𝙩', y: '𝙮', n: '𝙣' },
    zero: '𝟬',
    zeroCSS: 'font-style:italic;font-weight:bold;font-family:sans-serif;margin-left:-0.05em;margin-right:0.05em',
  },
  {
    name: 'monospace',
    chars: { m: '𝚖', r: '𝚛', t: '𝚝', y: '𝚢', n: '𝚗' },
    zero: '𝟶',
  },
];

// Shared stylesheet
const styleSheet = new CSSStyleSheet();
const cssLoaded = fetch(new URL('./styles.css', import.meta.url))
  .then((res) => res.text())
  .then((css) => styleSheet.replace(css));

// Shared HTML template
let htmlTemplate = '';
const htmlLoaded = fetch(new URL('./template.html', import.meta.url))
  .then((res) => res.text())
  .then((html) => (htmlTemplate = html));

/** Returns a random style */
const getRandomStyle = () => STYLES[Math.floor(Math.random() * STYLES.length)];

/**
 * Generates styled logo name HTML
 * @param {typeof STYLES[0]} style
 * @returns {string}
 */
const generateNameHTML = (style) => {
  return LOGO_CONFIG.name
    .split('')
    .map((char) => {
      if (char === '0') {
        return style.zeroCSS
          ? `<span style="${style.zeroCSS}">${style.zero}</span>`
          : style.zero;
      }
      return style.chars[char] ?? char;
    })
    .join('');
};

/**
 * Simple template interpolation
 * @param {string} template
 * @param {Record<string, string>} data
 * @returns {string}
 */
const interpolate = (template, data) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '');

class SiteLogo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [styleSheet];
    this._initialized = false;
  }

  connectedCallback() {
    if (!this._initialized) {
      Promise.all([cssLoaded, htmlLoaded]).then(() => {
        this._render(getRandomStyle());
        this._setupClickHandler();
        this._initialized = true;
      });
    }
  }

  /**
   * Renders logo with given style
   * @param {typeof STYLES[0]} style
   */
  _render(style) {
    if (!this.shadowRoot || !htmlTemplate) return;

    const data = {
      name: generateNameHTML(style),
      dot: LOGO_CONFIG.dot,
      suffix: LOGO_CONFIG.suffix,
    };

    this.shadowRoot.innerHTML = interpolate(htmlTemplate, data);
  }

  /** Sets up click-to-randomize */
  _setupClickHandler() {
    this.style.cursor = 'pointer';
    this.title = 'Click to randomize';
    this.addEventListener('click', () => this._render(getRandomStyle()));
  }
}

customElements.define('site-logo', SiteLogo);
