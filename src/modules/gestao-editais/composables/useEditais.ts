import { ref, computed } from 'vue'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import { useUiStore } from '@/common/store/ui'
import { mapApiToEdital } from '../utils/edital.utils'
import type { Edital } from '../types/edital.types'

export function useEditais() {
    const uiStore = useUiStore()
    const editais = ref<Edital[]>([])
    const isLoading = ref(false)
    const searchQuery = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 5

    const loadEditais = async () => {
        isLoading.value = true
        try {
            const response = await editalService.getEditals()
            editais.value = response.map(mapApiToEdital)
        } catch (error) {
            console.error('Erro ao carregar editais:', error)
            uiStore.showToast({ type: 'error', message: 'Erro ao carregar editais' })
        } finally {
            isLoading.value = false
        }
    }

    const filteredEditais = computed(() => {
        let result = editais.value
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query)
            )
        }
        if (statusFilter.value) {
            result = result.filter(e => e.status === statusFilter.value)
        }
        return result
    })

    const totalPages = computed(() => Math.ceil(filteredEditais.value.length / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => startIndex.value + itemsPerPage)
    const paginatedEditais = computed(() => filteredEditais.value.slice(startIndex.value, endIndex.value))

    const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
    const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
    const clearFilters = () => {
        searchQuery.value = ''
        statusFilter.value = ''
        currentPage.value = 1
    }

    return {
        editais,
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
    }
}
