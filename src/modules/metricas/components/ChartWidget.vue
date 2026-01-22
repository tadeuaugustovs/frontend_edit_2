<template>
  <div 
    class="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm transition-all duration-300"
    :class="{ 
      'opacity-50': !isVisible,
      'hover:shadow-lg': isVisible 
    }"
  >
    <!-- Header de Controle (só aparece no modo de edição) -->
    <div v-if="isEditMode" class="border-b border-gray-200/50 p-3 bg-gray-50/50 rounded-t-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Toggle de Visibilidade -->
          <button
            @click="$emit('toggleVisibility')"
            class="flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors"
            :class="isVisible 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'"
          >
            <Eye v-if="isVisible" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
            {{ isVisible ? 'Visível' : 'Oculto' }}
          </button>
          
          <!-- Título do Widget -->
          <span class="text-sm font-medium text-gray-700">{{ title }}</span>
        </div>
        
        <!-- Seletor de Tipo de Gráfico -->
        <select
          :value="chartType"
          @change="$emit('changeType', $event.target.value)"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="bar">Barras Verticais</option>
          <option value="horizontalBar">Barras Horizontais</option>
          <option value="line">Linha</option>
          <option value="area">Área</option>
          <option value="pie">Pizza</option>
          <option value="doughnut">Rosquinha</option>
          <option value="scatter">Dispersão</option>
        </select>
      </div>
    </div>

    <!-- Conteúdo do Widget -->
    <div class="p-6">
      <!-- Título (só aparece quando NÃO está no modo de edição) -->
      <div v-if="!isEditMode" class="flex items-center gap-2 mb-4">
        <component :is="icon" class="h-5 w-5 text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>

      <!-- Área do Gráfico -->
      <div class="h-80 rounded-lg overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

defineProps<{
  id: string
  title: string
  icon: any
  isEditMode: boolean
  isVisible: boolean
  chartType: string
}>()

defineEmits<{
  toggleVisibility: []
  changeType: [type: string]
}>()
</script>