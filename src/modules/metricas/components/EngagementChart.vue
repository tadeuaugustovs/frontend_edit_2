<template>
  <div class="h-80">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{
  title: string
  labels: string[]
  data: number[]
  type?: 'bar' | 'line' | 'pie'
  backgroundColor?: string | string[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const colors = props.backgroundColor || [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
  ]

  chartInstance = new Chart(ctx, {
    type: props.type || 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        backgroundColor: colors,
        borderColor: props.type === 'line' ? '#3b82f6' : undefined,
        borderWidth: props.type === 'line' ? 3 : 1,
        tension: 0.4,
        fill: props.type === 'line' ? false : undefined
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.type === 'pie',
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          cornerRadius: 8
        }
      },
      scales: props.type !== 'pie' ? {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      } : undefined
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => [props.labels, props.data], () => {
  createChart()
}, { deep: true })
</script>
