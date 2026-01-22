<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
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
        </div>
      </div>
    </header>

    <!-- Stepper -->
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

        <!-- Step Content -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          <!-- Step 1: Dados Básicos -->
          <div v-if="currentStep === 0">
            <div class="flex items-center gap-2 mb-6">
              <FileText class="h-5 w-5 text-blue-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Informações Básicas</h2>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Título *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  placeholder="Ex: Edital FAPES 001/2025 - Pesquisa em IA"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  v-model="formData.description"
                  rows="6"
                  placeholder="Descreva o objetivo e escopo do edital..."
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                  :class="{ 'border-red-500': errors.description }"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Status *
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                >
                  <option value="open">Aberto</option>
                  <option value="closed">Fechado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Campos Dinâmicos
                  </label>
                  <Button variant="outline" size="sm" @click="addDynamicField" class="gap-2">
                    <Plus class="h-4 w-4" />
                    Adicionar Campo
                  </Button>
                </div>
                <div v-if="formData.dynamicFields.length === 0" class="text-center py-8 text-gray-500 dark:text-slate-400 text-sm">
                  Nenhum campo adicional. Clique em "Adicionar Campo" para começar.
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="(field, index) in formData.dynamicFields"
                    :key="index"
                    class="flex gap-3"
                  >
                    <input
                      v-model="field.key"
                      type="text"
                      placeholder="Nome do campo"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                    <input
                      v-model="field.value"
                      type="text"
                      placeholder="Valor"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                    />
                    <button
                      @click="removeDynamicField(index)"
                      class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Documentos -->
          <div v-if="currentStep === 1">
            <div class="flex items-center gap-2 mb-6">
              <Upload class="h-5 w-5 text-blue-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Documentos</h2>
            </div>

            <!-- Upload Area -->
            <div
              @drop.prevent="handleDrop"
              @dragover.prevent
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
              :class="[
                'border-2 border-dashed rounded-xl p-8 text-center transition-all',
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
              ]"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf"
                multiple
                @change="handleFileSelect"
                class="hidden"
              />
              <Upload class="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
              <p class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                Arraste arquivos PDF aqui
              </p>
              <p class="text-sm text-gray-500 dark:text-slate-400 mb-4">
                ou clique no botão abaixo para selecionar
              </p>
              <Button @click="$refs.fileInput.click()" class="gap-2">
                <FileText class="h-4 w-4" />
                Selecionar Arquivos
              </Button>
            </div>

            <!-- Uploaded Files List -->
            <div v-if="uploadedFiles.length > 0" class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Arquivos Carregados ({{ uploadedFiles.length }})
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  @click="previewFile(file)"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded">
                      <FileText class="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ file.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-slate-400">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click.stop="previewFile(file)"
                      class="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Eye class="h-4 w-4 text-gray-600 dark:text-slate-400" />
                    </button>
                    <button
                      @click.stop="removeFile(index)"
                      class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 class="h-4 w-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- PDF Preview -->
            <div v-if="previewUrl" class="mt-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                  <Eye class="h-4 w-4 text-blue-600" />
                  Preview do PDF
                </h3>
                <button
                  @click="previewUrl = null"
                  class="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                >
                  Fechar Preview
                </button>
              </div>
              <div class="bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                <iframe
                  :src="previewUrl"
                  class="w-full h-[600px]"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Step 3: Revisão -->
          <div v-if="currentStep === 2">
            <div class="flex items-center gap-2 mb-6">
              <CheckCircle class="h-5 w-5 text-green-600" />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Revisão e Envio</h2>
            </div>

            <div class="space-y-6">
              <!-- Dados Básicos -->
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
                  <div>
                    <dt class="text-sm font-medium text-gray-600 dark:text-slate-400">Status</dt>
                    <dd>
                      <span :class="[
                        'inline-flex px-3 py-1 rounded-full text-sm font-medium',
                        formData.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        formData.status === 'closed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      ]">
                        {{ formData.status === 'open' ? 'Aberto' : formData.status === 'closed' ? 'Fechado' : 'Rascunho' }}
                      </span>
                    </dd>
                  </div>
                  <div v-if="formData.dynamicFields.length > 0">
                    <dt class="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Campos Dinâmicos</dt>
                    <dd class="space-y-1">
                      <div v-for="(field, index) in formData.dynamicFields" :key="index" class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-slate-400">{{ field.key }}:</span>
                        <span class="text-gray-900 dark:text-slate-100 font-medium">{{ field.value }}</span>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Documentos -->
              <div class="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Documentos</h3>
                <div v-if="uploadedFiles.length === 0" class="text-sm text-gray-500 dark:text-slate-400">
                  Nenhum documento anexado
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg"
                  >
                    <FileText class="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ file.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-slate-400">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button
              v-if="currentStep > 0"
              variant="outline"
              @click="previousStep"
              class="gap-2"
            >
              <ArrowLeft class="h-4 w-4" />
              Anterior
            </Button>
            <div v-else></div>

            <div class="flex gap-3">
              <Button variant="outline" @click="handleCancel">
                Cancelar
              </Button>
              <Button
                v-if="currentStep < steps.length - 1"
                @click="nextStep"
                class="gap-2"
              >
                Próximo
                <ArrowRight class="h-4 w-4" />
              </Button>
              <Button
                v-else
                @click="submitEdital"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                class="gap-2"
              >
                <Send class="h-4 w-4" />
                Enviar Edital
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click="showSuccessModal = false"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
      >
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
          Edital Criado com Sucesso!
        </h3>
        <p class="text-gray-600 dark:text-slate-400 mb-6">
          O edital foi enviado e está disponível no sistema.
        </p>
        <div class="flex gap-3">
          <Button variant="outline" @click="createAnother" class="flex-1">
            Criar Outro
          </Button>
          <Button @click="goToHome" class="flex-1">
            Ver Editais
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/common/store/ui'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import Button from '@/common/components/ui/Button.vue'
import StepIndicator from '@/modules/gestao-editais/components/StepIndicator.vue'
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Eye,
  Trash2,
  Plus,
  Send,
  CheckCircle,
} from 'lucide-vue-next'

