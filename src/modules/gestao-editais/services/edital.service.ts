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

  formatFormData(formData: EditalFormData): FormData {
    const form = new FormData()
    
    // Campos básicos
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('status', formData.status)
    
    // Metadados como JSON
    const metadata = formData.dynamicFields
      .filter(field => field.key && field.value)
      .map(field => ({
        key: field.key,
        value: field.value
      }))
    form.append('metadata', JSON.stringify(metadata))
    
    // Arquivo principal (PDF)
    if (formData.mainPDF?.file) {
      form.append('main_pdf', formData.mainPDF.file, formData.mainPDF.name)
      form.append('main_pdf_display_name', formData.mainPDF.displayName)
    }
    
    // Anexos
    formData.annexes.forEach((annexe, index) => {
      if (annexe.file) {
        form.append(`annexe_${index}`, annexe.file, annexe.name)
        form.append(`annexe_${index}_display_name`, annexe.displayName)
      }
    })
    
    // Resultados
    formData.results.forEach((result, index) => {
      if (result.file) {
        form.append(`result_${index}`, result.file, result.name)
        form.append(`result_${index}_display_name`, result.displayName)
      }
    })
    
    return form
  },

  async createEdital(formData: EditalFormData): Promise<EditalResponse> {
    console.log('📝 Criando edital com arquivos reais...')
    
    // Se há arquivos, usar FormData para upload real
    if (formData.mainPDF?.file || formData.annexes.some(a => a.file) || formData.results.some(r => r.file)) {
      const form = this.formatFormData(formData)
      console.log('📎 Enviando FormData com arquivos binários')
      
      const edital = await apiClient.uploadFile('/api/editals/', form)
      console.log('✅ Edital criado com arquivos:', edital)
      return edital
    } else {
      // Fallback para JSON simples se não há arquivos
      const payload = this.formatPayload(formData)
      console.log('📝 Enviando JSON sem arquivos:', payload)
      
      const edital = await apiClient.post<EditalResponse>('/api/editals/', payload)
      console.log('✅ Edital criado:', edital)
      return edital
    }
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
