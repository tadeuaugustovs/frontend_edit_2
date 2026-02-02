<template>
  <Dialog :open="!!edital" @update:open="$emit('close')">
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div class="flex items-center justify-between w-full pr-8">
          <div class="flex items-center gap-3">
            <DialogTitle class="text-xl font-bold text-gray-900">
              {{ isEditMode ? 'Editar Edital' : edital?.title }}
            </DialogTitle>
            <Badge v-if="edital && !isEditMode" :variant="getStatusVariant(edital.status)">
              {{ getStatusLabel(edital.status) }}
            </Badge>
          </div>
          
          <div class="flex items-center gap-2">
            <Button 
              v-if="!isEditMode"
              variant="destructive" 
              size="sm" 
              class="h-8 px-3 text-xs"
              @click="$emit('confirm-delete')"
            >
              <Trash2 class="h-3.5 w-3.5 mr-1" /> Excluir
            </Button>
            <Button 
              v-if="!isEditMode"
              variant="outline" 
              size="sm" 
              class="h-8 px-3 text-xs"
              @click="$emit('enter-edit')"
            >
              <Edit3 class="h-3.5 w-3.5 mr-1" /> Editar
            </Button>
          </div>
        </div>
        <DialogDescription v-if="!isEditMode" class="text-xs text-gray-500 mt-1">
          Criado em {{ edital?.created_at ? formatDate(edital.created_at) : 'N/A' }}
        </DialogDescription>
      </DialogHeader>

      <!-- Content -->
      <div v-if="edital">
        <EditalEditMode 
          v-if="isEditMode"
          :model-value="editForm"
          :main-file="existingMainFile"
          :annexes="existingAnnexes"
          @replace-main="$emit('replace-main', $event)"
          @add-annexes="$emit('add-annexes', $event)"
          @remove-new-annex="$emit('remove-new-annex', $event)"
          @remove-existing-annex="$emit('remove-existing-annex', $event)"
        />
        <EditalViewMode 
          v-else
          :edital="edital"
        />
      </div>

      <DialogFooter class="mt-6 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        <Button variant="ghost" @click="$emit('close')">
          {{ isEditMode ? 'Cancelar' : 'Fechar' }}
        </Button>
        <Button 
          v-if="isEditMode"
          variant="default" 
          @click="$emit('save')"
          :disabled="isSaving"
          class="gap-2"
        >
          <Save v-if="!isSaving" class="h-4 w-4" />
          <Loader2 v-else class="h-4 w-4 animate-spin" />
          {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Edit3, Trash2, Save, Loader2 } from 'lucide-vue-next'
import Dialog, {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/ui/Dialog.vue'
import Button from '@/common/components/ui/Button.vue'
import Badge from '@/common/components/ui/Badge.vue'
import EditalViewMode from './EditalViewMode.vue'
import EditalEditMode from './EditalEditMode.vue'
import { getStatusVariant, getStatusLabel, formatDate } from '../utils/edital.utils'
import type { Edital, EditalFormData } from '../types/edital.types'

defineProps<{
  edital: Edital | null
  isEditMode: boolean
  isSaving: boolean
  editForm: EditalFormData
  existingMainFile: any
  existingAnnexes: any[]
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'enter-edit'): void
  (e: 'save'): void
  (e: 'confirm-delete'): void
  (e: 'replace-main', event: Event): void
  (e: 'add-annexes', event: Event): void
  (e: 'remove-new-annex', index: number): void
  (e: 'remove-existing-annex', id: string): void
}>()
</script>
