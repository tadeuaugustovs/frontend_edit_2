<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        @click="$emit('update:open', false)"
      ></div>
      
      <!-- Content Container -->
      <div 
        :class="[
          'relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full transition-all transform duration-300 overflow-hidden',
          props.class
        ]"
      >
        <slot></slot>
        
        <!-- Close Button -->
        <button 
          @click="$emit('update:open', false)"
          class="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors z-10"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  class?: string
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

export const DialogContent = defineComponent({
  name: 'DialogContent',
  props: ['class'],
  setup(props, { slots }) {
    return () => h('div', { class: ['p-6', props.class] }, slots.default?.())
  }
})

export const DialogHeader = defineComponent({
  name: 'DialogHeader',
  setup(_, { slots }) {
    return () => h('div', { class: 'mb-4' }, slots.default?.())
  }
})

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  setup(_, { slots }) {
    return () => h('h2', { class: 'text-xl font-bold text-slate-900 dark:text-white' }, slots.default?.())
  }
})

export const DialogDescription = defineComponent({
  name: 'DialogDescription',
  setup(_, { slots }) {
    return () => h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-1' }, slots.default?.())
  }
})

export const DialogFooter = defineComponent({
  name: 'DialogFooter',
  setup(_, { slots }) {
    return () => h('div', { class: 'mt-6 flex justify-end gap-3' }, slots.default?.())
  }
})

// To satisfy named import { Dialog }
export { default as Dialog } from './Dialog.vue'
</script>
