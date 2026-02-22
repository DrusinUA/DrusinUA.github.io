# Автоматичне надсилання замовлень у Viber

## Поточна логіка в проєкті

У `src/main.js` вже є 2 режими:

1. Якщо `VITE_ORDER_WEBHOOK_URL` задано - сайт відправляє JSON із замовленням на ваш бекенд/webhook (автоматичний режим).
2. Якщо `VITE_ORDER_WEBHOOK_URL` не задано - сайт використовує fallback: копіює текст і відкриває `viber://forward`.

## Важливо про обмеження Viber

Офіційний Bot API працює через чат-бота (Public Account). Бот може писати користувачу після того, як користувач ініціював діалог із ботом.

Практично це означає:
- адміністратор кафе має відкрити чат із ботом і надіслати будь-яке повідомлення (щоб бот отримав `user_id`);
- далі бекенд може відправляти замовлення на цей `user_id` автоматично.

## Рекомендована архітектура для GitHub Pages

- Frontend (GitHub Pages): відправляє замовлення на ваш webhook URL.
- Backend (Cloudflare Workers / Render / Fly / VPS):
  - зберігає секретний токен Viber;
  - приймає payload від сайту;
  - формує фінальний текст;
  - викликає Viber API `send_message`.

Причина: токен Viber не можна зберігати у фронтенді.

## Кроки налаштування

### 1. Створіть Viber Bot і отримайте токен

- Зареєструйте Public Account / Bot у Viber Admin.
- Збережіть Bot Token (секрет).

Корисні сторінки:
- Viber Bot API docs: https://developers.viber.com/docs/api/rest-bot-api/
- Send message endpoint: https://developers.viber.com/docs/api/rest-bot-api/#send-message

### 2. Отримайте `receiver_id` адміністратора

- Адмін пише в чат вашого бота.
- Ваш webhook для вхідних подій отримує повідомлення від Viber і `sender.id`.
- Це `sender.id` і є `receiver_id`, куди надсилати замовлення.

### 3. Підніміть серверний webhook

Нижче мінімальний приклад (Cloudflare Worker стилю, pseudo-production):

```js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const origin = request.headers.get('Origin') || '';
    const allowed = ['https://drusinua.github.io'];
    if (!allowed.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    const order = await request.json();
    const text = order.message || 'Нове замовлення';

    const viberResponse = await fetch('https://chatapi.viber.com/pa/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Viber-Auth-Token': env.VIBER_BOT_TOKEN,
      },
      body: JSON.stringify({
        receiver: env.VIBER_RECEIVER_ID,
        min_api_version: 1,
        sender: { name: 'COCOS Menu' },
        type: 'text',
        text,
      }),
    });

    if (!viberResponse.ok) {
      return new Response('Viber send failed', { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

### 4. Задайте URL webhook у frontend

Локально:

```bash
# .env.local
VITE_ORDER_WEBHOOK_URL=https://your-domain.com/api/orders/viber
```

Для GitHub Pages:
- додайте Repository Secret `VITE_ORDER_WEBHOOK_URL`;
- workflow вже прокидає його в build step (`.github/workflows/deploy.yml`).

### 5. Перевірка

1. Додайте 2-3 позиції в меню.
2. Заповніть ім'я і телефон.
3. Натисніть `Сформувати замовлення`.
4. Перевірте:
   - у Network є `POST` на webhook;
   - бекенд повертає `200`;
   - повідомлення приходить у Viber адмін-акаунт.

## Поради по безпеці

- Не зберігайте Viber token у JS/frontend.
- Обмежуйте CORS лише вашим доменом.
- Додайте simple auth між frontend і webhook (наприклад, custom header ключ).
- Логувати помилки Viber API на бекенді, а не в браузері.

## Що вже підтримує фронтенд

Payload, який сайт уже відправляє на webhook:
- `customer`: ім'я, телефон, дата/час, гості, коментар;
- `cart`: масив позицій (id, quantity, name, price, weight);
- `message`: готовий текст замовлення;
- `source`, `createdAt`.
