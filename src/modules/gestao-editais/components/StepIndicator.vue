<template>
  <div class="flex items-center" :class="{ 'flex-1': !isLast }">
    <div class="flex flex-col items-center">
      <div
        :class="[
          'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all',
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
        ]"
      >
        <CheckCircle v-if="isCompleted" class="h-6 w-6" />
        <span v-else>{{ number }}</span>
      </div>
      <div class="mt-2 text-center">
        <p
          :class="[
            'text-sm font-medium',
            isActive || isCompleted
              ? 'text-gray-900 dark:text-slate-100'
              : 'text-gray-600 dark:text-slate-400'
          ]"
        >
          {{ title }}
        </p>
        <p class="text-xs text-gray-500 dark:text-slate-500">{{ subtitle }}</p>
      </div>
    </div>
    <div
      v-if="!isLast"
      :class="[
        'flex-1 h-0.5 mx-4 transition-all',
        isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-slate-700'
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next'

defineProps<{
  number: number
  title: string
  subtitle: string
  isActive: boolean
  isCompleted: boolean
  isLast: boolean
}>()
</script>
