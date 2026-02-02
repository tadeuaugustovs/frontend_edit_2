<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <div class="bg-blue-600 p-2 rounded-lg">
              <FileText class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Gestão de Editais</h1>
              <p class="text-xs text-gray-500">Fundação de Amparo à Pesquisa - FAPES</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <AccessibilityMenu />
            <div class="h-8 w-px bg-gray-200 mx-1"></div>
            <div class="flex items-center gap-3">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || 'Usuário' }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.email || 'root@fapes.br' }}</p>
              </div>
              <Button variant="ghost" size="icon" @click="handleLogout" class="text-gray-500 hover:text-red-600">
                <LogOut class="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <HomeFeatureCards @navigate="router.push($event)" />

      <!-- Listing Section -->
      <section class="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Listagem de Editais</h2>
            <p class="text-sm text-gray-500">Visualize e gerencie os editais cadastrados no sistema</p>
          </div>
          <Button @click="router.push('/management')" class="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus class="h-4 w-4" />
            Novo Edital
          </Button>
        </div>

        <div class="p-6">
          <EditalFilters 
            v-model:search="searchQuery"
            v-model:status="statusFilter"
            @clear="clearFilters"
          />

          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-lg">
            <Spinner class="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p class="text-gray-500 font-medium">Carregando editais...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="paginatedEditais.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
            <div class="bg-gray-100 p-4 rounded-full mb-4">
              <FileSearch class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">Nenhum edital encontrado</h3>
            <p class="text-gray-500 text-center max-w-sm">Tente ajustar seus filtros ou cadastre um novo edital no botão acima.</p>
          </div>

          <!-- Componentized List -->
          <EditalList 
            v-else
            :items="paginatedEditais"
            @view-details="openEditalModal"
          />

          <!-- Componentized Pagination -->
          <EditalPagination 
            :currentPage="currentPage"
            :totalPages="totalPages"
            :totalItems="filteredEditais.length"
            :itemsPerPage="itemsPerPage"
            :startIndex="startIndex"
            :endIndex="endIndex"
            @next="nextPage"
            @previous="previousPage"
          />
        </div>
      </section>
    </main>

    <!-- Modal Shell -->
    <EditalDetailModal 
      :edital="selectedEdital"
      :isEditMode="isEditMode"
      :isSaving="isSaving"
      :editForm="editForm"
      :existingMainFile="existingMainFile"
      :existingAnnexes="existingAnnexes"
      @close="closeEditalModal"
      @enter-edit="enterEditMode"
      @save="saveEdital"
      @confirm-delete="showDeleteConfirm = true"
      @replace-main="handleReplaceMain"
      @add-annexes="handleInlineFileUpload"
      @remove-new-annex="removeNewAnnex"
      @remove-existing-annex="markAnnexDeleted"
    />

    <DeleteConfirmDialog 
      v-model:open="showDeleteConfirm"
      :title="selectedEdital?.title || ''"
      @confirm="executeDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, LogOut, Plus, FileSearch, Loader2 as Spinner } from 'lucide-vue-next'
import { useAuthStore } from '@/common/store/auth'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import Button from '@/common/components/ui/Button.vue'

// Modular Composables
import { useEditais } from '../composables/useEditais'
import { useEditalActions } from '../composables/useEditalActions'

// Modular Components
import HomeFeatureCards from '../components/HomeFeatureCards.vue'
import EditalFilters from '../components/EditalFilters.vue'
import EditalList from '../components/EditalList.vue'
import EditalPagination from '../components/EditalPagination.vue'
import EditalDetailModal from '../components/EditalDetailModal.vue'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

// State logic orchestration
const {
  isLoading,
  searchQuery,
  statusFilter,
  currentPage,
  itemsPerPage,
  paginatedEditais,
  filteredEditais,
  totalPages,
  startIndex,
  endIndex,
  loadEditais,
  nextPage,
  previousPage,
  clearFilters
} = useEditais()

const {
  selectedEdital,
  isEditMode,
  isSaving,
  showDeleteConfirm,
  editForm,
  existingMainFile,
  existingAnnexes,
  openEditalModal,
  closeEditalModal,
  enterEditMode,
  handleReplaceMain,
  handleInlineFileUpload,
  removeNewAnnex,
  markAnnexDeleted,
  saveEdital,
  executeDelete
} = useEditalActions(loadEditais)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadEditais()
})
</script>

<style scoped>
/* Scoped styles reduced to minimum as Tailwind and components handle most things now */
.glass-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
