<template>
  <div v-if="totalItems > itemsPerPage" class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
    <p class="text-sm text-gray-600">
      Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, totalItems) }} de {{ totalItems }} editais
    </p>
    <div class="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        @click="$emit('previous')"
        :disabled="currentPage === 1"
        class="gap-1.5"
      >
        <ChevronLeft class="h-4 w-4" />
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="gap-1.5"
      >
        Próxima
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '@/common/components/ui/Button.vue'

defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
}>()

defineEmits<{
  (e: 'next'): void
  (e: 'previous'): void
}>()
</script>
