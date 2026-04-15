<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2, PencilLine, X } from 'lucide-vue-next'
import { categories, getCategoryById } from '@/data/categories'
import { usePhrasesStore } from '@/stores/usePhrasesStore'
import type { CategoryId, Phrase } from '@/types'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppModal from '@/components/ui/AppModal.vue'

const phrasesStore = usePhrasesStore()

const showForm = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  category: 'greetings' as CategoryId,
  ru: '',
  en: '',
  phonetic: '',
  note: '',
})

const errors = ref<{ ru?: string; en?: string }>({})

const categoryOptions = computed(() =>
  categories.map((c) => ({ value: c.id, label: c.name })),
)

const userPhrases = computed(() => phrasesStore.userPhrases)

function openCreate() {
  editingId.value = null
  form.value = { category: 'greetings', ru: '', en: '', phonetic: '', note: '' }
  errors.value = {}
  showForm.value = true
}

function openEdit(phrase: Phrase) {
  editingId.value = phrase.id
  form.value = {
    category: phrase.category,
    ru: phrase.ru,
    en: phrase.en,
    phonetic: phrase.phonetic ?? '',
    note: phrase.note ?? '',
  }
  errors.value = {}
  showForm.value = true
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.ru.trim()) errors.value.ru = 'Введите фразу на русском.'
  if (!form.value.en.trim()) errors.value.en = 'Введите перевод на английском.'
  return Object.keys(errors.value).length === 0
}

function save() {
  if (!validate()) return
  if (editingId.value) {
    phrasesStore.updateUserPhrase(editingId.value, {
      category: form.value.category,
      ru: form.value.ru.trim(),
      en: form.value.en.trim(),
      phonetic: form.value.phonetic.trim() || undefined,
      note: form.value.note.trim() || undefined,
    })
  } else {
    phrasesStore.addUserPhrase({
      category: form.value.category,
      ru: form.value.ru,
      en: form.value.en,
      phonetic: form.value.phonetic,
      note: form.value.note,
    })
  }
  showForm.value = false
}

function remove(id: string) {
  if (!confirm('Удалить эту фразу? Это действие нельзя отменить.')) return
  phrasesStore.deleteUserPhrase(id)
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="heading-2 mb-1">Мои фразы</h1>
        <p class="text-sm text-muted">Добавляйте свои фразы — они сохраняются локально в браузере.</p>
      </div>
      <AppButton variant="primary" size="md" @click="openCreate">
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline">Добавить</span>
      </AppButton>
    </div>

    <ul v-if="userPhrases.length > 0" class="card divide-y divide-slate-100 dark:divide-slate-800">
      <li v-for="phrase in userPhrases" :key="phrase.id" class="p-4 flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <p class="font-display font-semibold text-base leading-tight">{{ phrase.ru }}</p>
          <p class="text-sm text-brand-700 dark:text-brand-300 mt-0.5">{{ phrase.en }}</p>
          <p v-if="phrase.phonetic" class="text-xs text-muted font-mono mt-0.5">{{ phrase.phonetic }}</p>
          <p v-if="phrase.note" class="text-xs text-muted italic mt-1.5 leading-snug">{{ phrase.note }}</p>
          <div class="mt-2">
            <span
              v-if="getCategoryById(phrase.category)"
              class="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
              :style="{
                backgroundColor: `${getCategoryById(phrase.category)!.hex}15`,
                color: getCategoryById(phrase.category)!.hex,
              }"
            >
              {{ getCategoryById(phrase.category)!.name }}
            </span>
          </div>
        </div>
        <div class="shrink-0 flex flex-col gap-1">
          <button
            type="button"
            class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Редактировать"
            @click="openEdit(phrase)"
          >
            <PencilLine class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
            aria-label="Удалить"
            @click="remove(phrase.id)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </li>
    </ul>

    <div v-else class="card p-8 text-center space-y-3">
      <p class="text-muted">Здесь будут ваши фразы. Например, имя вашего отеля или имя ребёнка для случая, если вы потеряетесь.</p>
      <AppButton variant="primary" size="md" @click="openCreate">
        <Plus class="w-4 h-4" />
        Добавить первую фразу
      </AppButton>
    </div>

    <!-- Modal -->
    <AppModal v-model="showForm" :title="editingId ? 'Редактирование фразы' : 'Новая фраза'">
      <form class="space-y-4" @submit.prevent="save">
        <AppSelect v-model="form.category" :options="categoryOptions" label="Категория" />
        <AppInput
          v-model="form.ru"
          label="По-русски"
          required
          placeholder="Например: Где ближайшая аптека?"
          :error="errors.ru"
        />
        <AppInput
          v-model="form.en"
          label="По-английски"
          required
          placeholder="Where is the nearest pharmacy?"
          :error="errors.en"
        />
        <AppInput
          v-model="form.phonetic"
          label="Транскрипция (необязательно)"
          placeholder="/wɛr ɪz ðə nɪərɪst fɑːrməsi/"
        />
        <AppTextarea
          v-model="form.note"
          label="Заметка (необязательно)"
          placeholder="Контекст, нюанс или подсказка"
          :rows="2"
        />
      </form>
      <template #actions>
        <AppButton variant="ghost" size="md" @click="showForm = false">
          <X class="w-4 h-4" />
          Отмена
        </AppButton>
        <AppButton variant="primary" size="md" @click="save">
          {{ editingId ? 'Сохранить' : 'Добавить' }}
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>
