import { apiClient } from '@/common/api/client'
import type { EditalFormData, EditalPayload, EditalResponse } from '@/common/types/edital.types'

export const editalService = {
  formatPayload(formData: EditalFormData): any {
    // Formato para o Django backend local
    return {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      metadata: formData.dynamicFields
        .filter(field => field.key && field.value)
        .map(field => ({
          key: field.key,
          value: field.value
        })),
      files: [
        ...(formData.mainPDF ? [{
          file_type: 'main_pdf',
          name: formData.mainPDF.displayName,
          original_name: formData.mainPDF.name,
          url: '' // Mock URL
        }] : []),
        ...formData.annexes.map(f => ({
          file_type: 'annexe',
          name: f.displayName,
          original_name: f.name,
          url: '' // Mock URL
        })),
        ...formData.results.map(f => ({
          file_type: 'result',
          name: f.displayName,
          original_name: f.name,
          url: '' // Mock URL
        }))
      ]
    }
  },

  async createEdital(formData: EditalFormData): Promise<EditalResponse> {
    const payload = this.formatPayload(formData)
    console.log('📝 Criando edital:', payload)
    
    const edital = await apiClient.post<EditalResponse>('/api/editals/', payload)
    console.log('✅ Edital criado:', edital)

    // TODO: Implementar upload de arquivos quando necessário
    // Por enquanto, apenas criamos o edital com referências aos arquivos

    return edital
  },

  async updateEdital(id: string, formData: EditalFormData): Promise<EditalResponse> {
    const payload = this.formatPayload(formData)
    console.log('📝 Atualizando edital:', id, payload)
    
    return apiClient.put(`/api/editals/${id}/`, payload)
  },

  async getEditals(): Promise<EditalResponse[]> {
    console.log('🔍 Buscando editais...')
    
    const response = await apiClient.get<{
      count: number
      next: string | null
      previous: string | null
      results: EditalResponse[]
    }>('/api/editals/')
    
    console.log('✅ Editais recebidos:', response.results?.length || 0)
    return response.results || []
  },

  async getEdital(id: string): Promise<EditalResponse> {
    console.log('🔍 Buscando edital:', id)
    
    return apiClient.get(`/api/editals/${id}/`)
  },

  async deleteEdital(id: string): Promise<void> {
    console.log('🗑️ Deletando edital:', id)
    
    return apiClient.delete(`/api/editals/${id}/`)
  }
}
