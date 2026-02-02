<template>
  <div class="flex flex-col md:flex-row gap-4 mb-6">
    <div class="flex-1 relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        :value="search"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Pesquisar editais..."
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
      />
    </div>
    <select
      :value="status"
      @change="$emit('update:status', ($event.target as HTMLSelectElement).value)"
      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
    >
      <option value="">Todos os status</option>
      <option value="open">Aberto</option>
      <option value="closed">Fechado</option>
      <option value="analyzing">Em Análise</option>
    </select>
    <Button variant="outline" @click="$emit('clear')" class="gap-2">
      <X class="h-4 w-4" />
      Limpar
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import Button from '@/common/components/ui/Button.vue'

defineProps<{
  search: string
  status: string
}>()

defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:status', value: string): void
  (e: 'clear'): void
}>()
</script>
