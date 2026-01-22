<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription v-if="description">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Estado A: Upload Area (só aparece quando não há arquivo ou no modo múltiplo) -->
      <div
        v-if="!hasMainFile || multiple"
        class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
        :class="dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="application/pdf"
          :multiple="multiple"
          class="hidden"
          @change="handleFileSelect"
        />
        
        <div class="flex flex-col items-center space-y-2">
          <div class="p-3 bg-gray-100 rounded-full">
            <svg class="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">
              Arraste arquivos PDF aqui ou
              <button
                type="button"
                class="text-primary hover:underline font-medium"
                @click="triggerFileInput"
              >
                clique para selecionar
              </button>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Apenas arquivos PDF são aceitos
            </p>
          </div>
        </div>
      </div>

      <!-- Estado B: Preview do PDF (aparece quando há arquivo principal) -->
      <div v-if="hasMainFile && !multiple" class="space-y-4">
        <!-- Botão de Remover/Trocar -->
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold text-gray-900">Preview do Documento</h4>
          <Button variant="outline" size="sm" @click="removeMainFile" class="gap-2 text-red-600 hover:text-red-700">
            <Trash2 class="h-4 w-4" />
            Remover/Trocar Arquivo
          </Button>
        </div>

        <!-- Visualizador de PDF -->
        <div class="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <div class="relative w-full h-[500px]">
            <iframe
              :src="mainFilePreviewUrl"
              class="w-full h-full"
              frameborder="0"
              title="Preview do PDF"
            ></iframe>
            <div class="absolute bottom-4 right-4 flex gap-2">
              <a
                :href="mainFilePreviewUrl"
                target="_blank"
                class="px-3 py-2 bg-white/90 hover:bg-white rounded-lg shadow-md text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
              >
                <ExternalLink class="h-4 w-4" />
                Abrir em Nova Aba
              </a>
            </div>
          </div>
        </div>

        <!-- Info do arquivo -->
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 rounded">
              <FileText class="h-4 w-4 text-red-600" />
            </div>
            <div class="flex-1">
              <Input
                v-model="mainFile.displayName"
                placeholder="Nome de exibição"
                class="text-sm font-medium"
                @blur="updateFile(mainFile)"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ mainFile.name }} • {{ formatFileSize(mainFile.size) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <Alert v-if="errorMessage" variant="destructive" class="mt-4">
        {{ errorMessage }}
      </Alert>

      <!-- Lista de Arquivos Adicionais (modo múltiplo) -->
      <div v-if="multiple && additionalFiles.length > 0" class="mt-6 space-y-3">
        <h4 class="text-sm font-semibold text-gray-900">Arquivos Adicionais ({{ additionalFiles.length }})</h4>
        <div
          v-for="file in additionalFiles"
          :key="file.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <div class="flex-shrink-0">
              <FileText class="h-5 w-5 text-red-600" />
            </div>
            <div class="flex-1 min-w-0">
              <Input
                v-model="file.displayName"
                placeholder="Nome de exibição"
                class="text-sm"
                @blur="updateFile(file)"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ file.name }} • {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="removeFile(file.id)"
            class="ml-2"
          >
            <X class="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import Card from '@/common/components/ui/Card.vue'
import CardHeader from '@/common/components/ui/CardHeader.vue'
import CardTitle from '@/common/components/ui/CardTitle.vue'
import CardDescription from '@/common/components/ui/CardDescription.vue'
import CardContent from '@/common/components/ui/CardContent.vue'
import Input from '@/common/components/ui/Input.vue'
import Button from '@/common/components/ui/Button.vue'
import Alert from '@/common/components/ui/Alert.vue'
import { FileText, Trash2, X, ExternalLink } from 'lucide-vue-next'
import type { UploadedFile } from '@/common/types/edital.types'

export interface FileUploaderCardProps {
  title: string
  description?: string
  modelValue: UploadedFile[]
  multiple?: boolean
}

const props = withDefaults(defineProps<FileUploaderCardProps>(), {
  multiple: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: UploadedFile[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const errorMessage = ref('')
const uploadedFiles = ref<UploadedFile[]>([...props.modelValue])
const previewUrls = ref<Map<string, string>>(new Map())

// Computed properties
const hasMainFile = computed(() => uploadedFiles.value.length > 0)
const mainFile = computed(() => uploadedFiles.value[0])
const additionalFiles = computed(() => uploadedFiles.value.slice(1))

const mainFilePreviewUrl = computed(() => {
  if (!mainFile.value?.file) return ''
  
  // Se já temos uma URL de preview, use ela
  if (previewUrls.value.has(mainFile.value.id)) {
    return previewUrls.value.get(mainFile.value.id)!
  }
  
  // Criar nova URL de preview usando URL.createObjectURL
  const url = URL.createObjectURL(mainFile.value.file)
  previewUrls.value.set(mainFile.value.id, url)
  return url
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  uploadedFiles.value = [...newValue]
}, { deep: true })

// Emit changes
watch(uploadedFiles, (newFiles) => {
  emit('update:modelValue', newFiles)
}, { deep: true })

// Cleanup URLs when component is destroyed
onBeforeUnmount(() => {
  previewUrls.value.forEach(url => {
    URL.revokeObjectURL(url)
  })
  previewUrls.value.clear()
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleDragOver = () => {
  dragActive.value = true
}

const handleDragLeave = () => {
  dragActive.value = false
}

const handleDrop = (event: DragEvent) => {
  dragActive.value = false
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    processFiles(Array.from(files))
  }
  // Reset input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const processFiles = (files: File[]) => {
  errorMessage.value = ''

  // Validate file types
  const invalidFiles = files.filter(f => f.type !== 'application/pdf')
  if (invalidFiles.length > 0) {
    errorMessage.value = 'Apenas arquivos PDF são aceitos'
    return
  }

  // Check if multiple is allowed
  if (!props.multiple && files.length > 1) {
    errorMessage.value = 'Apenas um arquivo é permitido'
    return
  }

  // If not multiple, replace existing file
  if (!props.multiple) {
    // Cleanup old preview URLs
    uploadedFiles.value.forEach(file => {
      const url = previewUrls.value.get(file.id)
      if (url) {
        URL.revokeObjectURL(url)
        previewUrls.value.delete(file.id)
      }
    })
    uploadedFiles.value = []
  }

  // Add files
  files.forEach(file => {
    const uploadedFile: UploadedFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      displayName: file.name.replace('.pdf', ''),
      file: file,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }
    uploadedFiles.value.push(uploadedFile)
  })
}

const removeFile = (id: string) => {
  // Cleanup preview URL
  const url = previewUrls.value.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    previewUrls.value.delete(id)
  }
  
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== id)
}

const removeMainFile = () => {
  if (mainFile.value) {
    removeFile(mainFile.value.id)
  }
}

const updateFile = (file: UploadedFile) => {
  const index = uploadedFiles.value.findIndex(f => f.id === file.id)
  if (index !== -1) {
    uploadedFiles.value[index] = { ...file }
  }
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script>
