<template>
  <AlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir Edital</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja excluir o edital "{{ title }}"? Esta ação não pode ser desfeita.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$emit('cancel')">Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          class="bg-red-600 hover:bg-red-700"
          @click="$emit('confirm')"
        >
          Confirmar Exclusão
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import AlertDialog, {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/AlertDialog.vue'

defineProps<{
  open: boolean
  title: string
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
