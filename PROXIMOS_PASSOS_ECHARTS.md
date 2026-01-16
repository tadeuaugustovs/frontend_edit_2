# 📊 Próximos Passos: Implementação ECharts com Widgets Configuráveis

## ✅ O que já foi feito:

1. ✅ ECharts instalado (`npm install echarts vue-echarts`)
2. ✅ Dados mockados criados no Django:
   - 5 editais diferentes
   - 50 sessões de conversa
   - 285 mensagens
   - 8 usuários diferentes
3. ✅ Backend Django funcionando com dados reais

## 🎯 O que precisa ser implementado:

### 1. Criar Views de Métricas no Django

Arquivo: `django_backend/apps/metrics/views.py`

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from apps.conversations.models import ConversationSession, Message
from apps.editals.models import Edital

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def engagement_metrics(request):
    """Retorna métricas de engajamento"""
    
    # Totais
    total_messages = Message.objects.count()
    total_users = ConversationSession.objects.values('user_email').distinct().count()
    total_editals = Edital.objects.count()
    
    # Por edital
    by_edital = []
    for edital in Edital.objects.all():
        message_count = Message.objects.filter(edital=edital).count()
        user_count = ConversationSession.objects.filter(edital=edital).values('user_email').distinct().count()
        
        by_edital.append({
            'edital_id': str(edital.id),
            'edital_title': edital.title,
            'message_count': message_count,
            'user_count': user_count
        })
    
    return Response({
        'total_messages': total_messages,
        'total_users': total_users,
        'total_editals': total_editals,
        'by_edital': by_edital
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def messages_list(request):
    """Lista mensagens com paginação e filtros"""
    
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    edital_id = request.GET.get('edital_id')
    
    messages = Message.objects.select_related('session', 'edital').all()
    
    if edital_id:
        messages = messages.filter(edital_id=edital_id)
    
    # Paginação
    start = (page - 1) * page_size
    end = start + page_size
    
    total = messages.count()
    messages_page = messages[start:end]
    
    results = []
    for msg in messages_page:
        results.append({
            'id': msg.id,
            'user_email': msg.session.user_email,
            'content': msg.content,
            'timestamp': msg.timestamp,
            'edital_id': str(msg.edital.id) if msg.edital else None,
            'edital_title': msg.edital.title if msg.edital else None
        })
    
    return Response({
        'count': total,
        'next': f'/api/metrics/messages/?page={page+1}&page_size={page_size}' if end < total else None,
        'previous': f'/api/metrics/messages/?page={page-1}&page_size={page_size}' if page > 1 else None,
        'results': results
    })
```

Arquivo: `django_backend/apps/metrics/urls.py`

```python
from django.urls import path
from . import views

app_name = 'metrics'

urlpatterns = [
    path('engagement/', views.engagement_metrics, name='engagement'),
    path('messages/', views.messages_list, name='messages'),
]
```

Adicionar em `django_backend/django_backend/urls.py`:

```python
path('api/metrics/', include('apps.metrics.urls')),
```

### 2. Criar Componente ECharts Configurável

Arquivo: `src/components/ConfigurableChart.vue`

```vue
<template>
  <div class="chart-widget">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="localChartType" @change="$emit('update:chartType', localChartType)">
          <option value="bar">Barras</option>
          <option value="line">Linhas</option>
          <option value="pie">Pizza</option>
          <option value="scatter">Dispersão</option>
        </select>
        <button @click="$emit('reset')" class="reset-btn">
          🔄 Reset
        </button>
      </div>
    </div>
    <v-chart :option="chartOption" :style="{ height: '400px' }" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const props = defineProps<{
  title: string
  data: any[]
  chartType: 'bar' | 'line' | 'pie' | 'scatter'
  xAxisKey: string
  yAxisKey: string
}>()

const emit = defineEmits(['update:chartType', 'reset'])

const localChartType = ref(props.chartType)

watch(() => props.chartType, (newVal) => {
  localChartType.value = newVal
})

const chartOption = computed(() => {
  const xData = props.data.map(item => item[props.xAxisKey])
  const yData = props.data.map(item => item[props.yAxisKey])

  const baseOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [props.title]
    }
  }

  if (localChartType.value === 'bar') {
    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: props.title,
        type: 'bar',
        data: yData,
        itemStyle: {
          color: '#3b82f6'
        }
      }]
    }
  } else if (localChartType.value === 'line') {
    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: props.title,
        type: 'line',
        data: yData,
        smooth: true,
        itemStyle: {
          color: '#10b981'
        }
      }]
    }
  } else if (localChartType.value === 'pie') {
    return {
      ...baseOption,
      series: [{
        name: props.title,
        type: 'pie',
        radius: '50%',
        data: props.data.map(item => ({
          name: item[props.xAxisKey],
          value: item[props.yAxisKey]
        }))
      }]
    }
  } else {
    return {
      ...baseOption,
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: props.title,
        type: 'scatter',
        data: props.data.map(item => [item[props.xAxisKey], item[props.yAxisKey]])
      }]
    }
  }
})
</script>

