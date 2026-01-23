<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
    <!-- Header with Glassmorphism -->
    <header class="glass-header sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Logo :width="120" :height="48" />
            <div class="border-l border-gray-300 pl-4">
              <h1 class="text-xl font-semibold text-gray-900">Gestão de Editais</h1>
              <p class="text-xs text-gray-500">Sistema de Gerenciamento FAPES</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <AccessibilityMenu />
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
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Section -->
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sistema de Gestão de Editais
          </h2>
          <p class="text-gray-600">
            Escolha uma das opções abaixo para começar
          </p>
        </div>

        <!-- Feature Cards with Glassmorphism -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Management Card -->
          <div 
            @click="navigateTo('/management')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <FileText class="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Gestão de Editais
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Crie e gerencie editais, faça upload de documentos e configure metadados
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                Acessar
              </Button>
            </div>
          </div>

          <!-- Metrics Card -->
          <div 
            @click="navigateTo('/metrics')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <BarChart3 class="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Métricas e Análises
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Visualize estatísticas de engajamento e mensagens por edital
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-green-50 dark:group-hover:bg-green-900/30">
                Acessar
              </Button>
            </div>
          </div>

          <!-- History Card -->
          <div 
            @click="navigateTo('/history')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <MessageSquare class="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Histórico de Conversas
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Acesse o histórico completo de conversas entre usuários e chatbot
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30">
                Acessar
              </Button>
            </div>
          </div>
        </div>

        <!-- Editais Section -->
        <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Editais Disponíveis</h2>
              <p class="text-sm text-gray-600 mt-1">Visualize e gerencie todos os editais cadastrados</p>
            </div>
            <Button @click="navigateTo('/management')" class="gap-2">
              <Plus class="h-4 w-4" />
              Novo Edital
            </Button>
          </div>

          <!-- Filters and Search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Pesquisar editais..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
              />
            </div>
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
            >
              <option value="">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="closed">Fechado</option>
              <option value="analyzing">Em Análise</option>
            </select>
            <Button variant="outline" @click="clearFilters" class="gap-2">
              <X class="h-4 w-4" />
              Limpar
            </Button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingEditais" class="text-center py-16">
            <Spinner />
            <p class="mt-4 text-gray-600">Carregando editais...</p>
          </div>

          <!-- Editais List -->
          <div v-else-if="paginatedEditais.length > 0" class="space-y-4">
            <div
              v-for="edital in paginatedEditais"
              :key="edital.id"
              @click="openEditalModal(edital)"
              class="group cursor-pointer backdrop-blur-sm bg-white/80 border border-gray-200/50 rounded-lg p-5 hover:shadow-md hover:bg-white transition-all duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {{ edital.title }}
                    </h3>
                    <Badge :variant="getStatusVariant(edital.status)">
                      {{ getStatusLabel(edital.status) }}
                    </Badge>
                  </div>
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ edital.description }}</p>
                  <div class="flex items-center gap-6 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                      <FileText class="h-3.5 w-3.5" />
                      {{ edital.metadata_count }} metadados
                    </span>
                    <span class="flex items-center gap-1">
                      <Paperclip class="h-3.5 w-3.5" />
                      {{ edital.files_count }} arquivos
                    </span>
                    <span class="flex items-center gap-1">
                      <Calendar class="h-3.5 w-3.5" />
                      {{ formatDate(edital.created_at) }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" @click.stop="openEditalModal(edital)" class="gap-1.5">
                    <Eye class="h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileText class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum edital encontrado</h3>
            <p class="text-gray-600 mb-6">
              {{ searchQuery || statusFilter ? 'Tente ajustar os filtros de pesquisa' : 'Comece criando seu primeiro edital' }}
            </p>
            <Button @click="navigateTo('/management')" v-if="!searchQuery && !statusFilter" class="gap-2">
              <Plus class="h-4 w-4" />
              Criar Primeiro Edital
            </Button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredEditais.length > itemsPerPage" class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredEditais.length) }} de {{ filteredEditais.length }} editais
            </p>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="previousPage"
                :disabled="currentPage === 1"
                class="gap-1.5"
              >
                <ChevronLeft class="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="gap-1.5"
              >
                Próxima
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edital Detail Modal -->
    <div
      v-if="selectedEdital"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click="closeEditalModal"
    >
      <div
        @click.stop
        class="glass-modal backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-200/50">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ isEditMode ? 'Editar Edital' : selectedEdital.title }}
              </h2>
              <Badge v-if="!isEditMode" :variant="getStatusVariant(selectedEdital.status)">
                {{ getStatusLabel(selectedEdital.status) }}
              </Badge>
            </div>
            <p v-if="!isEditMode" class="text-sm text-gray-500">
              Criado em {{ formatDate(selectedEdital.created_at) }}
            </p>
          </div>
          <button
            @click="closeEditalModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <!-- Modal Content - Professional & Clean Design -->
        <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div class="p-6 space-y-8">
            <!-- Header Section -->
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <!-- Title Edit -->
                  <div v-if="isEditModeInline">
                    <input 
                      v-model="editForm.title"
                      type="text" 
                      class="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                    >
                  </div>
                  <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ selectedEdital.title }}</h2>
                  
                  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1.5">
                      <Calendar class="h-4 w-4" />
                      Criado em {{ formatDate(selectedEdital.created_at) }}
                    </span>
                    <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span class="font-mono text-xs">ID: {{ selectedEdital.id }}</span>
                  </div>
                </div>

                <!-- Status Edit -->
                <div v-if="isEditModeInline">
                   <select
                      v-model="editForm.status"
                      class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="open">Aberto</option>
                      <option value="closed">Fechado</option>
                      <option value="analyzing">Em Análise</option>
                      <option value="draft">Rascunho</option>
                    </select>
                </div>
                <Badge v-else :variant="getStatusVariant(selectedEdital.status)" size="lg">
                  {{ getStatusLabel(selectedEdital.status) }}
                </Badge>
              </div>

              <!-- Description Bloc -->
              <div v-if="isEditModeInline">
                   <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                   <textarea
                     v-model="editForm.description"
                     rows="6"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                   ></textarea>
              </div>
              <div v-else class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {{ selectedEdital.description }}
                </p>
              </div>
            </div>

            <!-- Files Section (Clean List, Full Width) -->
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
                <Paperclip class="h-4 w-4" />
                Arquivos do Edital
              </h3>
              
              <div v-if="selectedEdital.files && selectedEdital.files.length > 0" class="space-y-2">
                <div 
                  v-for="file in selectedEdital.files" 
                  :key="file.id"
                  class="group flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                      <FileText class="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {{ file.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ getFileTypeLabel(file.file_type) }}
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    v-if="file.url"
                    :href="file.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all shadow-sm"
                  >
                    <ExternalLink class="h-3 w-3" />
                    Visualizar
                  </a>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic py-4">
                Nenhum arquivo anexado a este edital.
              </div>
            </div>
          </div>
        </div>



    <!-- Modal Footer -->
    <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
       <!-- Delete Section -->
       <div>
          <!-- Initial Button -->
          <Button 
             v-if="!showDeleteConfirm && !isEditModeInline"
             variant="ghost" 
             @click="confirmDelete"
             class="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-900/20"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Excluir
          </Button>

          <!-- Confirmation UI -->
          <div v-else-if="showDeleteConfirm" class="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
             <span class="text-sm font-medium text-red-700 dark:text-red-400">Tem certeza?</span>
             <Button 
               variant="outline" 
               size="sm"
               @click="cancelDelete"
               class="h-8 px-3 text-xs"
             >
               Cancelar
             </Button>
             <Button 
               size="sm"
               @click="executeDelete"
               class="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white border-none"
             >
               Sim, Excluir
             </Button>
          </div>
       </div>

       <!-- Action Buttons -->
       <div class="flex gap-3">
          <Button variant="outline" @click="closeEditalModal">
            Fechar
          </Button>
          
          <Button 
            v-if="!isEditModeInline"
            @click="enterEditMode" 
            class="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all"
          >
            <Edit class="h-4 w-4" />
            Editar Edital
          </Button>
          
          <Button 
            v-else
            @click="saveEditalInline" 
            :loading="isSaving"
            class="gap-2 bg-green-600 hover:bg-green-700 text-white border-none shadow-md hover:shadow-lg transition-all"
          >
            <Save class="h-4 w-4" />
            Salvar
          </Button>
       </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import type { EditalResponse } from '@/modules/gestao-editais/types/edital.types'

