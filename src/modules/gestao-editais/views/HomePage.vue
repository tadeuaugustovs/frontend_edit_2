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
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" @click.stop="editEdital(edital.id)" class="gap-1.5">
                    <Edit class="h-4 w-4" />
                    Editar
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

        <!-- Modal Content - Simplificado sem Preview -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- View Mode - Ficha Técnica -->
            <div v-if="!isEditMode">
              <!-- Título e Status -->
              <div class="mb-6">
                <div class="flex items-center gap-3 mb-2">
                  <h2 class="text-2xl font-bold text-gray-900">{{ selectedEdital.title }}</h2>
                  <Badge :variant="getStatusVariant(selectedEdital.status)">
                    {{ getStatusLabel(selectedEdital.status) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-500">
                  Criado em {{ formatDate(selectedEdital.created_at) }}
                </p>
              </div>

              <!-- Descrição Completa -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Descrição</h3>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ selectedEdital.description }}</p>
                </div>
              </div>

              <!-- Estatísticas Rápidas -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <FileText class="h-5 w-5 text-blue-600" />
                    <span class="text-sm font-medium text-blue-900">Metadados</span>
                  </div>
                  <p class="text-2xl font-bold text-blue-600">{{ selectedEdital.metadata_count || 0 }}</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <Paperclip class="h-5 w-5 text-green-600" />
                    <span class="text-sm font-medium text-green-900">Arquivos</span>
                  </div>
                  <p class="text-2xl font-bold text-green-600">{{ selectedEdital.files_count || 0 }}</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 text-center">
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <Calendar class="h-5 w-5 text-purple-600" />
                    <span class="text-sm font-medium text-purple-900">Status</span>
                  </div>
                  <p class="text-sm font-semibold text-purple-600">{{ getStatusLabel(selectedEdital.status) }}</p>
                </div>
              </div>

              <!-- Metadados Detalhados -->
              <div v-if="selectedEdital.metadata && selectedEdital.metadata.length > 0" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Metadados do Edital</h3>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div class="space-y-3">
                    <div
                      v-for="meta in selectedEdital.metadata"
                      :key="meta.id"
                      class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ meta.key }}</span>
                      <span class="text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">{{ meta.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informações Técnicas -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Informações Técnicas</h3>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">ID do Edital</span>
                      <span class="font-mono text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs">{{ selectedEdital.id }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Data de Criação</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(selectedEdital.created_at) }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Última Atualização</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(selectedEdital.updated_at) }}</span>
                    </div>
                    <div class="flex justify-between py-2">
                      <span class="text-gray-600 dark:text-gray-400">Total de Arquivos</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedEdital.files_count || 0 }} arquivo(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista de Arquivos (sem preview) -->
              <div v-if="selectedEdital.files && selectedEdital.files.length > 0" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Paperclip class="h-4 w-4" />
                  Arquivos Anexados ({{ selectedEdital.files.length }})
                </h3>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div class="space-y-2">
                    <div
                      v-for="file in selectedEdital.files"
                      :key="file.id"
                      class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                    >
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-100 rounded">
                          <FileText class="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ file.name }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ getFileTypeLabel(file.file_type) }}</p>
                        </div>
                      </div>
                      <a
                        v-if="file.url"
                        :href="file.url"
                        target="_blank"
                        class="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink class="h-3 w-3" />
                        Abrir
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <div v-else class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Título do edital"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  v-model="editForm.description"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Descrição do edital"
                ></textarea>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  v-model="editForm.status"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="open">Aberto</option>
                  <option value="closed">Fechado</option>
                  <option value="analyzing">Em Análise</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>

              <!-- Metadata Fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Metadados</label>
                <div class="space-y-2">
                  <div
                    v-for="(meta, index) in editForm.metadata"
                    :key="index"
                    class="flex gap-2"
                  >
                    <input
                      v-model="meta.key"
                      type="text"
                      placeholder="Chave"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      v-model="meta.value"
                      type="text"
                      placeholder="Valor"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      @click="removeMetadata(index)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    @click="addMetadata"
                    class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    + Adicionar Metadado
                  </button>
                </div>
              </div>

              <!-- Save Status -->
              <div v-if="isSaving" class="flex items-center gap-2 text-sm text-blue-600">
                <Spinner class="h-4 w-4" />
                Salvando alterações...
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between gap-3 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <Button
              v-if="isEditMode"
              variant="outline"
              @click="confirmDelete"
              class="gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 class="h-4 w-4" />
              Deletar Edital
            </Button>
          </div>
          <div class="flex gap-3">
            <Button variant="outline" @click="cancelEdit">
              {{ isEditMode ? 'Cancelar' : 'Fechar' }}
            </Button>
            <Button v-if="!isEditMode" @click="enterEditMode" class="gap-2">
              <Edit class="h-4 w-4" />
              Editar Edital
            </Button>
            <Button v-else @click="saveEdital" :disabled="isSaving" class="gap-2">
              <Save class="h-4 w-4" />
              Salvar Alterações
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
  Save,
  Trash2,
  ExternalLink
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const editais = ref([])
const isLoadingEditais = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const selectedEdital = ref(null)
const currentPage = ref(1)
const itemsPerPage = 5
const isEditMode = ref(false)
const isSaving = ref(false)
const editForm = ref({
  title: '',
  description: '',
  status: '',
  metadata: []
})

const navigateTo = (path: string) => {
  router.push(path)
}

const loadEditais = async () => {
  isLoadingEditais.value = true
  try {
    editais.value = await editalService.getEditals()
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
  let filtered = editais.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(edital =>
      edital.title.toLowerCase().includes(query) ||
      edital.description.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(edital => edital.status === statusFilter.value)
  }

  return filtered
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

const mainPdfUrl = computed(() => {
  if (!selectedEdital.value?.files) return null
  const mainPdf = selectedEdital.value.files.find(f => f.file_type === 'main_pdf')
  return mainPdf?.url || null
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
    // Fetch full edital details including files and metadata
    const fullEdital = await editalService.getEdital(edital.id)
    selectedEdital.value = fullEdital
    isEditMode.value = false
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
  isEditMode.value = false
  editForm.value = {
    title: '',
    description: '',
    status: '',
    metadata: []
  }
}

const enterEditMode = () => {
  isEditMode.value = true
  editForm.value = {
    title: selectedEdital.value.title,
    description: selectedEdital.value.description,
    status: selectedEdital.value.status,
    metadata: selectedEdital.value.metadata?.map(m => ({ key: m.key, value: m.value })) || []
  }
}

const cancelEdit = () => {
  if (isEditMode.value) {
    isEditMode.value = false
    editForm.value = {
      title: '',
      description: '',
      status: '',
      metadata: []
    }
  } else {
    closeEditalModal()
  }
}

const addMetadata = () => {
  editForm.value.metadata.push({ key: '', value: '' })
}

const removeMetadata = (index: number) => {
  editForm.value.metadata.splice(index, 1)
}

const saveEdital = async () => {
  isSaving.value = true
  try {
    const formData = {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status,
      dynamicFields: editForm.value.metadata.filter(m => m.key && m.value),
      mainPDF: null,
      annexes: [],
      results: []
    }

    await editalService.updateEdital(selectedEdital.value.id, formData)
    
    uiStore.showToast({
      type: 'success',
      message: 'Edital atualizado com sucesso'
    })

    // Reload editais and close modal
    await loadEditais()
    closeEditalModal()
  } catch (error) {
    console.error('Erro ao salvar edital:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao salvar edital'
    })
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = () => {
  if (confirm(`Tem certeza que deseja deletar o edital "${selectedEdital.value.title}"? Esta ação não pode ser desfeita.`)) {
    deleteEdital()
  }
}

const deleteEdital = async () => {
  try {
    await editalService.deleteEdital(selectedEdital.value.id)
    
    uiStore.showToast({
      type: 'success',
      message: 'Edital deletado com sucesso'
    })

    // Reload editais and close modal
    await loadEditais()
    closeEditalModal()
  } catch (error) {
    console.error('Erro ao deletar edital:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao deletar edital'
    })
  }
}

const getStatusVariant = (status: string) => {
  const variants = {
    open: 'success',
    closed: 'destructive',
    analyzing: 'warning',
    draft: 'default'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels = {
    open: 'Aberto',
    closed: 'Fechado',
    analyzing: 'Em Análise',
    draft: 'Rascunho'
  }
  return labels[status] || status
}

const getFileTypeLabel = (fileType: string) => {
  const labels = {
    main_pdf: 'PDF Principal',
    annexe: 'Anexo',
    result: 'Resultado'
  }
  return labels[fileType] || fileType
}

const formatDate = (dateString: string) => {
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
