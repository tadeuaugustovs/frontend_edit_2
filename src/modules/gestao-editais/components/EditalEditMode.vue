<template>
  <div class="space-y-6">
    <!-- Grid Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-1">
        <label class="text-xs font-semibold text-gray-500 uppercase">Título do Edital</label>
        <input v-model="form.title" type="text" 
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs font-semibold text-gray-500 uppercase">Número / Identificador</label>
        <input v-model="form.numero" type="text" 
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs font-semibold text-gray-500 uppercase">Status</label>
        <select v-model="form.status" 
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="open">Aberto</option>
          <option value="closed">Fechado</option>
          <option value="analyzing">Em Análise</option>
          <option value="draft">Rascunho</option>
        </select>
      </div>
      <div class="space-y-1">
        <label class="text-xs font-semibold text-gray-500 uppercase">Tags (separadas por vírgula)</label>
        <input v-model="form.tags" type="text" placeholder="ex: inovação, startup"
          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-xs font-semibold text-gray-500 uppercase">Descrição</label>
      <textarea v-model="form.description" rows="3"
        class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      ></textarea>
    </div>

    <!-- Metadata Editing -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700">Metadados Customizados</h3>
        <Button variant="ghost" size="sm" @click="form.metadata.push({ key: '', value: '' })" class="h-7 text-xs gap-1">
          <Plus class="h-3 w-3" /> Add Campo
        </Button>
      </div>
      <div class="space-y-2">
        <div v-for="(meta, idx) in form.metadata" :key="idx" class="flex gap-2">
          <input v-model="meta.key" placeholder="Chave" class="flex-1 px-2 py-1.5 border rounded-md text-xs" />
          <input v-model="meta.value" placeholder="Valor" class="flex-1 px-2 py-1.5 border rounded-md text-xs" />
          <Button variant="ghost" size="sm" @click="form.metadata.splice(idx, 1)" class="text-red-500 hover:text-red-700 p-1">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Files Management -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-gray-700">Gestão de Arquivos</h3>
      
      <!-- Main File -->
      <div class="p-3 bg-blue-50/30 border border-blue-100 rounded-lg space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-blue-600 uppercase">Arquivo Principal (PDF)</span>
          <Badge v-if="form.mainPDF" variant="success" class="text-[10px] h-4">Novo Selecionado</Badge>
        </div>
        <div v-if="mainFile && !form.mainPDF" class="flex items-center justify-between text-sm text-gray-600 bg-white p-2 border rounded">
          <div class="flex items-center gap-2">
            <FileText class="h-4 w-4 text-blue-500" />
            <span class="line-clamp-1">{{ mainFile.name }}</span>
          </div>
          <label class="cursor-pointer text-xs text-blue-600 hover:underline font-medium">
            Substituir
            <input type="file" class="hidden" accept=".pdf" @change="$emit('replace-main', $event)" />
          </label>
        </div>
        <div v-else-if="form.mainPDF" class="flex items-center justify-between text-sm text-blue-700 bg-blue-50 p-2 border border-blue-200 rounded">
          <div class="flex items-center gap-2">
            <Upload class="h-4 w-4" />
            <span class="line-clamp-1 font-semibold">{{ form.mainPDF.name }}</span>
          </div>
          <Button variant="ghost" size="sm" @click="form.mainPDF = null" class="h-6 w-6 p-0 text-blue-600">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <!-- Annexes -->
      <div class="space-y-2">
        <div v-for="file in annexes" :key="file.id" class="flex items-center justify-between p-2 bg-gray-50 border rounded text-sm">
          <div class="flex items-center gap-2 text-gray-600">
            <Paperclip class="h-4 w-4" />
            <span class="line-clamp-1">{{ file.name }}</span>
          </div>
          <Button variant="ghost" size="sm" @click="$emit('remove-existing-annex', file.id)" class="text-red-500 p-1 h-7">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
        
        <!-- New Annexes -->
        <div v-for="(file, idx) in form.newAnnexes" :key="idx" class="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded text-sm text-green-700">
          <div class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            <span class="line-clamp-1 font-medium">{{ file.name }}</span>
          </div>
          <Button variant="ghost" size="sm" @click="$emit('remove-new-annex', idx)" class="text-green-600 p-1 h-7">
            <X class="h-4 w-4" />
          </Button>
        </div>

        <label class="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
          <Upload class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-500">Adicionar Anexos</span>
          <input type="file" class="hidden" multiple @change="$emit('add-annexes', $event)" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, X, Upload, FileText, Paperclip, Trash2 } from 'lucide-vue-next'
import Button from '@/common/components/ui/Button.vue'
import Badge from '@/common/components/ui/Badge.vue'
import type { EditalFormData } from '../types/edital.types'

const props = defineProps<{
  modelValue: EditalFormData
  mainFile: any
  annexes: any[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EditalFormData): void
  (e: 'replace-main', event: Event): void
  (e: 'add-annexes', event: Event): void
  (e: 'remove-new-annex', index: number): void
  (e: 'remove-existing-annex', id: string): void
}>()

// Use a local reactive copy to avoid direct prop mutation if necessary,
// but since editForm is an object, we can just watch and emit or use a proxy.
// For now, let's just make it clear we are using the prop but emitting when changed
// Actually, simple mutation of the object properties is "allowed" by Vue but warned.
// To be clean, we use a shallow reactive copy.
const form = props.modelValue
</script>
