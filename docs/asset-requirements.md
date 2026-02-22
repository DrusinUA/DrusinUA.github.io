# Asset Requirements

## Логотип (header)

- Базовий вхідний файл: `Cocos_cafe_logo.png`.
- Канонічний файл для сайту: `public/logo.png`.
- `public/logo.png` має бути:
  - з прозорим фоном;
  - без зайвих прозорих полів (або з мінімальним технічним відступом);
  - достатньо великої роздільної здатності для retina.

### Рекомендації

- Мінімальна ширина: `1200px`.
- Формат: PNG (`RGBA`).
- Пропорції: наближені до оригінального wordmark, без деформації.

## Favicon Pack

Потрібний комплект:
- `public/favicon.svg`
- `public/favicon-32x32.png`
- `public/favicon-16x16.png`
- `public/apple-touch-icon.png`
- `public/site.webmanifest`

### Дизайн favicon

- Основа: фірмовий зелений фон.
- Символ: стилізована літера `C` у стилі бренду.
- Колір символу: кремовий контур + темно-коричневе ядро (для контрасту на малих розмірах).

## Чекліст валідації іконок

1. Вкладка браузера показує `C` без втрати читабельності на `16x16`.
2. `favicon.svg` коректно рендериться у Chrome/Safari/Firefox.
3. iOS home-screen використовує `apple-touch-icon.png`.
4. `site.webmanifest` містить валідні шляхи до іконок.
5. Після `npm run build` усі icon-файли присутні у `dist/`.

## Соцмережі

SVG-іконки соцмереж розміщені inline у `src/main.js` в блоці `.social-links`.

Поточні посилання:
- Instagram: `https://www.instagram.com/cocos_cafe_nr?igsh=MW8yZnkycjBrbnVseg==`
- Facebook: `https://www.facebook.com/share/1ELWsbeXum/`