import Button from '@/common/components/ui/Button.vue'
import Logo from '@/common/components/ui/Logo.vue'
import Badge from '@/common/components/ui/Badge.vue'
import Spinner from '@/common/components/ui/Spinner.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Search, 
  X, 
  Eye, 
  Edit, 
  Paperclip, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Save,
  Trash2
} from 'lucide-vue-next'

// Local Interface
interface Edital {
  id: string
  title: string
  description: string
  status: 'open' | 'closed' | 'analyzing' | 'draft'
  created_at: string
  updated_at: string
  metadata_count: number
  files_count: number
  metadata: Array<{ id: string; key: string; value: string }>
  files: Array<{ id: string; name: string; url: string; file_type: string }>
}

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const editais = ref<Edital[]>([])
const isLoadingEditais = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const selectedEdital = ref<Edital | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

// Inline Edit State
const isEditModeInline = ref(false)
const isSaving = ref(false)
const editForm = ref({
  title: '',
  description: '',
  status: 'open',
  metadata: [] as Array<{ id?: string; key: string; value: string }>
})

const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToEdit = (id: string) => {
  router.push(`/editais/${id}/editar`)
}

const loadEditais = async () => {
  isLoadingEditais.value = true
  try {
    const response = await editalService.getEditals()
    editais.value = response as any as Edital[]
  } catch (error) {
    console.error('Erro ao carregar editais:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar editais'
    })
  } finally {
    isLoadingEditais.value = false
  }
}

