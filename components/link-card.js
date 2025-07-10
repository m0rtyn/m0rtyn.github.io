class LinkCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Используем Shadow DOM
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'description', 'link', 'icon'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'No Title';
    const description = this.getAttribute('description') || 'No description provided.';
    const link = this.getAttribute('link') || '#';
    const icon = this.getAttribute('icon') || '🔗';

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
            <style>
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }

                :host {
                    display: block;
                    width: 100%;
                    max-width: 380px; /* Ограничиваем ширину карточки */
                    position: relative; /* For pseudo-elements */
                }

                .card {
                    display: block;
                    background-color: var(--color-card-bg, oklch(20% 0 0 / 0.8)); /* Темный фон с легким оттенком */
                    border: 1px solid var(--color-card-border, oklch(50% 0 0)); /* Контрастная рамка */
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border-radius: 0; /* Брутализм: острые углы */
                    transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
                    position: relative;
                    overflow: hidden; /* Для геометрических элементов и сияния */
                    cursor: pointer;
                    animation: float 6s ease-in-out infinite;
                    text-decoration: none; /* Убираем подчеркивание */
                }

                .card::before, .card::after {
                    content: '';
                    position: absolute;
                    pointer-events: none;
                    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
                }

                .card:hover {
                    transform: translateY(-10px) scale(1.02);
                    background-color: oklch(25% 0 0 / 0.9); /* Чуть светлее при наведении */
                    animation-play-state: paused; /* Pause floating animation on hover */
                }

                .card:active {
                    transform: translateY(-5px) scale(0.98);
                    transition: transform 0.1s ease-in-out;
                }

                .card:hover::after {
                    transform: translate(10px, -10px) rotate(15deg);
                    opacity: 1;
                }

                /* Aurora glow effect */
                .card::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), oklch(65% 0 0 / 0.2), transparent 20%);
                    opacity: 0;
                    transition: opacity 0.3s ease-out;
                }

                /* Decorative geometric shape */
                .card::after {
                    content: '';
                    position: absolute;
                    bottom: -50px;
                    right: -50px;
                    width: 100px;
                    height: 100px;
                    background-color: var(--color-accent-1, oklch(60% 0 0));
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    transform: rotate(15deg);
                    opacity: 0;
                    transition: transform 0.4s ease-out, opacity 0.4s ease-out;
                    z-index: 0;
                }

                .card:hover::before {
                    opacity: 1;
                }

                .card-content {
                    position: relative;
                    z-index: 1;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.8rem;
                }
                .card-icon {
                    font-size: 2rem;
                    margin-right: 1rem;
                    line-height: 1; /* Чтобы иконка не искажала отступы */
                }
                .card-title {
                    font-size: 1.5rem;
                    margin: 0;
                    color: var(--color-text-primary, oklch(95% 0 0)); /* Светлый цвет заголовка */
                }
                .card-description {
                    font-size: 0.95rem;
                    line-height: 1.5;
                    color: var(--color-text-secondary, oklch(70% 0 0)); /* Серый цвет описания */
                    margin-bottom: 1rem;
                }
                .card-link {
                    display: block;
                    text-decoration: none;
                    color: var(--color-text-secondary, oklch(80% 0 0)); /* Цвет ссылки */
                    font-weight: bold;
                    text-align: right;
                    font-size: 0.9rem;
                    opacity: 0.8;
                    transition: opacity 0.2s ease-in-out;
                }
                .card-link:hover {
                    opacity: 1;
                    color: var(--color-text-primary, oklch(95% 0 0));
                }
            </style>
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="card">
                <div class="card-content">
                    <div class="card-header">
                        <span class="card-icon">${icon}</span>
                        <h3 class="card-title">${title}</h3>
                    </div>
                    <p class="card-description">${description}</p>
                    <span class="card-link">Explore →</span>
                </div>
            </a>
        `;

    const card = /** @type {HTMLElement | null} */ (this.shadowRoot.querySelector('.card'));
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