import { ref, computed } from 'vue'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import { useUiStore } from '@/common/store/ui'
import { mapApiToEdital } from '../utils/edital.utils'
import type { Edital, EditalFormData } from '../types/edital.types'

export function useEditalActions(loadEditais: () => Promise<void>) {
    const uiStore = useUiStore()
    const selectedEdital = ref<Edital | null>(null)
    const isEditMode = ref(false)
    const isSaving = ref(false)
    const showDeleteConfirm = ref(false)

    const editForm = ref<EditalFormData>({
        title: '',
        description: '',
        status: 'open',
        tags: '',
        numero: '',
        mainPDF: null,
        newAnnexes: [],
        deletedAnnexIds: [],
        metadata: []
    })

    // Computeds for editing files
    const existingMainFile = computed(() => {
        if (!selectedEdital.value || !selectedEdital.value.files) return null
        return selectedEdital.value.files.find(f => f.file_type === 'main_pdf') || null
    })

    const existingAnnexes = computed(() => {
        if (!selectedEdital.value || !selectedEdital.value.files) return []
        return selectedEdital.value.files.filter(f =>
            f.file_type !== 'main_pdf' &&
            !editForm.value.deletedAnnexIds.includes(f.id)
        )
    })

    const openEditalModal = async (edital: any) => {
        try {
            const apiEdital: any = await editalService.getEdital(edital.id)
            selectedEdital.value = mapApiToEdital(apiEdital)
            isEditMode.value = false
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error)
            uiStore.showToast({ type: 'error', message: 'Erro ao carregar detalhes do edital' })
        }
    }

    const closeEditalModal = () => {
        selectedEdital.value = null
        isEditMode.value = false
        showDeleteConfirm.value = false
    }

    const enterEditMode = () => {
        if (!selectedEdital.value) return
        editForm.value = {
            title: selectedEdital.value.title,
            description: selectedEdital.value.description,
            status: selectedEdital.value.status,
            tags: selectedEdital.value.tags?.join(',') || '',
            numero: selectedEdital.value.numero || '',
            mainPDF: null,
            newAnnexes: [],
            deletedAnnexIds: [],
            metadata: selectedEdital.value.metadata.map(m => ({ key: m.key, value: m.value }))
        }
        isEditMode.value = true
    }

    const cancelEdit = () => {
        isEditMode.value = false
    }

    const handleReplaceMain = (event: Event) => {
        const input = event.target as HTMLInputElement
        if (input.files && input.files.length > 0) {
            const file = input.files[0]
            editForm.value.mainPDF = { name: file.name, file: file }
        }
    }

    const handleInlineFileUpload = (event: Event) => {
        const input = event.target as HTMLInputElement
        if (input.files && input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                editForm.value.newAnnexes.push({ name: file.name, file: file })
            })
        }
    }

    const removeNewAnnex = (index: number) => {
        editForm.value.newAnnexes.splice(index, 1)
    }

    const markAnnexDeleted = (id: string) => {
        editForm.value.deletedAnnexIds.push(id)
    }

    const saveEdital = async () => {
        if (!selectedEdital.value) return
        isSaving.value = true
        try {
            const formData: any = {
                title: editForm.value.title,
                description: editForm.value.description,
                status: editForm.value.status as any,
                numero: editForm.value.numero,
                tags: editForm.value.tags,
                mainPDF: editForm.value.mainPDF,
                dynamicFields: editForm.value.metadata.map(m => ({
                    key: m.key,
                    value: m.value
                })),
                annexes: editForm.value.newAnnexes,
                deletedAnnexIds: editForm.value.deletedAnnexIds
            }

            const updated = await editalService.updateEdital(selectedEdital.value.id, formData)
            selectedEdital.value = mapApiToEdital(updated)

            uiStore.showToast({ type: 'success', message: 'Edital atualizado com sucesso!' })
            isEditMode.value = false
            await loadEditais()
        } catch (error) {
            console.error('Erro ao salvar:', error)
            uiStore.showToast({ type: 'error', message: 'Erro ao salvar alterações' })
        } finally {
            isSaving.value = false
        }
    }

    const executeDelete = async () => {
        if (!selectedEdital.value) return
        try {
            await editalService.deleteEdital(selectedEdital.value.id)
            uiStore.showToast({ type: 'success', message: 'Edital excluído com sucesso' })
            closeEditalModal()
            await loadEditais()
        } catch (error) {
            console.error('Erro ao excluir:', error)
            uiStore.showToast({ type: 'error', message: 'Erro ao excluir edital' })
        }
    }

    return {
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
        cancelEdit,
        handleReplaceMain,
        handleInlineFileUpload,
        removeNewAnnex,
        markAnnexDeleted,
        saveEdital,
        executeDelete
    }
}
