# 🎨 Implementação Final - Gráficos e Editais

## 📊 Parte 1: Adicionar Lista de Editais na Home

### Arquivo: `src/modules/gestao-editais/views/HomePage.vue`

Adicione esta seção ANTES do fechamento da tag `</main>`:

```vue
<!-- Editais Disponíveis -->
<div class="mt-12">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Editais Disponíveis</h2>
      <p class="text-gray-600">Visualize e gerencie todos os editais cadastrados no sistema</p>
    </div>
    <Button @click="navigateTo('/management')">
      + Novo Edital
    </Button>
  </div>

  <!-- Loading State -->
  <div v-if="isLoadingEditals" class="text-center py-12">
    <Spinner />
    <p class="mt-4 text-gray-600">Carregando editais...</p>
  </div>

  <!-- Editais List -->
  <div v-else-if="editais.length > 0" class="grid grid-cols-1 gap-4">
    <Card v-for="edital in editais" :key="edital.id" :hover="true" class="cursor-pointer">
      <CardContent class="p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ edital.title }}</h3>
              <Badge :variant="getStatusVariant(edital.status)">
                {{ getStatusLabel(edital.status) }}
              </Badge>
            </div>
            <p class="text-gray-600 mb-4">{{ edital.description }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>📄 {{ edital.metadata_count }} metadados</span>
              <span>📎 {{ edital.files_count }} arquivos</span>
              <span>📅 {{ formatDate(edital.created_at) }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click.stop="viewEdital(edital.id)">
              👁️ Ver Detalhes
            </Button>
            <Button variant="outline" size="sm" @click.stop="editEdital(edital.id)">
              ✏️ Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-12 bg-white rounded-lg border-2 border-dashed">
    <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum edital encontrado</h3>
    <p class="text-gray-600 mb-4">Comece criando seu primeiro edital</p>
    <Button @click="navigateTo('/management')">
      + Criar Primeiro Edital
    </Button>
  </div>
</div>
```

Adicione no `<script setup>`:

```typescript
import { ref, onMounted } from 'vue'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import Badge from '@/common/components/ui/Badge.vue'
import Spinner from '@/common/components/ui/Spinner.vue'

const editais = ref([])
const isLoadingEditals = ref(false)

const loadEditais = async () => {
  isLoadingEditals.value = true
  try {
    editais.value = await editalService.getEditals()
  } catch (error) {
    console.error('Erro ao carregar editais:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar editais'
    })
  } finally {
    isLoadingEditals.value = false
  }
}

const getStatusVariant = (status: string) => {
  const variants = {
    open: 'success',
    closed: 'destructive',
    analyzing: 'warning'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels = {
    open: 'Aberto',
    closed: 'Fechado',
    analyzing: 'Em Análise'
  }
  return labels[status] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const viewEdital = (id: string) => {
  // Implementar visualização
  console.log('Ver edital:', id)
}

const editEdital = (id: string) => {
  // Implementar edição
  console.log('Editar edital:', id)
}

onMounted(() => {
  loadEditais()
})
```

## 📈 Parte 2: Página de Métricas com Gráficos

### Arquivo: `src/modules/metricas/components/EngagementChart.vue`

Crie este componente:

```vue
<template>
  <Card>
    <CardContent class="p-6">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      <div class="h-64">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Card from '@/common/components/ui/Card.vue'
import CardContent from '@/common/components/ui/CardContent.vue'
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

  chartInstance = new Chart(ctx, {
    type: props.type || 'bar',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.data,
        backgroundColor: props.backgroundColor || [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
        ],
        borderColor: props.type === 'line' ? '#3b82f6' : undefined,
        borderWidth: props.type === 'line' ? 2 : 1,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.type === 'pie'
        }
      },
      scales: props.type !== 'pie' ? {
        y: {
          beginAtZero: true
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
```

### Arquivo: `src/modules/metricas/views/MetricsPage.vue`

