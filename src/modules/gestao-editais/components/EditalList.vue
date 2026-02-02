<template>
  <div class="space-y-4">
    <div
      v-for="edital in items"
      :key="edital.id"
      @click="$emit('view-details', edital)"
      class="group cursor-pointer backdrop-blur-sm bg-white/80 border border-gray-200/50 rounded-lg p-5 hover:shadow-md hover:bg-white transition-all duration-200"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {{ edital.title }}
            </h3>
            <Badge :variant="getStatusVariant(edital.status)">
              {{ getStatusLabel(edital.status) }}
            </Badge>
          </div>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ edital.description }}</p>
          
          <div class="flex flex-wrap gap-4 text-xs text-gray-500">
            <div class="flex items-center gap-1.5">
              <Paperclip class="h-3.5 w-3.5" />
              {{ edital.files_count }} {{ edital.files_count === 1 ? 'arquivo' : 'arquivos' }}
            </div>
            <div class="flex items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5" />
              Atualizado em {{ formatDate(edital.updated_at) }}
            </div>
          </div>
        </div>
        <div class="flex gap-2 ml-4 self-center">
          <Button variant="ghost" size="sm" @click.stop="$emit('view-details', edital)" class="group-hover:text-blue-600">
            <Eye class="h-4 w-4 mr-2" />
            Detalhes
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, Paperclip, Calendar } from 'lucide-vue-next'
import Badge from '@/common/components/ui/Badge.vue'
import Button from '@/common/components/ui/Button.vue'
import { getStatusVariant, getStatusLabel, formatDate } from '../utils/edital.utils'
import type { Edital } from '../types/edital.types'

defineProps<{
  items: Edital[]
}>()

defineEmits<{
  (e: 'view-details', edital: Edital): void
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