const router = useRouter()
const uiStore = useUiStore()

const steps = [
  { title: 'Dados Básicos', subtitle: 'Informações do edital' },
  { title: 'Documentos', subtitle: 'Upload de arquivos' },
  { title: 'Revisão', subtitle: 'Confirmar dados' },
]

const currentStep = ref(0)
const isDragging = ref(false)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const formData = ref({
  title: '',
  description: '',
  status: 'open',
  dynamicFields: [] as Array<{ key: string; value: string }>,
})

const uploadedFiles = ref<File[]>([])
const errors = ref({
  title: '',
  description: '',
})

const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (files: File[]) => {
  const pdfFiles = files.filter(file => file.type === 'application/pdf')
  uploadedFiles.value.push(...pdfFiles)

  if (pdfFiles.length > 0) {
    uiStore.showToast({
      type: 'success',
      message: `${pdfFiles.length} arquivo(s) adicionado(s)`,
    })
    if (pdfFiles.length === 1) {
      previewFile(pdfFiles[0])
    }
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
  if (uploadedFiles.value.length === 0) {
    previewUrl.value = null
  }
}

const previewFile = (file: File) => {
  previewUrl.value = URL.createObjectURL(file)
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
    const editalData = {
      title: formData.value.title,
      description: formData.value.description,
      status: formData.value.status,
      dynamicFields: formData.value.dynamicFields.filter(f => f.key && f.value),
      mainPDF: uploadedFiles.value[0] || null,
      annexes: uploadedFiles.value.slice(1),
      results: [],
    }

    await editalService.createEdital(editalData)

    showSuccessModal.value = true
  } catch (error) {
    console.error('Erro ao criar edital:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao criar edital. Tente novamente.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  if (confirm('Deseja cancelar? Todos os dados serão perdidos.')) {
    router.push('/')
  }
}

const createAnother = () => {
  showSuccessModal.value = false
  currentStep.value = 0
  formData.value = {
    title: '',
    description: '',
    status: 'open',
    dynamicFields: [],
  }
  uploadedFiles.value = []
  previewUrl.value = null
}

const goToHome = () => {
  router.push('/')
}
</script>
