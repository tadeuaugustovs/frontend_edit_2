<template>
  <div class="w-full h-full">
    <v-chart 
      ref="chartRef"
      class="w-full h-full"
      :option="chartOption"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  BarChart, 
  LineChart, 
  PieChart,
  ScatterChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

const props = defineProps<{
  title?: string
  labels: string[]
  data: number[]
  type?: 'bar' | 'line' | 'pie' | 'doughnut' | 'horizontalBar' | 'area' | 'scatter'
  showTitle?: boolean
}>()

const chartRef = ref()

// Cores FAPES (Azul Institucional, Verde, Laranja)
const fapesColors = [
  '#1e40af', // Azul FAPES
  '#059669', // Verde FAPES  
  '#ea580c', // Laranja FAPES
  '#7c3aed', // Roxo complementar
  '#dc2626', // Vermelho complementar
  '#0891b2', // Ciano
  '#65a30d', // Verde lima
  '#c2410c', // Laranja escuro
  '#4338ca', // Índigo
  '#be185d'  // Rosa
]

const chartOption = computed(() => {
  console.log('📊 ECharts FAPES - Criando opção:', {
    title: props.title,
    type: props.type,
    labels: props.labels?.length,
    data: props.data?.length
  })

  if (!props.labels?.length || !props.data?.length) {
    return {}
  }

  // Configuração base limpa e profissional
  const baseOption = {
    backgroundColor: 'transparent',
    color: fapesColors,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#1e40af',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      }
    },
    animation: true,
    animationDuration: 800
  }

  // Título opcional
  if (props.showTitle && props.title) {
    baseOption.title = {
      text: props.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151'
      }
    }
  }

  // Configurações específicas por tipo
  switch (props.type) {
    case 'pie':
    case 'doughnut':
      return {
        ...baseOption,
        tooltip: {
          ...baseOption.tooltip,
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          textStyle: {
            fontSize: 11,
            color: '#6b7280'
          }
        },
        series: [{
          type: 'pie',
          radius: props.type === 'doughnut' ? ['35%', '65%'] : '65%',
          center: ['50%', '45%'],
          data: props.labels.map((label, index) => ({
            name: label,
            value: props.data[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          label: {
            fontSize: 11,
            color: '#374151'
          }
        }]
      }

    case 'line':
    case 'area':
      return {
        ...baseOption,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: props.showTitle ? '15%' : '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.labels,
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280',
            rotate: props.labels.some(label => label.length > 12) ? 30 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280'
          },
          splitLine: {
            lineStyle: { color: '#f3f4f6' }
          }
        },
        series: [{
          type: 'line',
          data: props.data,
          smooth: true,
          lineStyle: {
            width: 3,
            color: fapesColors[0]
          },
          itemStyle: {
            color: fapesColors[0],
            borderWidth: 2,
            borderColor: '#ffffff'
          },
          areaStyle: props.type === 'area' ? {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: fapesColors[0] + '40' },
                { offset: 1, color: fapesColors[0] + '10' }
              ]
            }
          } : undefined
        }]
      }

    case 'horizontalBar':
      return {
        ...baseOption,
        grid: {
          left: '35%', // Espaço extra para nomes longos dos editais
          right: '4%',
          bottom: '3%',
          top: props.showTitle ? '15%' : '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280'
          },
          splitLine: {
            lineStyle: { color: '#f3f4f6' }
          }
        },
        yAxis: {
          type: 'category',
          data: props.labels,
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280',
            interval: 0,
            width: 120,
            overflow: 'truncate'
          }
        },
        series: [{
          type: 'bar',
          data: props.data,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0]
          }
        }]
      }

    case 'scatter':
      return {
        ...baseOption,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: props.showTitle ? '15%' : '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.labels,
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280'
          },
          splitLine: {
            lineStyle: { color: '#f3f4f6' }
          }
        },
        series: [{
          type: 'scatter',
          data: props.data,
          symbolSize: 8,
          itemStyle: {
            color: fapesColors[0]
          }
        }]
      }

    default: // 'bar'
      return {
        ...baseOption,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: props.showTitle ? '15%' : '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: props.labels,
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280',
            rotate: props.labels.some(label => label.length > 12) ? 30 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#e5e7eb' }
          },
          axisLabel: {
            fontSize: 11,
            color: '#6b7280'
          },
          splitLine: {
            lineStyle: { color: '#f3f4f6' }
          }
        },
        series: [{
          type: 'bar',
          data: props.data,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }
  }
})

watch(() => [props.labels, props.data, props.type], () => {
  console.log('🔄 ECharts FAPES - Props alteradas')
}, { deep: true })
</script>