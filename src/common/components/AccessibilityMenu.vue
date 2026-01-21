<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      ref="buttonRef"
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Abrir menu de acessibilidade"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
    >
      <Settings class="h-5 w-5 text-gray-600 dark:text-gray-400" />
    </button>

    <!-- Menu Popover -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="fixed right-4 top-20 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50"
        role="dialog"
        aria-label="Menu de Acessibilidade"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Acessibilidade
          </h2>
          <button
            @click="isOpen = false"
            class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fechar menu"
          >
            <X class="h-5 w-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Theme Section -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <Sun class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tema
              </h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="setTheme('light')"
                :class="[
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                  settings.theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                ]"
              >
                <Sun :class="settings.theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-slate-400'" class="h-5 w-5" />
                <span :class="settings.theme === 'light' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-slate-300'" class="text-sm font-medium">
                  Claro
                </span>
              </button>

              <button
                @click="setTheme('dark')"
                :class="[
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                  settings.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                <Moon :class="settings.theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'" class="h-5 w-5" />
                <span :class="settings.theme === 'dark' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'" class="text-sm font-medium">
                  Escuro
                </span>
              </button>

              <button
                @click="setTheme('auto')"
                :class="[
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                  settings.theme === 'auto'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                <Monitor :class="settings.theme === 'auto' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'" class="h-5 w-5" />
                <span :class="settings.theme === 'auto' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'" class="text-sm font-medium">
                  Auto
                </span>
              </button>
            </div>
          </div>

          <!-- Contrast Section -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="h-4 w-4 rounded bg-gradient-to-r from-purple-600 to-purple-400" />
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraste
              </h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="(contrast, index) in contrasts"
                :key="contrast.value"
                @click="setContrast(contrast.value)"
                :class="[
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                  settings.contrast === contrast.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                <div 
                  class="w-6 h-6 rounded bg-gray-900 dark:bg-white"
                  :style="{ opacity: contrast.opacity }"
                />
                <span :class="settings.contrast === contrast.value ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-gray-300'" class="text-sm font-medium">
                  {{ contrast.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Font Size Section -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-green-600 dark:text-green-400 font-bold text-lg">T</span>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tamanho da Fonte
              </h3>
            </div>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="font in fontSizes"
                :key="font.value"
                @click="setFontSize(font.value)"
                :class="[
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                  settings.fontSize === font.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                <span :class="[font.size, settings.fontSize === font.value ? 'text-green-900 dark:text-green-100' : 'text-gray-700 dark:text-gray-400']" class="font-bold">
                  A
                </span>
                <span :class="settings.fontSize === font.value ? 'text-green-900 dark:text-green-100' : 'text-gray-700 dark:text-gray-300'" class="text-xs font-medium">
                  {{ font.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Additional Options -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <Settings class="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Opções Adicionais
              </h3>
            </div>
            <div class="space-y-3">
              <label class="flex items-start gap-3 cursor-pointer group">
                <div class="flex items-center gap-3 flex-1">
                  <div class="flex-shrink-0 mt-0.5">
                    <Zap class="h-4 w-4 text-yellow-600" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      Reduzir Movimento
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Minimiza animações e transições
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="settings.reduceMotion"
                  @change="saveSettings"
                  class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                />
              </label>

              <label class="flex items-start gap-3 cursor-pointer group">
                <div class="flex items-center gap-3 flex-1">
                  <div class="flex-shrink-0 mt-0.5">
                    <Target class="h-4 w-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      Indicadores de Foco
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Destaca elementos focados
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="settings.focusIndicators"
                  @change="saveSettings"
                  class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                />
              </label>

              <label class="flex items-start gap-3 cursor-pointer group">
                <div class="flex items-center gap-3 flex-1">
                  <div class="flex-shrink-0 mt-0.5">
                    <Volume2 class="h-4 w-4 text-red-600" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      Otimizar para Leitor de Tela
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Melhora compatibilidade com leitores de tela
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  v-model="settings.screenReaderOptimized"
                  @change="saveSettings"
                  class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="resetToDefaults"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-medium"
          >
            <RotateCcw class="h-4 w-4" />
            Restaurar Padrões
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { 
  Settings, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  RotateCcw,
  Zap,
  Target,
  Volume2
} from 'lucide-vue-next'
import { useAccessibility } from '@/common/composables/useAccessibility'

const { settings, setTheme, setContrast, setFontSize, saveSettings, resetToDefaults } = useAccessibility()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)

const contrasts = [
  { value: 'normal' as const, label: 'Normal', opacity: 0.4 },
  { value: 'high' as const, label: 'Alto', opacity: 0.7 },
  { value: 'maximum' as const, label: 'Máximo', opacity: 1 },
]

const fontSizes = [
  { value: 'small' as const, label: 'Pequena', size: 'text-xs' },
  { value: 'normal' as const, label: 'Normal', size: 'text-sm' },
  { value: 'large' as const, label: 'Grande', size: 'text-base' },
  { value: 'extra' as const, label: 'Extra', size: 'text-lg' },
]

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    menuRef.value &&
    buttonRef.value &&
    !menuRef.value.contains(event.target as Node) &&
    !buttonRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false
  }
}

// Close on Escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
    buttonRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

// Watch for changes in checkboxes
watch(() => settings.value.reduceMotion, saveSettings)
watch(() => settings.value.focusIndicators, saveSettings)
watch(() => settings.value.screenReaderOptimized, saveSettings)
</script>
