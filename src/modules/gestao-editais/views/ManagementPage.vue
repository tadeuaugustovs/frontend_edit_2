<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <header class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="ghost" size="sm" @click="handleCancel" class="gap-2">
              <ArrowLeft class="h-4 w-4" />
              Voltar
            </Button>
            <div class="border-l border-gray-300 dark:border-slate-700 pl-4">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-slate-100">Criar Novo Edital</h1>
              <p class="text-xs text-gray-500 dark:text-slate-400">Preencha as informações em 3 etapas</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <AccessibilityMenu />
            <span class="text-sm text-gray-600 dark:text-slate-400 font-medium">{{ authStore.user?.name }}</span>
            <Button variant="outline" size="sm" @click="handleLogout" class="gap-2">
              <LogOut class="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-6 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <StepIndicator
            v-for="(step, index) in steps"
            :key="index"
            :number="index + 1"
            :title="step.title"
            :subtitle="step.subtitle"
            :isActive="currentStep === index"
            :isCompleted="currentStep > index"
            :isLast="index === steps.length - 1"
          />
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          <div v-if="currentStep === 0">
            <div class="flex items-center gap-2 mb-6">
              <FileText class="h-5 w-5 text-blue-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Informações Básicas</h2>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">ID do Edital *</label>
                <input
                  v-model="formData.numero"
                  type="text"
                  placeholder="Ex: 01/2025"
                  :disabled="isEditing"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  :class="{ 'border-red-500': errors.numero }"
                />
                <p class="text-xs text-gray-500 mt-1">Formato: XX/XXXX (Ex: 01/2026)</p>
                <p v-if="errors.numero" class="mt-1 text-sm text-red-600">{{ errors.numero }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Título *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="Ex: Edital FAPES de Inovação"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Descrição *</label>
                <textarea
                  v-model="formData.description"
                  rows="6"
                  placeholder="Descreva o objetivo do edital..."
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  :class="{ 'border-red-500': errors.description }"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Tags</label>
                <input
                  v-model="formData.tags"
                  type="text"
                  placeholder="Ex: inovação, tecnologia, pesquisa (separadas por vírgula)"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Status *</label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="open">Aberto</option>
                  <option value="closed">Fechado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">Campos Dinâmicos</label>
                  <Button variant="outline" size="sm" @click="addDynamicField" class="gap-2">
                    <Plus class="h-4 w-4" />
                    Adicionar Campo
                  </Button>
                </div>
                <div v-if="formData.dynamicFields.length === 0" class="text-center py-8 text-gray-500 dark:text-slate-400 text-sm">
                  Nenhum campo adicional.
                </div>
                <div v-else class="space-y-3">
                  <div v-for="(field, index) in formData.dynamicFields" :key="index" class="flex gap-3">
                    <input
                      v-model="field.key"
                      type="text"
                      placeholder="Nome do campo"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      v-model="field.value"
                      type="text"
                      placeholder="Valor"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button @click="removeDynamicField(index)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 1">
            <div class="flex items-center gap-2 mb-6">
              <Upload class="h-5 w-5 text-blue-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Documento Principal</h2>
            </div>

            <!-- State A: Upload Zone (No File) -->
              <div
              v-if="uploadedFiles.length === 0 && !existingFileUrl"
              @drop.prevent="handleDrop"
              @dragover.prevent
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
              :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-all h-96 flex flex-col items-center justify-center',
                isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-slate-600'
              ]"
            >
              <input ref="fileInput" type="file" accept=".pdf" @change="handleFileSelect" class="hidden" />
              <Upload class="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
              <p class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">Arraste seu arquivo PDF aqui</p>
              <p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Apenas arquivos PDF são permitidos</p>
              <Button @click="triggerFileInput" class="gap-2">
                <FileText class="h-4 w-4" />
                Selecionar Arquivo
              </Button>
            </div>

            <!-- State B: Preview Mode (File Selected) -->
            <div v-else class="space-y-4">
              <div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                <div class="flex items-center gap-3">
                  <FileText class="h-5 w-5 text-blue-600" />
                  <div>
                     <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ uploadedFiles.length > 0 ? uploadedFiles[0].name : existingFileName }}</p>
                     <p class="text-xs text-gray-500 dark:text-slate-400">{{ uploadedFiles.length > 0 ? formatFileSize(uploadedFiles[0].size) : 'Arquivo existente' }}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" @click="clearFile" class="gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                  <Trash2 class="h-4 w-4" />
                  Trocar Arquivo
                </Button>
              </div>

              <div class="relative w-full h-96 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
                 <iframe 
                   v-if="previewUrl"
                   :src="previewUrl" 
                   class="w-full h-full"
                   type="application/pdf"
                 ></iframe>
                 <div v-else class="flex items-center justify-center h-full text-gray-500">
                   Carregando preview...
                 </div>
              </div>
            </div>

            <!-- Attachments Section -->
            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-2">
                  <Paperclip class="h-5 w-5 text-blue-600" />
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Anexos</h2>
                </div>
                <Button variant="outline" size="sm" @click="addNewAttachmentItem" class="gap-2">
                  <Plus class="h-4 w-4" />
                  Adicionar Anexo
                </Button>
              </div>

              <!-- Empty State -->
              <div v-if="attachmentItems.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl">
                 <p class="text-gray-500 dark:text-slate-400">Nenhum anexo adicionado. Clique no botão acima para incluir arquivos.</p>
              </div>
              
              <!-- Attachment Items List -->
              <div v-else class="space-y-4">
                <div v-for="(item, index) in attachmentItems" :key="index" class="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm transition-all hover:border-blue-300 dark:hover:border-blue-700">
                  <div class="flex items-start gap-4">
                    <div class="flex-1 space-y-3">
                       <!-- Display Name Input -->
                       <div>
                         <label class="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Nome de Exibição do Anexo</label>
                         <input 
                           v-model="item.displayName" 
                           type="text" 
                           placeholder="Ex: Anexo I - Cronograma" 
                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                         />
                       </div>

                       <!-- File Selection -->
                       <div v-if="!item.file && !item.serverUrl" class="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors" @click="triggerItemFileInput(index)">
                         <div class="space-y-1 text-center">
                           <Upload class="mx-auto h-8 w-8 text-gray-400" />
                           <div class="flex text-sm text-gray-600 dark:text-slate-400">
                             <span class="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                               <span>Clique para selecionar o arquivo</span>
                               <input :ref="(el) => setAttachmentInputRef(el, index)" type="file" class="sr-only" @change="(e) => handleItemFileSelect(e, index)" />
                             </span>
                           </div>
                           <p class="text-xs text-gray-500 dark:text-slate-500">PDF, DOCX, ou Imagem</p>
                         </div>
                       </div>

                       <!-- File Preview (Selected) -->
                       <div v-else class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <div class="flex items-center gap-3">
                            <div class="p-2 bg-white dark:bg-blue-900 rounded-lg shadow-sm">
                              <FileText class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                               <p class="text-sm font-medium text-blue-900 dark:text-blue-100 truncate max-w-[200px]">{{ item.file ? item.file.name : item.displayName }}</p>
                               <p class="text-xs text-blue-600 dark:text-blue-300">{{ item.file ? formatFileSize(item.file.size) : 'Arquivo existente' }}</p>
                            </div>
                          </div>
                          <button @click="clearAttachmentFile(index)" class="text-xs text-red-600 hover:text-red-800 underline">Trocar</button>
                       </div>
                    </div>

                    <!-- Remove Item Button -->
                    <button @click="removeAttachmentItem(index)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Remover anexo">
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 2">
            <div class="flex items-center gap-2 mb-6">
              <CheckCircle class="h-5 w-5 text-green-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Revisão</h2>
            </div>

            <div class="space-y-6">
              <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Dados Básicos</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-600 dark:text-slate-400">Título</dt>
                    <dd class="text-base text-gray-900 dark:text-slate-100">{{ formData.title }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-600 dark:text-slate-400">Descrição</dt>
                    <dd class="text-base text-gray-900 dark:text-slate-100">{{ formData.description }}</dd>
                  </div>
                </dl>
              </div>

              <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Documento Principal</h3>
                <div v-if="uploadedFiles.length === 0" class="text-sm text-gray-500 dark:text-slate-400">
                  Nenhum documento principal
                </div>
                <div v-else class="space-y-2">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg">
                    <FileText class="h-5 w-5 text-red-600" />
                    <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ file.name }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Anexos</h3>
                <div v-if="attachmentItems.length === 0" class="text-sm text-gray-500 dark:text-slate-400">
                  Nenhum anexo
                </div>
                <div v-else class="space-y-2">
                  <div v-for="(item, index) in attachmentItems" :key="index" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg">
                    <Paperclip class="h-5 w-5 text-blue-600" />
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ item.displayName || 'Sem nome' }}</p>
                        <p v-if="item.file" class="text-xs text-gray-500">{{ item.file.name }}</p>
                        <p v-else-if="item.serverUrl" class="text-xs text-blue-600 dark:text-blue-400">Arquivo carregado</p>
                        <p v-else class="text-xs text-red-500">Arquivo pendente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button v-if="currentStep > 0" variant="outline" @click="previousStep" class="gap-2">
              <ArrowLeft class="h-4 w-4" />
              Anterior
            </Button>
            <div v-else></div>

            <div class="flex gap-3">
              <Button variant="outline" @click="handleCancel">Cancelar</Button>
              <Button v-if="currentStep < steps.length - 1" @click="nextStep" class="gap-2">
                Próximo
                <ArrowRight class="h-4 w-4" />
              </Button>
              <Button v-else @click="submitEdital" :loading="isSubmitting" :disabled="isSubmitting" class="gap-2">
                <Send class="h-4 w-4" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import Button from '@/common/components/ui/Button.vue'
