<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <!-- Management Card -->
    <div 
      @click="$emit('navigate', '/management')"
      class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <FileText class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Gestão de Editais
        </h3>
        <p class="text-sm text-gray-600 mb-4 flex-grow">
          Crie e gerencie editais, faça upload de documentos e configure metadados
        </p>
        <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
          Acessar
        </Button>
      </div>
    </div>

    <!-- Metrics Card (Disabled by user request) -->
    <div 
      v-if="false"
      @click="$emit('navigate', '/metrics')"
      class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
            <BarChart3 class="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Métricas e Análises
        </h3>
        <p class="text-sm text-gray-600 mb-4 flex-grow">
          Visualize estatísticas de engajamento e mensagens por edital
        </p>
        <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-green-50 dark:group-hover:bg-green-900/30">
          Acessar
        </Button>
      </div>
    </div>

    <!-- History Card -->
    <div 
      @click="$emit('navigate', '/history')"
      class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
            <MessageSquare class="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Histórico de Conversas
        </h3>
        <p class="text-sm text-gray-600 mb-4 flex-grow">
          Acesse o histórico completo de conversas entre usuários e chatbot
        </p>
        <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30">
          Acessar
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, BarChart3, MessageSquare } from 'lucide-vue-next'
import Button from '@/common/components/ui/Button.vue'

defineEmits<{
  (e: 'navigate', path: string): void
}>()
</script>
