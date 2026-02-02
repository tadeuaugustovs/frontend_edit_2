<template>
  <div class="space-y-6">
    <!-- Info Section -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Número</p>
        <p class="text-gray-900 font-medium">{{ edital.numero || 'N/A' }}</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Tags</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in edital.tags" :key="tag" class="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600">
            {{ tag }}
          </span>
          <span v-if="!edital.tags?.length" class="text-gray-400 italic">Sem tags</span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Descrição</h3>
      <p class="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100">
        {{ edital.description }}
      </p>
    </div>

    <!-- Metadata Grid -->
    <div v-if="edital.metadata.length > 0">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Metadados e Prazos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="meta in edital.metadata" :key="meta.id" 
          class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
        >
          <span class="text-xs font-medium text-gray-500 uppercase">{{ meta.key }}</span>
          <span class="text-sm font-semibold text-gray-900">{{ meta.value }}</span>
        </div>
      </div>
    </div>

    <!-- Files Section -->
    <div>
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Arquivos e Documentos</h3>
      <div class="space-y-2">
        <div v-for="file in edital.files" :key="file.id" 
          class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div :class="[
              'p-2 rounded',
              file.file_type === 'main_pdf' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
            ]">
              <FileText v-if="file.file_type === 'main_pdf'" class="h-4 w-4" />
              <Paperclip v-else class="h-4 w-4" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ file.file_type === 'main_pdf' ? 'Arquivo Principal' : 'Anexo' }}</p>
            </div>
          </div>
          <a :href="file.url" target="_blank" class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <ExternalLink class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Paperclip, ExternalLink } from 'lucide-vue-next'
import type { Edital } from '../types/edital.types'

defineProps<{
  edital: Edital
}>()
</script>
