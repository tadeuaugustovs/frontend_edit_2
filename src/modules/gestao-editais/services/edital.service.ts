import { apiClient } from '@/common/api/client'
import type { EditalFormData, EditalPayload, EditalResponse } from '@/common/types/edital.types'

export const editalService = {
  formatPayload(formData: EditalFormData): any {
    // Formato para o Django backend local
    return {
      numero: formData.numero,
      nome: formData.title,
      // Como não há campo 'descricao' direto no ItemConhecimento, salvamos no metadata ou usamos se existir
      // Assumindo que o backend espera 'descricao' no payload e trata internamente, ou colocamos em metadata.
      // Vou colocar em metadata para garantir.
      status: formData.status.toUpperCase(), // Enum costuma ser CAPS
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      metadata: {
        descricao: formData.description,
        ...Object.fromEntries(
          formData.dynamicFields
            .filter(field => field.key && field.value)
            .map(field => [field.key, field.value])
        )
      },
      // Arquivos são enviados via FormData separado, mas se for JSON puro (update sem arquivos):
      // A lógica de arquivos está no formatFormData
    }
  },

  formatFormData(formData: EditalFormData): FormData {
    const form = new FormData()

    // Campos básicos
    form.append('numero', formData.numero)
    form.append('nome', formData.title)

    // Status Map (Frontend 'open' -> Backend 'ABERTO')
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
    }
    form.append('status', statusMap[formData.status] || 'ABERTO')

    // Tags
    if (formData.tags) {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      tags.forEach(tag => form.append('tags', tag))
    }

    // Metadados como JSON
    const metadata = {
      descricao: formData.description,
      ...Object.fromEntries(
        formData.dynamicFields
          .filter(field => field.key && field.value)
          .map(field => [field.key, field.value])
      )
    }
    form.append('metadata', JSON.stringify(metadata))

    // Arquivo principal (PDF)
    if (formData.mainPDF?.file) {
      form.append('arquivo', formData.mainPDF.file, formData.mainPDF.name)
    }

    return form
  },

  async createEdital(formData: EditalFormData): Promise<EditalResponse> {
    console.log('📝 Criando edital com arquivos reais...')

    // Se há arquivos, usar FormData para upload real
    if (formData.mainPDF?.file || formData.annexes.some(a => a.file) || formData.results.some(r => r.file)) {
      const form = this.formatFormData(formData)
      console.log('📎 Enviando FormData com arquivos binários')

      const edital = await apiClient.uploadFile('/api/edital/edital/', form)
      console.log('✅ Edital criado com arquivos:', edital)
      return edital
    } else {
      // Fallback para JSON simples se não há arquivos
      const payload = this.formatPayload(formData)
      console.log('📝 Enviando JSON sem arquivos:', payload)

      const edital = await apiClient.post<EditalResponse>('/edital/edital/', payload)
      console.log('✅ Edital criado:', edital)
      return edital
    }
  },

  async updateEdital(id: string, formData: EditalFormData): Promise<EditalResponse> {
    const payload = this.formatPayload(formData)
    console.log('📝 Atualizando edital:', id, payload)

    return apiClient.put(`/edital/edital/${id}/`, payload)
  },

  async getEditals(): Promise<EditalResponse[]> {
    console.log('🔍 Buscando editais...')

    const response = await apiClient.get<{
      count: number
      next: string | null
      previous: string | null
      results: EditalResponse[]
    }>('/edital/edital/')

    console.log('✅ Editais recebidos:', response.results?.length || 0)
    return response.results || []
  },

  async getEdital(id: string): Promise<EditalResponse> {
    console.log('🔍 Buscando edital:', id)

    return apiClient.get(`/edital/edital/${id}/`)
  },

  async deleteEdital(id: string): Promise<void> {
    console.log('🗑️ Deletando edital:', id)

    return apiClient.delete(`/edital/edital/${id}/`)
  }
}
