# m0rtyn.cc — Project Specification

## Overview

**m0rtyn.cc** — персональный лендинг-сайт, служащий единой точкой входа ко всем проектам и ресурсам автора. Развёрнут на GitHub Pages.

**URL:** https://m0rtyn.cc

---

## Tech Stack

| Категория | Технология |
|-----------|-----------|
| Хостинг | GitHub Pages |
| Язык разметки | HTML5 |
| Стили | CSS3 (Custom Properties, Oklch, Animations) |
| Скрипты | Vanilla JavaScript (ES6+) |
| Компоненты | Web Components (Custom Elements + Shadow DOM) |
| Шрифты | Google Fonts (Anonymous Pro) |

---

## Project Structure

```
m0rtyn.github.io/
├── index.html              # Главная страница
├── CNAME                   # Кастомный домен (m0rtyn.cc)
├── styles/
│   └── main.css            # Основные стили
├── components/
│   └── link-card.js        # Web Component для карточек проектов
├── assets/
│   ├── background-animation.js  # Canvas-анимация фона
│   └── DW3HH.woff2         # Кастомный шрифт
├── docs/
│   └── SPEC.md             # Эта спецификация
└── .github/                # GitHub Actions / конфигурация
```

---

## Design Principles

### 1. Brutalism-lite / Минималистичный брутализм
- Острые углы (`border-radius: 0`)
- Чёткие границы и контрастные рамки
- Высокий контраст (тёмный фон + светлый текст)
- Прямолинейность UI без лишних украшений

### 2. Геометрическая абстракция
- Использование `clip-path: polygon()` для треугольников и ромбов
- Canvas-анимация с рандомными геометрическими фигурами
- Декоративные элементы появляются при hover

### 3. Монохромная палитра (Oklch)
```css
--color-background:    oklch(10% 0 0);   /* Почти чёрный */
--color-text-primary:  oklch(95% 0 0);   /* Светло-серый */
--color-text-secondary: oklch(70% 0 0);  /* Серый */
--color-accent-1:      oklch(60% 0 0);   /* Средне-серый */
--color-accent-2:      oklch(40% 0 0);   /* Тёмно-серый */
--color-card-bg:       oklch(20% 0 0 / 0.8);
--color-card-border:   oklch(50% 0 0);
```

### 4. Типографика
- Моноширинный шрифт `Anonymous Pro`
- Технический, developer-ориентированный стиль

---

## Features

### Мультиязычность (EN/RU)
- Переключатель языка в хедере
- Сохранение выбора в `localStorage`
- Отдельные секции для каждого языка

### Link Cards (Web Component)
Кастомный элемент `<link-card>` с атрибутами:
- `title` — заголовок проекта
- `description` — описание
- `link` — URL
- `icon` — эмодзи-иконка

**Эффекты карточек:**
- Floating animation (плавающая анимация)
- Aurora glow при наведении (следует за курсором)
- Scale + translate при hover
- Геометрический декор при hover
- Staggered entrance animation

### Background Animation (Canvas)
- Рандомные геометрические фигуры (треугольники, прямоугольники, линии)
- Плавное движение и вращение
- Обёртка по краям экрана (screen wrap)
- Генерируется заново при каждом посещении

---

## Projects Showcase

| Проект | Описание | URL |
|--------|----------|-----|
| Blog | Блог о PKM и личных заметках | blog.m0rtyn.cc |
| Pokoy App | Минималистичный таймер для медитации | pokoy.m0rtyn.cc |
| Skuka App | Практика намеренной скуки для креативности | skuka.m0rtyn.cc |
| CV | Резюме | cv.m0rtyn.cc |
| Martynak | Альтернативная клавиатурная раскладка | martynak.m0rtyn.cc |
| Talks | Плейлист докладов | talks.m0rtyn.cc |
| Path of Mastery | Деревья развития в стиле Path of Exile | pom.m0rtyn.cc |
| Rogue Tasker | Todo-приложение с роуглайк-механиками | rogue.m0rtyn.cc |

---

## Animations

### CSS Keyframes
- `background-pan` — панорамирование градиента фона
- `pulse-glow` — пульсация свечения заголовка
- `fadeInDown` — появление хедера сверху
- `fadeInUp` — появление элементов снизу
- `cardEnter` — вход карточек с масштабированием
- `float` — плавающая анимация карточек

### Staggered Card Animation
Карточки появляются последовательно с задержкой:
- 1-я: 0.4s
- 2-я: 0.55s
- 3-я: 0.7s
- и т.д. (+0.15s)

---

## Responsive Design

### Breakpoints
- `768px` — мобильная адаптация хедера
- `480px` — уменьшение размера заголовка

### Mobile Adaptations
- Хедер переключается на column layout
- Кнопки языка растягиваются на всю ширину
- Декоративные фоновые элементы скрываются

---

## Browser Support

- Современные браузеры с поддержкой:
  - CSS Custom Properties
  - Oklch color space
  - Web Components (Custom Elements v1)
  - Canvas 2D API
  - ES6+ JavaScript

---

## Deployment

Автоматический деплой через GitHub Pages при push в `main` ветку.

```
Repository: m0rtyn/m0rtyn.github.io
Branch: main
Custom Domain: m0rtyn.cc
```
