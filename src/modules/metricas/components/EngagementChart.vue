<template>
  <div class="h-80 w-full">
    <canvas 
      ref="chartCanvas" 
      class="w-full h-full"
      width="400"
      height="320"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps<{
  title: string
  labels: string[]
  data: number[]
  type?: 'bar' | 'line' | 'pie' | 'doughnut' | 'horizontalBar' | 'area'
  backgroundColor?: string | string[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

const destroyChart = () => {
  if (chartInstance) {
    try {
      chartInstance.destroy()
    } catch (e) {
      console.warn('Erro ao destruir gráfico:', e)
    }
    chartInstance = null
  }
}

const createChart = async () => {
  try {
    // Wait for DOM
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log('🎨 Iniciando criação do gráfico:', {
      title: props.title,
      type: props.type,
      labelsLength: props.labels?.length,
      dataLength: props.data?.length,
      canvas: !!chartCanvas.value
    })

    if (!chartCanvas.value) {
      console.error('❌ Canvas não encontrado')
      return
    }

    // Destroy existing chart
    destroyChart()

    // Get context
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) {
      console.error('❌ Contexto 2D não encontrado')
      return
    }

    // Validate data
    if (!props.labels?.length || !props.data?.length) {
      console.warn('⚠️ Dados insuficientes:', { labels: props.labels, data: props.data })
      return
    }

    // Import Chart.js dynamically
    const { default: Chart } = await import('chart.js/auto')
    
    // Colors
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
    ]

    // Chart type and axis
    let chartType = props.type || 'bar'
    let indexAxis = 'x'
    
    if (chartType === 'horizontalBar') {
      chartType = 'bar'
      indexAxis = 'y'
    }

    // Configuration
    const config = {
      type: chartType,
      data: {
        labels: props.labels,
        datasets: [{
          label: props.title,
          data: props.data,
          backgroundColor: colors.slice(0, props.data.length),
          borderColor: chartType === 'line' ? '#3b82f6' : undefined,
          borderWidth: 1,
          tension: chartType === 'line' ? 0.4 : undefined
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: indexAxis,
        plugins: {
          legend: {
            display: chartType === 'pie' || chartType === 'doughnut'
          }
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          y: { beginAtZero: true },
          x: { beginAtZero: true }
        } : {}
      }
    }

    console.log('📊 Criando gráfico com config:', config)
    
    // Create chart
    chartInstance = new Chart(ctx, config)
    
    console.log('✅ Gráfico criado:', chartInstance)
    
  } catch (error) {
    console.error('❌ Erro ao criar gráfico:', error)
  }
}

onMounted(() => {
  console.log('🔄 EngagementChart montado')
  createChart()
})

onBeforeUnmount(() => {
  console.log('🔄 EngagementChart desmontado')
  destroyChart()
})

watch(() => [props.labels, props.data, props.type], () => {
  console.log('🔄 Props alteradas, recriando gráfico')
  createChart()
}, { deep: true })
</script>