import StepIndicator from '@/modules/gestao-editais/components/StepIndicator.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import { ArrowLeft, ArrowRight, FileText, Upload, Trash2, Plus, Send, LogOut, Paperclip, X, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const steps = [
  { title: 'Dados Básicos', subtitle: 'Informações do edital' },
  { title: 'Documentos', subtitle: 'Upload de arquivos' },
  { title: 'Revisão', subtitle: 'Confirmar dados' },
]

const currentStep = ref(0)
const isDragging = ref(false)
const isDraggingAttachments = ref(false)
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const attachmentInput = ref<HTMLInputElement | null>(null)

// Identificar se é edição
const isEditing = computed(() => !!route.params.id)
const editingId = computed(() => route.params.id as string)

const formData = ref({
  numero: '',
  title: '',
  description: '',
  tags: '',
  status: 'open',
  dynamicFields: [] as Array<{ key: string; value: string }>,
})

const uploadedFiles = ref<File[]>([]) // Main document
// Refatorado para usar objetos
interface AttachmentItem {
  id: string
  file: File | null
  displayName: string
  serverUrl?: string
}
const attachmentItems = ref<AttachmentItem[]>([]) 
const previewUrl = ref<string | null>(null)
const existingFileUrl = ref<string | null>(null)
const existingFileName = ref<string>('')
const errors = ref({ numero: '', title: '', description: '' })
const itemInputRefs = ref<Record<number, HTMLInputElement>>({})