<style scoped>
.chart-widget {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  gap: 10px;
}

.chart-controls select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.reset-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
}
</style>
```

### 3. Atualizar Página de Métricas

Arquivo: `src/modules/metricas/views/MetricsPage.vue`

```vue
<template>
  <div class="metrics-page">
    <header class="page-header">
      <h1>📊 Métricas e Análises</h1>
      <button @click="resetAllCharts" class="reset-all-btn">
        🔄 Resetar Todos os Gráficos
      </button>
    </header>

    <div class="metrics-grid">
      <!-- Widget 1: Mensagens por Edital -->
      <ConfigurableChart
        title="Mensagens por Edital"
        :data="messagesByEdital"
        :chart-type="chartTypes.messagesByEdital"
        @update:chart-type="chartTypes.messagesByEdital = $event"
        @reset="resetChart('messagesByEdital')"
        x-axis-key="edital_title"
        y-axis-key="message_count"
      />

      <!-- Widget 2: Usuários por Edital -->
      <ConfigurableChart
        title="Usuários por Edital"
        :data="usersByEdital"
        :chart-type="chartTypes.usersByEdital"
        @update:chart-type="chartTypes.usersByEdital = $event"
        @reset="resetChart('usersByEdital')"
        x-axis-key="edital_title"
        y-axis-key="user_count"
      />

      <!-- Widget 3: Totais -->
      <div class="stats-cards">
        <div class="stat-card">
          <h3>Total de Mensagens</h3>
          <p class="stat-value">{{ metrics?.total_messages || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Total de Usuários</h3>
          <p class="stat-value">{{ metrics?.total_users || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Total de Editais</h3>
          <p class="stat-value">{{ metrics?.total_editals || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { metricsService } from '@/services/metrics.service'
import ConfigurableChart from '@/components/ConfigurableChart.vue'

const metrics = ref(null)
const isLoading = ref(false)

const chartTypes = ref({
  messagesByEdital: 'bar',
  usersByEdital: 'line'
})

const defaultChartTypes = {
  messagesByEdital: 'bar',
  usersByEdital: 'line'
}

const messagesByEdital = computed(() => {
  return metrics.value?.by_edital || []
})

const usersByEdital = computed(() => {
  return metrics.value?.by_edital || []
})

const loadMetrics = async () => {
  isLoading.value = true
  try {
    metrics.value = await metricsService.getEngagementMetrics()
  } catch (error) {
    console.error('Erro ao carregar métricas:', error)
  } finally {
    isLoading.value = false
  }
}

const resetChart = (chartName: string) => {
  chartTypes.value[chartName] = defaultChartTypes[chartName]
}

const resetAllCharts = () => {
  Object.keys(defaultChartTypes).forEach(key => {
    chartTypes.value[key] = defaultChartTypes[key]
  })
}

onMounted(() => {
  loadMetrics()
})
</script>

<style scoped>
.metrics-page {
  padding: 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.reset-all-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-top: 10px;
}
</style>
```

## 🚀 Como Implementar:

1. **Criar as views de métricas no Django**
2. **Adicionar as URLs**
3. **Criar o componente ConfigurableChart.vue**
4. **Atualizar a página de métricas**
5. **Testar!**

## 📝 Comandos Úteis:

```bash
# Popular dados mockados
cd django_backend
source venv/bin/activate
python manage.py populate_metrics_data

# Testar endpoint de métricas
curl -X GET "http://localhost:8002/api/metrics/engagement/" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🎨 Recursos dos Widgets:

- ✅ Trocar tipo de gráfico (Barras, Linhas, Pizza, Dispersão)
- ✅ Botão de reset individual por widget
- ✅ Botão de reset global para todos os widgets
- ✅ Dados reais do Django
- ✅ Gráficos interativos com ECharts
- ✅ Design responsivo

---

**Próximo passo:** Implementar as views e componentes acima! 🚀
