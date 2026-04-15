# Phrase Teacher

Веб-приложение для изучения английских фраз, которые пригодятся в поездке в Стамбул. Vue 3 + TypeScript + Tailwind CSS, хостинг — GitHub Pages.

## Что внутри

- 10 категорий, по 15 фраз: приветствия, аэропорт, транспорт (Istanbulkart, паромы), отель, ресторан, уличная еда, шопинг и торг, достопримечательности, числа/деньги/время, экстренные ситуации.
- Каждая фраза с IPA-транскрипцией и контекстной заметкой про местные нюансы.
- Учебный режим: двусторонние карточки с произношением (Web Speech API).
- Тесты: выбор перевода из 4 вариантов и ввод с клавиатуры (с допуском на опечатки через расстояние Левенштейна).
- Прогресс по системе Leitner (5 коробок), серия дней (streak), избранное.
- Свой разговорник с поиском.
- Возможность добавлять собственные пары фраз RU↔EN.
- Светлая/тёмная тема, выбор голоса и скорости TTS.
- Экспорт/импорт всех данных в JSON.

## Требования

- Node.js 18+ (рекомендуется 22)
- npm 10+

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173/phrase-teacher/`. Обратите внимание на префикс `/phrase-teacher/` — он соответствует `base` в `vite.config.ts`.

## Сборка

```bash
npm run build       # собирает в dist/
npm run preview     # локальный предпросмотр сборки
```

## Деплой на GitHub Pages

1. Создайте репозиторий с именем **`phrase-teacher`** на GitHub (имя важно — оно используется в `vite.config.ts` как `base: '/phrase-teacher/'`).
2. Запушьте код в ветку `main`.
3. В Settings → Pages выберите Source = **GitHub Actions**.
4. При следующем пуше в `main` workflow `.github/workflows/deploy.yml` соберёт проект и выложит на `https://<username>.github.io/phrase-teacher/`.

### Если имя репо другое

Поменяйте `base` в `vite.config.ts`:

```ts
export default defineConfig({
  base: '/<your-repo-name>/',
  // ...
})
```

### Если деплой на корневой домен (`username.github.io` или custom domain)

```ts
base: '/'
```

## Архитектура

```
src/
├── assets/main.css            Tailwind + кастомные CSS-переменные
├── components/                UI-компоненты (PhraseCard, CategoryCard, ProgressRing и др.)
├── components/quiz/           Quiz-режимы (multiple choice + typing)
├── components/ui/             Базовые примитивы (AppButton, AppModal, AppInput, ...)
├── composables/               Логика: useSpeech, useFuzzyMatch, useExportImport, useDarkMode, useQuizSession
├── data/                      phrases.json (150 фраз) + categories.ts
├── router/                    vue-router с createWebHashHistory (важно для GH Pages)
├── stores/                    Pinia: usePhrasesStore, useProgressStore, useSettingsStore
├── types/                     TypeScript-интерфейсы
├── utils/                     shuffle, normalize
└── views/                     Страницы
```

## Хранилище данных

Все пользовательские данные (свои фразы, прогресс, избранное, серия, настройки) хранятся в `localStorage` под префиксом `pt_*`:

- `pt_user_phrases`
- `pt_progress`
- `pt_streak`
- `pt_settings`

Сессия quiz хранится в `sessionStorage` (`pt_quiz_session`) и автоматически очищается.

## Лицензия

MIT
