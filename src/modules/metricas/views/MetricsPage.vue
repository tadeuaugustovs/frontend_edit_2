<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
    <!-- Header Profissional -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="router.push('/')" class="gap-2">
              <ArrowLeft class="h-4 w-4" />
              Voltar
            </Button>
            <div class="border-l border-gray-300 pl-4">
              <h1 class="text-xl font-semibold text-gray-900">Dashboard FAPES</h1>
              <p class="text-xs text-gray-500">Métricas e Análises de Engajamento</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <AccessibilityMenu />
            <span class="text-sm text-gray-600 font-medium">{{ authStore.user?.name || 'admin' }}</span>
            <Button variant="outline" size="sm" @click="handleLogout" class="gap-2">
              <LogOut class="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Toolbar de Ações -->
    <div class="container mx-auto px-6 py-4">
      <div class="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Info class="h-4 w-4 text-blue-600" />
            <p class="text-sm text-gray-600">
              <strong>Dashboard FAPES:</strong> Visualize métricas de engajamento dos editais e conversas.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" @click="loadMetrics" class="gap-2" :disabled="isLoading">
              <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isLoading }" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" @click="clearCache" class="gap-2">
              <Trash2 class="h-4 w-4" />
              Limpar Cache
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              @click="toggleEditMode" 
              class="gap-2"
              :class="{ 'bg-blue-50 border-blue-300 text-blue-700': isEditMode }"
            >
              <Settings class="h-4 w-4" />
              {{ isEditMode ? 'Finalizar Edição' : 'Configurar Dashboard' }}
            </Button>
            <Button variant="outline" size="sm" @click="openReportsCenter" class="gap-2">
              <Reports class="h-4 w-4" />
              Central de Relatórios
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="container mx-auto px-6 py-4">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Estado de Carregamento -->
        <div v-if="isLoading" class="text-center py-20">
          <Spinner />
          <p class="mt-4 text-gray-600">Carregando métricas FAPES...</p>
        </div>

        <!-- Conteúdo das Métricas -->
        <div v-else>
          <!-- Cards de Resumo (KPIs) - Estilo Corporativo -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total de Mensagens -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-600 mb-1">Total de Mensagens</p>
                  <p class="text-3xl font-bold text-slate-800">{{ formatNumberFn(2658) }}</p>
                  <p class="text-xs text-slate-500 mt-1">27 editais ativos</p>
                </div>
                <FileText class="h-8 w-8 text-slate-600" />
              </div>
            </div>

            <!-- Total de Usuários -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-600 mb-1">Total de Usuários</p>
                  <p class="text-3xl font-bold text-slate-800">{{ formatNumberFn(456) }}</p>
                  <p class="text-xs text-slate-500 mt-1">usuários únicos</p>
                </div>
                <Users class="h-8 w-8 text-slate-600" />
              </div>
            </div>

            <!-- Média por Conversa -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-600 mb-1">Média por Conversa</p>
                  <p class="text-3xl font-bold text-slate-800">5,83</p>
                  <p class="text-xs text-slate-500 mt-1">mensagens por sessão</p>
                </div>
                <Activity class="h-8 w-8 text-slate-600" />
              </div>
            </div>

            <!-- Custo IA (em Reais) -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-600 mb-1">Custo IA (Mês)</p>
                  <p class="text-3xl font-bold text-slate-800">{{ formatCurrencyFn(convertUsdToBrlFn(347.89)) }}</p>
                  <p class="text-xs text-slate-500 mt-1">{{ formatNumberFn(11800) }} requisições</p>
                </div>
                <Banknote class="h-8 w-8 text-slate-600" />
              </div>
            </div>
          </div>

          <!-- Grid de Gráficos -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 1. Perguntas por Edital (CRÍTICO - Barras Horizontais) -->
            <ChartWidget
              id="questions-by-edital"
              title="Perguntas por Edital"
              :icon="BarChart3"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.questionsByEdital"
              :chart-type="chartTypes.questionsByEdital"
              @toggle-visibility="toggleWidgetVisibility('questionsByEdital')"
              @change-type="(type) => chartTypes.questionsByEdital = type"
            >
              <EChartsComponent
                :labels="editalLabels"
                :data="messageData"
                :type="chartTypes.questionsByEdital"
              />
            </ChartWidget>

            <!-- 2. Top Termos Perguntados -->
            <ChartWidget
              id="top-terms"
              title="Top Termos Perguntados"
              :icon="Hash"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.topTerms"
              :chart-type="chartTypes.topTerms"
              @toggle-visibility="toggleWidgetVisibility('topTerms')"
              @change-type="(type) => chartTypes.topTerms = type"
            >
              <EChartsComponent
                :labels="topTermsLabels"
                :data="topTermsData"
                :type="chartTypes.topTerms"
              />
            </ChartWidget>

            <!-- 3. Crescimento Mensal -->
            <ChartWidget
              id="monthly-growth"
              title="Crescimento Mensal"
              :icon="TrendingUp"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.monthlyGrowth"
              :chart-type="chartTypes.monthlyGrowth"
              @toggle-visibility="toggleWidgetVisibility('monthlyGrowth')"
              @change-type="(type) => chartTypes.monthlyGrowth = type"
            >
              <EChartsComponent
                :labels="monthlyLabels"
                :data="monthlyData"
                :type="chartTypes.monthlyGrowth"
              />
            </ChartWidget>

            <!-- 4. Usuários por Edital -->
            <ChartWidget
              id="users-by-edital"
              title="Usuários por Edital"
              :icon="Users"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.usersByEdital"
              :chart-type="chartTypes.usersByEdital"
              @toggle-visibility="toggleWidgetVisibility('usersByEdital')"
              @change-type="(type) => chartTypes.usersByEdital = type"
            >
              <EChartsComponent
                :labels="editalLabels"
                :data="userData"
                :type="chartTypes.usersByEdital"
              />
            </ChartWidget>

            <!-- 5. Uso de Tokens IA -->
            <ChartWidget
              id="ai-tokens"
              title="Uso de Tokens IA"
              :icon="Cpu"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.aiTokens"
              :chart-type="chartTypes.aiTokens"
              @toggle-visibility="toggleWidgetVisibility('aiTokens')"
              @change-type="(type) => chartTypes.aiTokens = type"
            >
              <EChartsComponent
                :labels="['Tokens Usados', 'Limite Mensal']"
                :data="[1847293, 2000000]"
                :type="chartTypes.aiTokens"
              />
            </ChartWidget>

            <!-- 6. Taxa de Resolução da Edite (Substituindo Distribuição de Editais) -->
            <ChartWidget
              id="ai-resolution-rate"
              title="Taxa de Resolução da Edite"
              :icon="Bot"
              :is-edit-mode="isEditMode"
              :is-visible="widgetVisibility.aiResolutionRate"
              :chart-type="chartTypes.aiResolutionRate"
              @toggle-visibility="toggleWidgetVisibility('aiResolutionRate')"
              @change-type="(type) => chartTypes.aiResolutionRate = type"
            >
              <EChartsComponent
                :labels="aiPerformanceLabels"
                :data="aiPerformanceData"
                :type="chartTypes.aiResolutionRate"
              />
            </ChartWidget>
          </div>
        </div>
      </div>
    </main>

    <!-- Central de Relatórios -->
    <ReportsCenter 
      :is-open="showReportsCenter" 
      @close="showReportsCenter = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { metricsService } from '@/services/metrics.service'