const setAttachmentInputRef = (el: any, index: number) => {
  if (el) itemInputRefs.value[index] = el
}

onMounted(async () => {
  if (isEditing.value) {
    await loadEditalData(editingId.value)
  }
})

const loadEditalData = async (id: string) => {
  try {
    // uiStore.isLoading = true
    const edital = await editalService.getEdital(id)
    
    // Preencher formulário
    formData.value.numero = edital.numero
    formData.value.title = edital.nome
    
    // Tratamento seguro para metadados e descrição
    const meta = edital.metadata || {}
    formData.value.description = meta.descricao || ''
    
    // Tags
    formData.value.tags = Array.isArray(edital.tags) ? edital.tags.join(', ') : ''
    
    formData.value.status = edital.status ? edital.status.toLowerCase() : 'open'
    
    // Campos dinâmicos (tudo que não é descricao no metadata)
    const dynamicKeys = Object.keys(meta).filter(k => k !== 'descricao')
    formData.value.dynamicFields = dynamicKeys.map(key => ({
      key,
      value: String(meta[key])
    }))

    // Arquivo principal
    if (edital.arquivo) {
       const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'
       let fileUrl = edital.arquivo
       if (fileUrl.startsWith('/') && !fileUrl.startsWith('http')) {
           fileUrl = `${baseUrl}${fileUrl}`
       }
       
       existingFileUrl.value = fileUrl
       previewUrl.value = fileUrl
       // Tenta extrair nome do arquivo
       existingFileName.value = edital.arquivo.split('/').pop() || 'Arquivo Principal'
    }

    // Anexos
    if (edital.arquivos && Array.isArray(edital.arquivos)) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'
        attachmentItems.value = edital.arquivos.map((anexo: any) => {
             let fileUrl = anexo.arquivo
             if (fileUrl && fileUrl.startsWith('/') && !fileUrl.startsWith('http')) {
                 fileUrl = `${baseUrl}${fileUrl}`
             }
             return {
                id: `server-${anexo.id}`,
                file: null,
                displayName: anexo.nome || (anexo.arquivo ? anexo.arquivo.split('/').pop() : 'Anexo'),
                serverUrl: fileUrl
             }
        })
    }
    
  } catch (error) {
    console.error('Erro ao carregar edital:', error)
    uiStore.showToast({ type: 'error', message: 'Erro ao carregar dados do edital' })
    router.push('/')
  } finally {
    // uiStore.isLoading = false
  }
}

const nextStep = () => {
  if (validateCurrentStep()) currentStep.value++
}

const previousStep = () => {
  currentStep.value--
}

