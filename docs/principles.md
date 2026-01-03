### **Design Principles & Aesthetic Patterns**

1.  **Brutalism-lite / Minimalistic Brutalism:**
    *   **Principle:** Derived from architectural brutalism, this approach emphasizes raw, unadorned materials, clear structural elements, and a lack of overt embellishment. In web design, it translates to a stark, honest, and sometimes aggressive aesthetic.
    *   **Application:**
        *   **Sharp Angles & Absence of Rounded Corners:** Achieved through `border-radius: 0;` across various elements (cards, buttons), contrasting with the typically soft web.
        *   **Strong Borders & Outlines:** Visible `1px solid` borders on cards and buttons define boundaries clearly, echoing the exposed structures of brutalist architecture.
        *   **High Contrast:** The dark background (`oklch(10% 0.02 270)`) against bright text and accent colors (`oklch(95% 0.02 270)`, `oklch(50% 0.15 330)`) creates a bold, almost jarring visual experience that commands attention.
        *   **Directness:** The UI is straightforward, without complex animations or hidden features, presenting information directly.

2.  **Geometric Abstraction / Sharp Form Emphasis:**
    *   **Principle:** Utilizing basic geometric shapes (especially triangles, as requested) to add visual interest and a sense of dynamism and precision.
    *   **Application:**
        *   **`clip-path: polygon(...)`:** This CSS property is instrumental in creating the triangular overlays on cards and the accent triangle next to the site title. These elements are not purely decorative but serve to break up the visual space and reinforce the sharp, angular theme.
        *   **Strategic Placement:** Triangles are placed off-center and slightly rotated to provide a sense of movement and asymmetry, characteristic of geometric brutalism.

3.  **Monochromatic with Controlled Accents (Oklch Color Space):**
    *   **Principle:** Building a primary palette around shades of a single hue (or near-grayscale) and introducing vibrant, contrasting accent colors sparingly. The use of `oklch()` ensures perceptual uniformity and precise color control.
    *   **Application:**
        *   **Dark Base (near-black):** `oklch(10% 0.02 270)` for background.
        *   **Neutral Text (light grey):** `oklch(95% 0.02 270)` for primary text, `oklch(70% 0.03 270)` for secondary text. This ensures readability while maintaining the dark theme.
        *   **Harmonious Accents:** `oklch(50% 0.15 330)` (a magenta-purple) and `oklch(55% 0.18 210)` (a teal-blue) are chosen. Their placement in the Oklch color space ensures they are perceptually distinct and vibrant against the dark background, providing focal points. The slightly desaturated `oklch` values prevent them from being overwhelmingly bright, maintaining a sophisticated edge.

4.  **Typographic Emphasis (Monospace):**
    *   **Principle:** Monospace fonts inherently convey a sense of technicality, code, and precision. Their fixed-width characters align vertically, creating a clean, structured appearance.
    *   **Application:**
        *   `font-family: 'Anonymous Pro', monospace;`: This choice immediately signals a modern, developer-oriented aesthetic, complementing the brutalist and geometric themes. The uniform spacing contributes to the overall clean and minimalist feel.

5.  **Information Hierarchy & Minimalism:**
    *   **Principle:** Presenting information clearly and concisely, prioritizing content over excessive ornamentation. Every element should serve a purpose.
    *   **Application:**
        *   **Clear Card Structure:** Each `link-card` presents a distinct piece of information (title, description, link, icon) in a consistent format, making it easy for the user to scan and understand.
        *   **Limited UI Elements:** Only essential navigation (language switcher) and content are present, reducing cognitive load.

---

### **Development Patterns & Technologies**

1.  **Web Components (Custom Elements):**
    *   **Pattern:** Encapsulation and Reusability. Web Components allow you to create custom, reusable HTML elements with their own encapsulated HTML, CSS, and JavaScript, preventing style clashes and promoting modularity.
    *   **Application:**
        *   The `<link-card>` element is a perfect example. It encapsulates the complex styling and structure of a link item. This means if you want to change the design of *all* your links, you only modify `link-card.js`.
        *   **Shadow DOM (`attachShadow({ mode: 'open' })`):** Crucial for preventing the card's internal CSS from "leaking" out and affecting other parts of your page, and vice-versa. This ensures the styles for your cards are self-contained and predictable.
        *   **Attributes (`static get observedAttributes`, `attributeChangedCallback`):** This pattern allows the parent HTML (`index.html`) to pass data (`title`, `description`, `link`, `icon`) to the Web Component declaratively, making the component highly configurable and easy to use.

2.  **CSS Variable-Based Theming (`:root` Custom Properties):**
    *   **Pattern:** Centralized style management and easy theme switching. Defining core colors, fonts, and spacing as CSS variables makes it simple to change them site-wide from a single location.
    *   **Application:**
        *   `--color-background`, `--color-text-primary`, etc., are defined in `:root`. If you decide to introduce a light mode or change your brand colors, you only need to adjust these variables.
        *   This enhances maintainability and consistency across your entire design.

3.  **Responsive Design (Media Queries):**
    *   **Pattern:** Ensuring the website adapts and provides an optimal viewing experience across a wide range of devices (desktops, tablets, mobile phones).
    *   **Application:**
        *   `@media (max-width: 768px)` and `@media (max-width: 480px)` are used to adjust layout, font sizes, and hide/show elements for smaller screens. For instance, the header adapts to a column layout, and the site title's geometric accent is removed for mobile clarity.
        *   `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` ensures the grid of cards automatically adjusts its column count based on available space, making it inherently responsive.

4.  **Simple Language Switching with Local Storage:**
    *   **Pattern:** Client-side localization for basic content, remembering user preference.
    *   **Application:**
        *   Separate `div` elements for each language (`#links-en`, `#links-ru`) are toggled with `display: none;` and `display: grid;`.
        *   `localStorage.setItem('m0rtyn_lang', 'en')` is used to persist the user's language choice across sessions, providing a better user experience upon return.

5.  **GitHub Pages as Static Site Host:**
    *   **Pattern:** Deploying static web assets for free and simple hosting.
    *   **Application:** This choice is suitable for a simple landing page like this, where no server-side logic or database is required. It integrates well with your development workflow via Git.