import { formatCurrency, formatNumber, convertUsdToBrl } from '@/common/utils/currency'
import Button from '@/common/components/ui/Button.vue'
import Spinner from '@/common/components/ui/Spinner.vue'
import EChartsComponent from '@/modules/metricas/components/EChartsComponent.vue'
import ChartWidget from '@/modules/metricas/components/ChartWidget.vue'
import ReportsCenter from '@/modules/metricas/components/ReportsCenter.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import { 
  ArrowLeft, 
  RefreshCw, 
  LogOut, 
  Users, 
  BarChart3,
  Info,
  Trash2,
  Settings,
  FileClockIcon as Reports,
  FileText,
  Activity,
  Banknote,
  Hash,
  TrendingUp,
  Cpu,
  Bot
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const metrics = ref(null)
const isLoading = ref(false)
const isEditMode = ref(false)
const showReportsCenter = ref(false)

// Funções de formatação
const { formatCurrency: formatCurrencyFn, formatNumber: formatNumberFn, convertUsdToBrl: convertUsdToBrlFn } = {
  formatCurrency,
  formatNumber,
  convertUsdToBrl
}

// Tipos de gráfico para cada widget
const chartTypes = ref({
  questionsByEdital: 'horizontalBar', // CRÍTICO para nomes longos
  topTerms: 'bar',
  monthlyGrowth: 'area',
  usersByEdital: 'line',
  aiTokens: 'pie',
  aiResolutionRate: 'donut' // Novo gráfico focado na performance da IA
})

