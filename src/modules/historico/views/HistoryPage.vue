<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header with Glassmorphism -->
    <header class="glass-header sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" size="sm" @click="router.push('/')" class="gap-2 dark:text-gray-200 dark:hover:bg-slate-800">
              <ArrowLeft class="h-4 w-4" />
              Voltar
            </Button>
            <div class="border-l border-gray-300 dark:border-slate-700 pl-4">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Histórico de Conversas</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Visualize e gerencie conversas do chatbot</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <AccessibilityMenu />
            <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{ authStore.user?.name || 'admin' }}</span>
            <Button variant="outline" size="sm" @click="handleLogout" class="gap-2 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-800">
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
        <!-- Info Alert -->
        <div class="glass-card backdrop-blur-sm bg-white/60 dark:bg-slate-900/60 border border-gray-200/50 dark:border-slate-700/50 rounded-xl p-4">
          <div class="flex items-center gap-2">
            <Info class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <strong>Dica:</strong> Use a busca para filtrar sessões por email ou ID de usuário. Clique em uma sessão para visualizar a conversa completa.
            </p>
          </div>
        </div>

        <!-- Clear Selection Button -->
        <div v-if="selectedSessionId" class="flex justify-end">
          <Button variant="outline" @click="clearSelection">
            Limpar Seleção
          </Button>
        </div>

        <!-- Grid Layout com altura fixa -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <!-- Sessions List -->
          <div class="flex flex-col">
            <SessionsList
              :sessions="sessions"
              :selected-session-id="selectedSessionId || undefined"
              :is-loading="isLoadingSessions"
              @session-select="handleSessionSelect"
              @search="handleSearch"
            />
          </div>

          <!-- Chat Viewer -->
          <div class="flex flex-col">
            <ChatViewer
              :session="selectedSession"
              :is-loading="isLoadingSession"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { useConversas } from '@/common/composables/useConversas'
import Button from '@/common/components/ui/Button.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import SessionsList from '@/modules/historico/components/SessionsList.vue'
import ChatViewer from '@/modules/historico/components/ChatViewer.vue'
import { ArrowLeft, LogOut, Info } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

// Usar o composable de conversas com dados reais do Django
const {
  conversas,
  conversaAtual,
  isLoading,
  error,
  carregarConversas,
  carregarDetalhesConversa,
  limparConversaAtual,
  filtrarPorUsuario
} = useConversas()

const selectedSessionId = ref<string | null>(null)
const searchQuery = ref('')

// Computed properties para compatibilidade com o template
const sessions = computed(() => conversas.value)
const selectedSession = computed(() => conversaAtual.value)
const isLoadingSessions = computed(() => isLoading.value)
const isLoadingSession = computed(() => isLoading.value)

const loadSessions = async () => {
  try {
    console.log('🔄 Carregando conversas do Django...')
    await carregarConversas(1, true)
    
    uiStore.showToast({
      type: 'success',
      message: `${conversas.value.length} conversas carregadas do Django`,
    })
  } catch (err: any) {
    console.error('❌ Erro ao carregar conversas:', err)
    uiStore.showToast({
      type: 'error',
      message: err.message || 'Erro ao carregar conversas do Django',
    })
  }
}

const loadSessionDetail = async (sessionId: string) => {
  try {
    console.log('🔍 Carregando detalhes da conversa:', sessionId)
    await carregarDetalhesConversa(parseInt(sessionId))
    
    if (error.value) {
      throw new Error(error.value)
    }
    
    console.log('✅ Detalhes carregados com sucesso')
  } catch (err: any) {
    console.error('❌ Erro ao carregar detalhes:', err)
    uiStore.showToast({
      type: 'error',
      message: err.message || 'Erro ao carregar detalhes da conversa',
    })
  }
}

const handleSessionSelect = (sessionId: string) => {
  selectedSessionId.value = sessionId
  loadSessionDetail(sessionId)
}

const handleSearch = async (query: string) => {
  searchQuery.value = query
  
  if (!query.trim()) {
    loadSessions()
    return
  }

  try {
    console.log('🔍 Buscando por:', query)
    
    // Filtrar conversas localmente por enquanto
    // TODO: Implementar busca no backend Django se necessário
    const filtradas = filtrarPorUsuario(query)
    
    console.log('✅ Encontradas', filtradas.length, 'conversas')
    
    if (filtradas.length === 0) {
      uiStore.showToast({
        type: 'info',
        message: 'Nenhuma conversa encontrada para este usuário',
      })
    }
  } catch (err: any) {
    console.error('❌ Erro na busca:', err)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao buscar conversas',
    })
  }
}

const clearSelection = () => {
  selectedSessionId.value = null
  limparConversaAtual()
}

const handleLogout = () => {
  authStore.logout()
  uiStore.showToast({
    type: 'success',
    message: 'Logout realizado com sucesso',
  })
  router.push('/login')
}

onMounted(() => {
  console.log('📱 Iniciando página de histórico...')
  loadSessions()
})
</script>