Substitua o conteúdo por:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="router.push('/')">
              ← Voltar
            </Button>
            <h1 class="text-2xl font-bold text-gray-900">Métricas e Análises</h1>
          </div>
          <div class="flex items-center space-x-4">
            <Button variant="outline" size="sm" @click="loadMetrics">
              🔄 Atualizar
            </Button>
            <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
            <Button variant="outline" size="sm" @click="handleLogout">
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Info Alert -->
        <Alert>
          <p class="text-sm">
            <strong>Dica:</strong> Visualize as métricas de mensagens e conversas ao longo do tempo e por edital.
          </p>
        </Alert>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <Spinner />
          <p class="mt-4 text-gray-600">Carregando métricas...</p>
        </div>

        <!-- Metrics Content -->
        <div v-else>
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Total de Mensagens</p>
                    <p class="text-3xl font-bold text-blue-600 mt-2">
                      {{ metrics?.total_messages || 0 }}
                    </p>
                  </div>
                  <div class="p-3 bg-blue-100 rounded-full">
                    💬
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p class="text-3xl font-bold text-green-600 mt-2">
                      {{ metrics?.total_users || 0 }}
                    </p>
                  </div>
                  <div class="p-3 bg-green-100 rounded-full">
                    👥
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Total de Editais</p>
                    <p class="text-3xl font-bold text-purple-600 mt-2">
                      {{ metrics?.total_editals || 0 }}
                    </p>
                  </div>
                  <div class="p-3 bg-purple-100 rounded-full">
                    📄
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Charts -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Messages by Edital -->
            <EngagementChart
              title="Mensagens por Edital"
              :labels="editalLabels"
              :data="messageData"
              type="bar"
            />

            <!-- Users by Edital -->
            <EngagementChart
              title="Usuários por Edital"
              :labels="editalLabels"
              :data="userData"
              type="line"
            />

            <!-- Distribution Pie Chart -->
            <EngagementChart
              title="Distribuição de Mensagens"
              :labels="editalLabels"
              :data="messageData"
              type="pie"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { metricsService } from '@/services/metrics.service'
import Card from '@/common/components/ui/Card.vue'
import CardContent from '@/common/components/ui/CardContent.vue'
import Button from '@/common/components/ui/Button.vue'
import Alert from '@/common/components/ui/Alert.vue'
import Spinner from '@/common/components/ui/Spinner.vue'
import EngagementChart from '@/modules/metricas/components/EngagementChart.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const metrics = ref(null)
const isLoading = ref(false)

const editalLabels = computed(() => {
  return metrics.value?.by_edital?.map(e => e.edital_title.substring(0, 30)) || []
})

const messageData = computed(() => {
  return metrics.value?.by_edital?.map(e => e.message_count) || []
})

const userData = computed(() => {
  return metrics.value?.by_edital?.map(e => e.user_count) || []
})

const loadMetrics = async () => {
  isLoading.value = true
  try {
    metrics.value = await metricsService.getEngagementMetrics()
  } catch (error) {
    console.error('Erro ao carregar métricas:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar métricas'
    })
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  uiStore.showToast({
    type: 'success',
    message: 'Logout realizado com sucesso'
  })
  router.push('/login')
}

onMounted(() => {
  loadMetrics()
})
</script>
```

## 📦 Parte 3: Instalar Chart.js

```bash
npm install chart.js
```

## 🚀 Como Implementar:

1. **Instale o Chart.js:**
   ```bash
   npm install chart.js
   ```

2. **Atualize HomePage.vue** com a seção de editais

3. **Crie o componente EngagementChart.vue**

4. **Atualize MetricsPage.vue** com os gráficos

5. **Recarregue o navegador** (Ctrl+F5)

## ✅ Resultado Esperado:

### Home Page:
- ✅ 3 cards de navegação no topo
- ✅ Lista de editais abaixo
- ✅ Cada edital com badge de status
- ✅ Botões de ver detalhes e editar

### Métricas Page:
- ✅ 3 cards com totais (mensagens, usuários, editais)
- ✅ Gráfico de barras: Mensagens por Edital
- ✅ Gráfico de linhas: Usuários por Edital
- ✅ Gráfico de pizza: Distribuição de Mensagens

---

**Implemente esses arquivos e terá exatamente o que mostrou nas imagens!** 🎨
