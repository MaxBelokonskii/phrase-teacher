export interface ScenarioStep {
  speaker: 'you' | 'them'
  ru: string
  en: string
  note?: string
}

export interface Scenario {
  id: string
  title: string
  description: string
  icon: string
  color: string
  steps: ScenarioStep[]
}

export const scenarios: Scenario[] = [
  {
    id: 'taxi',
    title: 'В такси',
    description: 'От посадки до оплаты',
    icon: '🚕',
    color: '#F59E0B',
    steps: [
      { speaker: 'you', ru: 'Здравствуйте! До Султанахмета, пожалуйста.', en: 'Hello! To Sultanahmet, please.', note: 'Покажите адрес на карте, если название сложное.' },
      { speaker: 'them', ru: 'Конечно, садитесь.', en: 'Sure, get in.' },
      { speaker: 'you', ru: 'Включите, пожалуйста, счётчик.', en: 'Please turn on the meter.', note: 'Обязательно просите — иначе назовут свою цену.' },
      { speaker: 'them', ru: 'Готово. Это займёт около 30 минут.', en: 'Done. It will take about 30 minutes.' },
      { speaker: 'you', ru: 'Можно расплатиться картой?', en: 'Can I pay by card?', note: 'Не во всех такси есть терминал — лучше иметь наличные лиры.' },
      { speaker: 'them', ru: 'Только наличные, извините.', en: 'Cash only, sorry.' },
      { speaker: 'you', ru: 'Остановите здесь, пожалуйста.', en: 'Please stop here.' },
      { speaker: 'you', ru: 'Сколько с меня?', en: 'How much is it?' },
      { speaker: 'them', ru: '350 лир.', en: '350 lira.' },
      { speaker: 'you', ru: 'Вот, пожалуйста. Сдачи не нужно.', en: 'Here you go. Keep the change.', note: 'Чаевые в такси — округление вверх.' },
    ],
  },
  {
    id: 'bazaar',
    title: 'На Гранд-Базаре',
    description: 'Торг от начала до покупки',
    icon: '🏪',
    color: '#F97316',
    steps: [
      { speaker: 'them', ru: 'Заходите! Посмотрите!', en: 'Come in! Have a look!', note: 'Продавцы на Базаре очень настойчивы — улыбнитесь и войдите.' },
      { speaker: 'you', ru: 'Спасибо, я просто смотрю.', en: 'Thanks, I\'m just looking.' },
      { speaker: 'you', ru: 'Сколько стоит вот это?', en: 'How much is this one?', note: 'Показывайте пальцем на товар.' },
      { speaker: 'them', ru: '800 лир.', en: '800 lira.' },
      { speaker: 'you', ru: 'Это слишком дорого.', en: 'That\'s too expensive.', note: 'Первый ход в торге — всегда говорите, что дорого.' },
      { speaker: 'you', ru: 'Можно за 400?', en: 'How about 400?', note: 'Начинайте с ~50% от запрошенной цены.' },
      { speaker: 'them', ru: 'Нет, 400 невозможно. 650.', en: 'No, 400 is impossible. 650.' },
      { speaker: 'you', ru: 'Ладно, 500 — моё последнее слово.', en: 'OK, 500 is my final offer.' },
      { speaker: 'them', ru: 'Хорошо, договорились!', en: 'OK, deal!' },
      { speaker: 'you', ru: 'Можно чек?', en: 'Can I have a receipt?' },
    ],
  },
  {
    id: 'restaurant',
    title: 'В ресторане',
    description: 'Бронь, заказ, счёт, чаевые',
    icon: '🍽️',
    color: '#EF4444',
    steps: [
      { speaker: 'you', ru: 'Добрый вечер. Стол на двоих, пожалуйста.', en: 'Good evening. A table for two, please.' },
      { speaker: 'them', ru: 'Конечно, прошу сюда.', en: 'Of course, this way please.' },
      { speaker: 'you', ru: 'Можно меню?', en: 'Can I have the menu, please?' },
      { speaker: 'you', ru: 'Что вы рекомендуете?', en: 'What do you recommend?', note: 'Отличный способ попробовать фирменное блюдо.' },
      { speaker: 'them', ru: 'Кебаб и рыба на гриле очень хороши.', en: 'The kebab and grilled fish are very good.' },
      { speaker: 'you', ru: 'Я возьму кебаб. И стакан воды.', en: 'I\'ll have the kebab. And a glass of water.' },
      { speaker: 'you', ru: 'Это очень вкусно!', en: 'This is delicious!', note: 'Комплимент повару всегда уместен. По-турецки: Çok lezzetli!' },
      { speaker: 'you', ru: 'Счёт, пожалуйста.', en: 'The bill, please.' },
      { speaker: 'you', ru: 'Чаевые включены?', en: 'Is the tip included?', note: 'Обычно нет. Принято оставлять ~10%.' },
      { speaker: 'you', ru: 'Спасибо, всё было замечательно.', en: 'Thank you, everything was wonderful.' },
    ],
  },
  {
    id: 'hotel-checkin',
    title: 'Заселение в отель',
    description: 'Чек-ин, вопросы, проблемы',
    icon: '🏨',
    color: '#6366F1',
    steps: [
      { speaker: 'you', ru: 'Здравствуйте, у меня бронь на сегодня.', en: 'Hello, I have a reservation for tonight.' },
      { speaker: 'them', ru: 'Ваше имя, пожалуйста?', en: 'Your name, please?' },
      { speaker: 'you', ru: 'Максим Белоконский.', en: 'Maxim Belokonskiy.', note: 'Имейте подтверждение брони на телефоне.' },
      { speaker: 'them', ru: 'Нашёл. Номер 305. Вот ваш ключ.', en: 'Found it. Room 305. Here is your key.' },
      { speaker: 'you', ru: 'Какой пароль от Wi-Fi?', en: 'What is the Wi-Fi password?' },
      { speaker: 'you', ru: 'Во сколько завтрак?', en: 'What time is breakfast?' },
      { speaker: 'them', ru: 'С 7:30 до 10 утра, на террасе.', en: 'From 7:30 to 10 AM, on the terrace.' },
      { speaker: 'you', ru: 'Можно поздний выезд завтра?', en: 'Can I have a late check-out tomorrow?', note: 'Часто бесплатно до 14:00 в несезон.' },
      { speaker: 'them', ru: 'До 13:00 — без доплаты.', en: 'Until 1 PM — no extra charge.' },
      { speaker: 'you', ru: 'Отлично, спасибо!', en: 'Great, thank you!' },
    ],
  },
  {
    id: 'pharmacy',
    title: 'В аптеке',
    description: 'Купить лекарство без рецепта',
    icon: '💊',
    color: '#10B981',
    steps: [
      { speaker: 'you', ru: 'Здравствуйте, мне нужно лекарство.', en: 'Hello, I need some medicine.' },
      { speaker: 'them', ru: 'Что у вас болит?', en: 'What\'s wrong?' },
      { speaker: 'you', ru: 'У меня болит голова.', en: 'I have a headache.', note: 'Или: stomachache (живот), sore throat (горло), cold (простуда).' },
      { speaker: 'them', ru: 'Вам подойдёт это.', en: 'This should help.' },
      { speaker: 'you', ru: 'У меня аллергия на пенициллин.', en: 'I\'m allergic to penicillin.', note: 'Всегда предупреждайте об аллергиях.' },
      { speaker: 'them', ru: 'Не волнуйтесь, здесь нет пенициллина.', en: 'Don\'t worry, there\'s no penicillin in this.' },
      { speaker: 'you', ru: 'Сколько раз в день принимать?', en: 'How many times a day should I take it?' },
      { speaker: 'them', ru: 'Два раза в день после еды.', en: 'Twice a day after meals.' },
      { speaker: 'you', ru: 'Сколько это стоит?', en: 'How much is it?' },
      { speaker: 'you', ru: 'Спасибо большое!', en: 'Thank you very much!' },
    ],
  },
]

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id)
}
