import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'greetings',
    name: 'Приветствия и знакомство',
    description: 'Базовые фразы для первого контакта и smalltalk',
    icon: 'hand',
    color: 'pink-500',
    hex: '#EC4899',
  },
  {
    id: 'airport',
    name: 'Аэропорт и трансфер',
    description: 'Прилёт, паспортный контроль, такси и шаттлы из аэропорта',
    icon: 'plane',
    color: 'sky-500',
    hex: '#0EA5E9',
  },
  {
    id: 'transport',
    name: 'Транспорт по городу',
    description: 'Метро, трамвай, паромы, Istanbulkart и такси',
    icon: 'bus',
    color: 'blue-500',
    hex: '#3B82F6',
  },
  {
    id: 'hotel',
    name: 'Отель и заселение',
    description: 'Чек-ин, проблемы в номере, дополнительные услуги',
    icon: 'bed-double',
    color: 'indigo-500',
    hex: '#6366F1',
  },
  {
    id: 'restaurant',
    name: 'Ресторан и заказ',
    description: 'Бронь, заказ еды, счёт и чаевые',
    icon: 'utensils',
    color: 'red-500',
    hex: '#EF4444',
  },
  {
    id: 'streetfood',
    name: 'Кафе и уличная еда',
    description: 'Симит, кофе, чай, балык-экмек и десерты',
    icon: 'coffee',
    color: 'orange-500',
    hex: '#F97316',
  },
  {
    id: 'shopping',
    name: 'Шопинг и торг',
    description: 'Гранд-Базар, размеры, торг и оплата',
    icon: 'shopping-bag',
    color: 'amber-500',
    hex: '#F59E0B',
  },
  {
    id: 'sightseeing',
    name: 'Достопримечательности',
    description: 'Музеи, мечети, экскурсии и фото',
    icon: 'landmark',
    color: 'emerald-500',
    hex: '#10B981',
  },
  {
    id: 'money_time',
    name: 'Числа, деньги и время',
    description: 'Лиры, обмен валюты, часы работы и расписание',
    icon: 'wallet',
    color: 'violet-500',
    hex: '#8B5CF6',
  },
  {
    id: 'emergency',
    name: 'Здоровье и экстренное',
    description: 'Аптека, врач, потеря документов, помощь',
    icon: 'shield-alert',
    color: 'rose-600',
    hex: '#E11D48',
  },
  {
    id: 'turkish',
    name: 'Турецкие вставки',
    description: 'Ключевые турецкие слова — пара фраз на местном языке меняет всё',
    icon: 'heart-handshake',
    color: 'teal-500',
    hex: '#14B8A6',
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
