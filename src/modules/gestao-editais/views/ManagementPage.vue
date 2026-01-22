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
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Título *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="Ex: Edital FAPES 001/2025"
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
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Documentos</h2>
            </div>

            <div
              @drop.prevent="handleDrop"
              @dragover.prevent
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
              :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-all',
                isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-slate-600'
              ]"
            >
              <input ref="fileInput" type="file" accept=".pdf" multiple @change="handleFileSelect" class="hidden" />
              <Upload class="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
              <p class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">Arraste arquivos PDF aqui</p>
              <p class="text-sm text-gray-500 dark:text-slate-400 mb-4">ou clique no botão abaixo</p>
              <Button @click="triggerFileInput" class="gap-2">
                <FileText class="h-4 w-4" />
                Selecionar Arquivos
              </Button>
            </div>

            <div v-if="uploadedFiles.length > 0" class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Arquivos ({{ uploadedFiles.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <FileText class="h-5 w-5 text-red-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ file.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-slate-400">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <button @click="removeFile(index)" class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 class="h-4 w-4 text-red-600" />
                  </button>
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Documentos</h3>
                <div v-if="uploadedFiles.length === 0" class="text-sm text-gray-500 dark:text-slate-400">
                  Nenhum documento
                </div>
                <div v-else class="space-y-2">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg">
                    <FileText class="h-5 w-5 text-red-600" />
                    <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ file.name }}</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import Button from '@/common/components/ui/Button.vue'
import StepIndicator from '@/modules/gestao-editais/components/StepIndicator.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import { ArrowLeft, ArrowRight, FileText, Upload, Trash2, Plus, Send, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const steps = [
  { title: 'Dados Básicos', subtitle: 'Informações do edital' },
  { title: 'Documentos', subtitle: 'Upload de arquivos' },
  { title: 'Revisão', subtitle: 'Confirmar dados' },
]

const currentStep = ref(0)
const isDragging = ref(false)
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const formData = ref({
  title: '',
  description: '',
  status: 'open',
  dynamicFields: [] as Array<{ key: string; value: string }>,
})

const uploadedFiles = ref<File[]>([])
const errors = ref({ title: '', description: '' })

const nextStep = () => {
  if (validateCurrentStep()) currentStep.value++
}

const previousStep = () => {
  currentStep.value--
}

const validateCurrentStep = () => {
  errors.value = { title: '', description: '' }
  if (currentStep.value === 0) {
    if (!formData.value.title.trim()) {
      errors.value.title = 'Título é obrigatório'
      return false
    }
    if (!formData.value.description.trim()) {
      errors.value.description = 'Descrição é obrigatória'
      return false
    }
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
  const pdfFiles = files.filter(file => file.type === 'application/pdf')
  uploadedFiles.value.push(...pdfFiles)
  if (pdfFiles.length > 0) {
    uiStore.showToast({ type: 'success', message: `${pdfFiles.length} arquivo(s) adicionado(s)` })
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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

    const annexesObjects = uploadedFiles.value.slice(1).map((file, index) => ({
      id: `temp-annexe-${index}`,
      name: file.name,
      displayName: file.name,
      file: file
    }))

    await editalService.createEdital({
      title: formData.value.title,
      description: formData.value.description,
      status: formData.value.status as 'open' | 'closed' | 'analyzing', // Ensure type safety
      dynamicFields: formData.value.dynamicFields.filter(f => f.key && f.value).map((f, i) => ({ ...f, id: `temp-field-${i}` })), // Add required ID
      mainPDF: mainPDFObject,
      annexes: annexesObjects,
      results: [],
    })
    
    uiStore.showToast({ type: 'success', message: 'Edital enviado com sucesso!' })
    router.push('/')
  } catch (error) {
    console.error('Erro ao criar edital:', error)
    uiStore.showToast({ type: 'error', message: 'Erro ao criar edital' })
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