const filteredEditais = computed(() => {
  let result = editais.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(e => 
      e.title.toLowerCase().includes(query) || 
      e.description.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(e => e.status === statusFilter.value)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredEditais.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const paginatedEditais = computed(() => {
  return filteredEditais.value.slice(startIndex.value, endIndex.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const openEditalModal = async (edital: any) => {
  try {
    const fullEdital = await editalService.getEdital(edital.id)
    selectedEdital.value = fullEdital as any as Edital // Cast to local type
    isEditModeInline.value = false // Reset mode
  } catch (error) {
    console.error('Erro ao carregar detalhes do edital:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar detalhes do edital'
    })
  }
}

const closeEditalModal = () => {
  selectedEdital.value = null
  isEditModeInline.value = false
}

// Inline Edit Logic
const enterEditMode = () => {
  if (!selectedEdital.value) return
  
  editForm.value = {
    title: selectedEdital.value.title,
    description: selectedEdital.value.description,
    status: selectedEdital.value.status,
    metadata: selectedEdital.value.metadata ? selectedEdital.value.metadata.map(m => ({ key: m.key, value: m.value })) : []
  }
  isEditModeInline.value = true
}

const saveEditalInline = async () => {
  if (!selectedEdital.value) return
  
  isSaving.value = true
  try {
    const payload = {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status as any,
      dynamicFields: editForm.value.metadata.filter(m => m.key && m.value), // Assuming backend adapts this
      // For minimal update, we might need to send everything or just changed fields depending on API
      // Assuming create/update payload structure. 
      // Important: `dynamicFields` mapping might differ from `metadata`. 
      // Usually `dynamicFields` is what createEdital expects. 
      results: []
    }

// ...
    await editalService.updateEdital(selectedEdital.value.id, {
        ...payload,
        dynamicFields: editForm.value.metadata
            .filter(m => m.key && m.value)
            .map((m, i) => ({ ...m, id: m.id || `temp-inline-${i}` })), // Fix: Ensure ID exists
        mainPDF: null, 
        annexes: []
    })
    
// ...
    
    // Update local data
    selectedEdital.value.title = editForm.value.title
    selectedEdital.value.description = editForm.value.description
    selectedEdital.value.status = editForm.value.status as any
    // Metadata update locally might be complex if IDs change, but for display:
    // selectedEdital.value.metadata = ... (we would need response to get new IDs)
    // Simpler: reload edital details
    const refreshed = await editalService.getEdital(selectedEdital.value.id)
    selectedEdital.value = refreshed as any as Edital
    
    // Also update list item locally to reflect changes immediately
    const listIndex = editais.value.findIndex(e => e.id === selectedEdital.value?.id)
    if (listIndex !== -1) {
       editais.value[listIndex] = { ...editais.value[listIndex], ...editForm.value } as Edital
    }

    uiStore.showToast({ type: 'success', message: 'Edital atualizado com sucesso' })
    isEditModeInline.value = false

  } catch (error) {
    console.error('Erro ao salvar:', error)
  } finally {
    isSaving.value = false
  }
}

// Inline Edit State
const showDeleteConfirm = ref(false)

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const executeDelete = async () => {
  if (!selectedEdital.value) return
  
  try {
    await editalService.deleteEdital(selectedEdital.value.id)
    uiStore.showToast({ type: 'success', message: 'Edital excluído com sucesso' })
    closeEditalModal()
    await loadEditais() // Refresh list
  } catch (error) {
    console.error('Erro ao excluir:', error)
    uiStore.showToast({ type: 'error', message: 'Erro ao excluir edital' })
  }
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    open: 'success',
    closed: 'destructive',
    analyzing: 'warning',
    draft: 'default'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: 'Aberto',
    closed: 'Fechado',
    analyzing: 'Em Análise',
    draft: 'Rascunho'
  }
  return labels[status] || status
}

const getFileTypeLabel = (fileType: string) => {
  const labels: Record<string, string> = {
    main_pdf: 'PDF Principal',
    annexe: 'Anexo',
    result: 'Resultado'
  }
  return labels[fileType] || fileType
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
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
  loadEditais()
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

.glass-modal {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
