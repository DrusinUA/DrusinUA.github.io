# COCOS Cafe Menu (GitHub Pages)

Статичний сайт меню та банкетного конструктора для кафе COCOS. Проєкт побудований на Vite і розгортається на GitHub Pages через GitHub Actions.

## Локальний запуск

Вимоги:
- Node.js 18+
- npm

Команди:
```bash
npm install
npm run dev
```

Локальний сервер за замовчуванням: `http://localhost:5173`.

## Production-збірка

```bash
npm run build
npm run preview
```

Готовий build зберігається у `dist/`.

## Деплой на GitHub Pages

Автодеплой налаштований у `.github/workflows/deploy.yml`:
1. Push у `main` або `master`.
2. GitHub Action запускає `npm install` і `npm run build`.
3. Артефакт із `dist/` публікується у GitHub Pages.

Конфіг `vite.config.js` використовує `base: './'`, щоб відносні шляхи до ресурсів працювали коректно на Pages.

## Структура ключових файлів

- `index.html` - метадані сторінки, іконки, підключення шрифтів.
- `src/main.js` - рендер меню, категорій, модального кошика, формування замовлення.
- `src/style.css` - адаптивна дизайн-система, брейкпоінти, стани UI.
- `public/menu.json` - дані меню (кухня/бар).
- `public/logo.png` - канонічний логотип у шапці.
- `public/favicon.svg` + `public/favicon-*.png` + `public/apple-touch-icon.png` - favicon pack.
- `public/site.webmanifest` - web app manifest.

## Оновлення контенту

### Меню
1. Відредагуйте `public/menu.json`.
2. Перевірте `npm run dev`.
3. Зберіть `npm run build`.

### Логотип
1. Базовий файл: `Cocos_cafe_logo.png`.
2. Робочий файл сайту: `public/logo.png` (обрізаний та оптимізований для шапки).

### Соцмережі
Посилання зберігаються в `src/main.js` у блоці `.social-links`.

## Мінімальний чек перед релізом

1. `npm run build` завершується без помилок.
2. На ширинах `320/360/390/430/768/1024/1280/1440` немає горизонтального overflow.
3. Категорії меню відображаються у кілька рядків без обрізання активної кнопки.
4. Логотип, favicon та social-посилання відображаються коректно.
5. Модальне вікно кошика відкривається/закривається, а кнопка замовлення формує повідомлення для Viber.

## Додатково

- `docs/ui-guidelines.md` - токени, брейкпоінти, правила компонентів.
- `docs/asset-requirements.md` - вимоги до графічних ресурсів і favicon.
- `docs/viber-automation.md` - покрокове налаштування автоматичної відправки замовлень у Viber через webhook.
