# Список иконок для профиля (для скачивания из Figma)

## Иконки в профиле:

1. **call** (ID: 177:1527)
   - Файл: `call.svg` (НЕ `phone.svg`)
   - Используется в: кнопка "Звонок"
   - Расположение: `frontend/chats/chats.html` строка 653

2. **video-on** (ID: 177:715)
   - Файл: `video-on.svg`
   - Используется в: кнопка "Видеозвонок"
   - Расположение: `frontend/chats/chats.html` строка 657

3. **message-square** (ID: 177:1509)
   - Файл: `message-square.svg`
   - Используется в: кнопка "Сообщение"
   - Расположение: `frontend/chats/chats.html` строка 661

4. **gift-01** (ID: 177:591)
   - Файл: `gift-01.svg`
   - Используется в: кнопка "Подарок"
   - Расположение: `frontend/chats/chats.html` строка 665

5. **dot-horizontal** (ID: 177:279)
   - Файл: `dot-horizontal.svg`
   - Используется в: кнопка меню (три точки)
   - Расположение: `frontend/chats/chats.html` строка 669

6. **chevron-left** (ID: 177:203)
   - Файл: `chevron-left.svg`
   - Используется в: кнопка "Назад" в профиле
   - Расположение: `frontend/chats/chats.html` строка 640

## Инструкция по скачиванию:

1. Откройте Figma файл: https://www.figma.com/design/0SRjLjTq9s3n0WZeUX0ooE/Чат--Copy-
2. Найдите компонент по ID (например, 177:1527 для call)
3. Экспортируйте как SVG
4. Сохраните в папку `images/` с соответствующим именем файла

## Важно:

- Иконка телефона должна называться **`call.svg`** (НЕ `phone.svg`)
- После скачивания нужно обновить путь в `frontend/chats/chats.html` строка 653:
  - Заменить: `<img src="/images/phone.svg" alt="Звонок" />`
  - На: `<img src="/images/call.svg" alt="Звонок" />`

## Примечание:

Некоторые иконки уже могут существовать в проекте:
- `chevron-left.svg` - уже есть
- `dot-horizontal.svg` - уже есть
- Остальные нужно скачать из Figma



