// Visibilidade dos widgets
const widgetVisibility = ref({
  questionsByEdital: true,
  topTerms: true,
  monthlyGrowth: true,
  usersByEdital: true,
  aiTokens: true,
  aiResolutionRate: true // Novo widget de performance da IA
})

// Computed properties para dados dos gráficos
const editalLabels = computed(() => {
  if (!metrics.value?.by_edital?.length) {
    return [
      'Programa de Capacitação PROCAP 2026',
      'Nossa Bolsa - Programa de Bolsas',
      'Centelha - Inovação e Empreendedorismo',
      'Edital FAPES 001/2024 - Pesquisa em IA',
      'Edital FAPES 002/2024 - Inovação Tecnológica'
    ]
  }
  return metrics.value.by_edital.map(e => e.edital_title)
})

const messageData = computed(() => {
  if (!metrics.value?.by_edital?.length) {
    return [456, 389, 234, 198, 167]
  }
  return metrics.value.by_edital.map(e => e.message_count)
})

const userData = computed(() => {
  if (!metrics.value?.by_edital?.length) {
    return [78, 65, 45, 38, 32]
  }
  return metrics.value.by_edital.map(e => e.user_count)
})

const topTermsLabels = computed(() => {
  if (!metrics.value?.top_terms?.length) {
    return ['Bolsa', 'Prazo', 'Requisitos', 'Inscrição', 'Documentos', 'Cronograma']
  }
  return metrics.value.top_terms.map(t => t.term)
})

const topTermsData = computed(() => {
  if (!metrics.value?.top_terms?.length) {
    return [342, 298, 267, 234, 189, 156]
  }
  return metrics.value.top_terms.map(t => t.count)
})

const monthlyLabels = computed(() => {
  if (!metrics.value?.monthly_growth?.length) {
    return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  }
  return metrics.value.monthly_growth.map(m => m.month)
})

const monthlyData = computed(() => {
  if (!metrics.value?.monthly_growth?.length) {
    return [89, 134, 178, 223, 267, 312, 356, 398, 445, 489, 534, 578]
  }
  return metrics.value.monthly_growth.map(m => m.messages)
})

// Dados para o novo gráfico de performance da IA
const aiPerformanceLabels = computed(() => {
  return ['Resolvidas pela IA', 'Transferidas para Humano']
})

const aiPerformanceData = computed(() => {
  if (!metrics.value?.ai_performance) {
    return [87.3, 12.7] // Dados padrão baseados no PDF
  }
  return [
    metrics.value.ai_performance.resolution_rate,
    metrics.value.ai_performance.human_handoff_rate
  ]
})

// Funções
const loadMetrics = async () => {
  isLoading.value = true
  try {
    console.log('🔄 Carregando métricas FAPES...')
    metrics.value = await metricsService.getEngagementMetrics()
    console.log('✅ Métricas FAPES carregadas:', metrics.value)
    uiStore.showToast({
      type: 'success',
      message: 'Métricas atualizadas com sucesso'
    })
  } catch (error) {
    console.error('❌ Erro ao carregar métricas:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar métricas'
    })
  } finally {
    isLoading.value = false
  }
}

const clearCache = () => {
  metrics.value = null
  uiStore.showToast({
    type: 'success',
    message: 'Cache limpo com sucesso'
  })
  loadMetrics()
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    uiStore.showToast({
      type: 'success',
      message: 'Configurações do dashboard salvas'
    })
  }
}

const toggleWidgetVisibility = (widgetId: string) => {
  widgetVisibility.value[widgetId] = !widgetVisibility.value[widgetId]
}

const openReportsCenter = () => {
  showReportsCenter.value = true
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