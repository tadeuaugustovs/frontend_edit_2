<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccessibility } from '@/common/composables/useAccessibility'

// Initialize accessibility settings on app mount
const { settings } = useAccessibility()

onMounted(() => {
  console.log('🎨 Accessibility settings loaded:', settings.value)
})
</script>

<template>
  <RouterView />
</template>
