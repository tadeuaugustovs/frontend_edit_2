<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
    <!-- Header with Glassmorphism -->
    <header class="glass-header sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="router.push('/')" class="gap-2">
              <ArrowLeft class="h-4 w-4" />
              Voltar
            </Button>
            <div class="border-l border-gray-300 pl-4">
              <h1 class="text-xl font-semibold text-gray-900">Métricas e Análises</h1>
              <p class="text-xs text-gray-500">Visualize estatísticas de engajamento</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <Button variant="outline" size="sm" @click="loadMetrics" class="gap-2">
              <RefreshCw class="h-4 w-4" />
              Atualizar
            </Button>
            <span class="text-sm text-gray-600 font-medium">{{ authStore.user?.name }}</span>
            <Button variant="outline" size="sm" @click="handleLogout" class="gap-2">
              <LogOut class="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <Spinner />
          <p class="mt-4 text-gray-600">Carregando métricas...</p>
        </div>

        <!-- Metrics Content -->
        <div v-else>
          <!-- Summary Cards with Glassmorphism -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Total de Mensagens</p>
                  <p class="text-3xl font-bold text-blue-600">
                    {{ metrics?.total_messages || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-blue-500/10 rounded-lg">
                  <MessageCircle class="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
                  <p class="text-3xl font-bold text-green-600">
                    {{ metrics?.total_users || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-green-500/10 rounded-lg">
                  <Users class="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600 mb-1">Total de Editais</p>
                  <p class="text-3xl font-bold text-purple-600">
                    {{ metrics?.total_editals || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-purple-500/10 rounded-lg">
                  <FileText class="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Messages by Edital -->
            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Mensagens por Edital</h3>
                <div class="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 class="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <EngagementChart
                title="Mensagens por Edital"
                :labels="editalLabels"
                :data="messageData"
                type="bar"
              />
            </div>

            <!-- Users by Edital -->
            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Usuários por Edital</h3>
                <div class="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp class="h-5 w-5 text-green-600" />
                </div>
              </div>
              <EngagementChart
                title="Usuários por Edital"
                :labels="editalLabels"
                :data="userData"
                type="line"
              />
            </div>

            <!-- Distribution Pie Chart -->
            <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Distribuição de Mensagens</h3>
                <div class="p-2 bg-purple-500/10 rounded-lg">
                  <PieChart class="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <EngagementChart
                title="Distribuição de Mensagens"
                :labels="editalLabels"
                :data="messageData"
                type="pie"
              />
            </div>
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
import Button from '@/common/components/ui/Button.vue'
import Spinner from '@/common/components/ui/Spinner.vue'
import EngagementChart from '@/modules/metricas/components/EngagementChart.vue'
import { 
  ArrowLeft, 
  RefreshCw, 
  LogOut, 
  MessageCircle, 
  Users, 
  FileText,
  BarChart3,
  TrendingUp,
  PieChart
} from 'lucide-vue-next'

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

<style scoped>
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.glass-card {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