const validateCurrentStep = () => {
  errors.value = { numero: '', title: '', description: '' }
  if (currentStep.value === 0) {
    let isValid = true
    
    // Validação ID do Edital (XX/XXXX)
    if (!formData.value.numero.trim()) {
      errors.value.numero = 'ID do Edital é obrigatório'
      isValid = false
    } else if (!/^[A-Za-z0-9]{2}\/[A-Za-z0-9]{4}$/.test(formData.value.numero.trim())) {
     // Regex permite 2 alfanuméricos / 4 alfanuméricos. Ajuste conforme necessidade estrita.
     // Se precisar ser estritamente números: /^\d{2}\/\d{4}$/
      errors.value.numero = 'Formato inválido. Use XX/XXXX'
      isValid = false
    }

    if (!formData.value.title.trim()) {
      errors.value.title = 'Título é obrigatório'
      isValid = false
    }
    if (!formData.value.description.trim()) {
      errors.value.description = 'Descrição é obrigatória'
      isValid = false
    }
    
    return isValid
  }
  return true
}

const addDynamicField = () => {
  formData.value.dynamicFields.push({ key: '', value: '' })
}

const removeDynamicField = (index: number) => {
  formData.value.dynamicFields.splice(index, 1)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) addFiles(Array.from(target.files))
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) addFiles(Array.from(event.dataTransfer.files))
}

const addFiles = (files: File[]) => {
  const pdfFile = files.find(file => file.type === 'application/pdf')
  
  if (pdfFile) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    
    uploadedFiles.value = [pdfFile]
    previewUrl.value = URL.createObjectURL(pdfFile)
    
    uiStore.showToast({ type: 'success', message: 'PDF carregado com sucesso' })
  } else {
    uiStore.showToast({ type: 'warning', message: 'Por favor, selecione apenas arquivos PDF' })
  }
}

const clearFile = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  uploadedFiles.value = []
  existingFileUrl.value = null
  existingFileName.value = ''
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Novos handlers para Anexos
const addNewAttachmentItem = () => {
  attachmentItems.value.push({
    id: `new-${Date.now()}`,
    file: null,
    displayName: ''
  })
}

const triggerItemFileInput = (index: number) => {
  const input = itemInputRefs.value[index]
  if (input) input.click()
}

const handleItemFileSelect = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    attachmentItems.value[index].file = file
    // Se o display name estiver vazio, preencher com o nome do arquivo (sem extensão)
    if (!attachmentItems.value[index].displayName) {
       const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
       attachmentItems.value[index].displayName = nameWithoutExt
    }
  }
}

const removeAttachmentItem = (index: number) => {
  attachmentItems.value.splice(index, 1)
  delete itemInputRefs.value[index]
}

const clearAttachmentFile = (index: number) => {
    attachmentItems.value[index].file = null
    attachmentItems.value[index].serverUrl = undefined
}


const submitEdital = async () => {
  isSubmitting.value = true
  try {
    // Construct UploadedFile objects from raw Files
    const mainFile = uploadedFiles.value[0]
    const mainPDFObject = mainFile ? {
      id: 'temp-main',
      name: mainFile.name,
      displayName: mainFile.name,
      file: mainFile
    } : null

    // Mapeia os attachmentItems para o formato que o service espera
    const annexesObjects = attachmentItems.value
      .filter(item => item.file !== null)
      .map((item, index) => ({
        id: `temp-annexe-${index}`,
        name: item.file!.name,
        displayName: item.displayName || item.file!.name, // Usa o display name ou fallback pro nome do arquivo
        file: item.file!
      }))

    const payload = {
      numero: formData.value.numero, // Backend UNIQUE
      title: formData.value.title,
      description: formData.value.description,
      tags: formData.value.tags,
      status: formData.value.status as 'open' | 'closed' | 'analyzing',
      dynamicFields: formData.value.dynamicFields.filter(f => f.key && f.value).map((f, i) => ({ ...f, id: `temp-field-${i}` })), 
      mainPDF: mainPDFObject,
      annexes: annexesObjects,
      results: [],
    }

    if (isEditing.value) {
      // Se é edição, chamamos update
      await editalService.updateEdital(editingId.value, payload)
      uiStore.showToast({ type: 'success', message: 'Edital atualizado com sucesso!' })
    } else {
      // Criação normal
      await editalService.createEdital(payload)
      uiStore.showToast({ type: 'success', message: 'Edital criado com sucesso!' })
    }
    
    router.push('/')
  } catch (err: any) {
    console.error('Erro ao salvar edital:', err)
    let errorDetail = ''
    if (err.response?.data) {
        console.log('🔴 DETALHES DO ERRO API:', JSON.stringify(err.response.data, null, 2)) // LOG IMPORTANTE
        if (err.response.data.numero) {
           errors.value.numero = 'Este ID de Edital já existe.'
           errorDetail = 'ID do Edital já existe'
           currentStep.value = 0
        } else if (typeof err.response.data === 'object') {
           errorDetail = JSON.stringify(err.response.data)
        }
    }
    uiStore.showToast({ type: 'error', message: `Erro ao salvar edital: ${errorDetail}` })
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/')
}

const handleLogout = () => {
  authStore.logout()
  uiStore.showToast({
    type: 'success',
    message: 'Logout realizado com sucesso',
  })
  router.push('/login')
}
</script>
