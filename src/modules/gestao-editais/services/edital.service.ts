import { apiClient } from '@/common/api/client'
import type { EditalFormData, EditalPayload, EditalResponse } from '@/common/types/edital.types'

export const editalService = {
  formatPayload(formData: EditalFormData): any {
<<<<<<< HEAD
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
=======
    // Formato correto para agentes-edite-controlpanel/controlpanel
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
>>>>>>> develop
    }

<<<<<<< HEAD
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
=======
    const tagsList = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []

    const metadataObj = {
      descricao: formData.description,
      ...Object.fromEntries(
        formData.dynamicFields
          .filter(field => field.key && field.value)
          .map(field => [field.key, field.value])
      )
    }

    return {
      numero: formData.numero,
      nome: formData.title,
      status: statusMap[formData.status] || 'ABERTO',
      tags: tagsList,
      metadata: metadataObj
    }
  },

  formatFormData(formData: EditalFormData): FormData {
    const form = new FormData()

    // Status Map
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
    }

    form.append('numero', formData.numero)
    form.append('nome', formData.title)
    form.append('status', statusMap[formData.status] || 'ABERTO')

    // Metadata (Description + Dynamic Fields) -> JSON Object
    const metadataObj = {
      descricao: formData.description,
      ...Object.fromEntries(
        formData.dynamicFields
          .filter(field => field.key && field.value)
          .map(field => [field.key, field.value])
      )
    }
    form.append('metadata', JSON.stringify(metadataObj))

    // Tags (ArrayField expects multiple values for same key in FormData often, or generic handling)
    if (formData.tags) {
      const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      tagsList.forEach(tag => form.append('tags', tag))
    }

    // Arquivo (FileField)
    if (formData.mainPDF?.file) {
      form.append('arquivo', formData.mainPDF.file)
    }

    return form
  },

  async createEdital(formData: EditalFormData): Promise<EditalResponse> {
    console.log('📝 Criando edital...')

    // Status Map (Frontend -> Backend Enum)
    const statusBackend = this.mapStatus(formData.status)

    // Preparar Metadata
    const metadataObj: Record<string, any> = {
      descricao: formData.description
    }
    formData.dynamicFields.forEach(field => {
      if (field.key && field.value) {
        metadataObj[field.key] = field.value
      }
    })

    // Preparar Tags
    const tagsList = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []

    // Decisão: JSON ou FormData?
    if (formData.mainPDF && formData.mainPDF.file) {
      console.log('📂 Upload via FormData (com arquivo)...')
      const form = new FormData()
      form.append('numero', formData.numero)
      form.append('nome', formData.title)
      form.append('status', statusBackend)
      form.append('arquivo', formData.mainPDF.file)

      // Django DRF Multipart: Arrays e Objetos complexos podem ser problemáticos
      // Se o backend suportar, enviamos JSON stringified para metadata, ou enviamos chaves separadas
      form.append('metadata', JSON.stringify(metadataObj))

      tagsList.forEach(tag => form.append('tags', tag))

      // Envia Anexos juntos se o backend suportar (o swagger atual diz q anexo é endpoint separado '/anexo/')
      // Então mantemos anexos separados por enquanto

      const response = await apiClient.post<EditalResponse>('/edital/edital/', form)

      // Upload de Anexos (Pós-Create)
      if (formData.annexes.length > 0) {
        await this.uploadAnnexes(response.id, formData.annexes)
      }
      return response

    } else {
      console.log('📝 Criação via JSON (sem arquivo)...')
      const payload: EditalPayload = {
        numero: formData.numero,
        nome: formData.title,
        status: statusBackend,
        tags: tagsList,
        metadata: metadataObj,
        // files não é enviado no create JSON payload, backend ignora
        files: { mainPDF: null, annexes: [], results: [] }
      }

      const response = await apiClient.post<EditalResponse>('/edital/edital/', payload)

      // Upload de Anexos (se houver, mas sem mainPDF é raro anexos existirem sem o principal, mas possivel)
      if (formData.annexes.length > 0) {
        await this.uploadAnnexes(response.id, formData.annexes)
      }
      return response
    }
  },

  async uploadAnnexes(editalId: number | string, annexes: any[]) {
    console.log('📎 Enviando Anexos...')
    for (const annex of annexes) {
      if (annex.file) {
        try {
          const annexForm = new FormData()
          annexForm.append('item', editalId.toString())
          annexForm.append('arquivo', annex.file)
          annexForm.append('nome', annex.displayName || annex.name)

          await apiClient.post('/anexo/', annexForm)
          console.log('   ✅ Anexo enviado:', annex.name)
        } catch (err) {
          console.error('   ❌ Falha ao enviar anexo:', annex.name, err)
        }
      }
    }
  },

  async updateEdital(id: string, formData: EditalFormData): Promise<EditalResponse> {
    console.log('📝 Atualizando edital:', id)

    // Passo 1: Atualização de Arquivo (se houver novo)
    if (formData.mainPDF && formData.mainPDF.file) {
      console.log('📂 Passo 1: Atualizando Arquivo Principal via PATCH (FormData)...')
      const form = new FormData()
      form.append('arquivo', formData.mainPDF.file)

      // Enviamos metadata e tags básicos para evitar erro 400 se o backend esperar
      form.append('metadata', '{}')
      if (formData.tags) {
        const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t)
        tagsList.forEach(tag => {
          form.append('tags', tag)
        })
      }

      await apiClient.patch(`/edital/edital/${id}/`, form)
    }

    // Passo 2: Atualização de Dados (JSON)
    console.log('📝 Passo 2: Atualizando Dados via JSON...')
    const metadataObj: Record<string, string> = {
      descricao: formData.description
    }
    formData.dynamicFields.forEach(field => {
      if (field.key && field.value) {
        metadataObj[field.key] = field.value
>>>>>>> develop
      }
    })
    
    return form
  },

<<<<<<< HEAD
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
=======
    const payload = {
      nome: formData.title,
      // numero: formData.numero, // Geralmente não se altera numero
      status: this.mapStatus(formData.status),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      metadata: metadataObj
    }

    const edital = await apiClient.patch<EditalResponse>(`/edital/edital/${id}/`, payload)

    // Passo 3: Novos Anexos
    if (formData.annexes && formData.annexes.length > 0) {
      console.log('📎 Passo 3: Enviando Novos Anexos...')
      for (const annex of formData.annexes) {
        if (annex.file && !annex.id?.toString().startsWith('server-')) { // Apenas novos (temp id)
          try {
            const annexForm = new FormData()
            annexForm.append('item', id)
            annexForm.append('arquivo', annex.file)
            annexForm.append('nome', annex.displayName || annex.name)

            await apiClient.post('/anexo/', annexForm)
            console.log('   ✅ Anexo enviado:', annex.name)
          } catch (err) {
            console.error('   ❌ Falha ao enviar anexo:', annex.name, err)
          }
        }
      }
>>>>>>> develop
    }
  },

<<<<<<< HEAD
  async updateEdital(id: string, formData: EditalFormData): Promise<EditalResponse> {
    const payload = this.formatPayload(formData)
    console.log('📝 Atualizando edital:', id, payload)
    
    return apiClient.put(`/api/editals/${id}/`, payload)
=======
  mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
    }
    return statusMap[status] || 'ABERTO'
>>>>>>> develop
  },

  async getEditals(): Promise<EditalResponse[]> {
    console.log('🔍 Buscando editais...')
<<<<<<< HEAD
    
    const response = await apiClient.get<{
      count: number
      next: string | null
      previous: string | null
      results: EditalResponse[]
    }>('/api/editals/')
    
    console.log('✅ Editais recebidos:', response.results?.length || 0)
    return response.results || []
=======

    const response = await apiClient.get<{
      meta: {
        current_page: number
        per_page: number
        max_per_page: number
        total: number
      }
      data: EditalResponse[]
    }>('/edital/edital/?ordering=-id')

    console.log('✅ Editais recebidos:', response.data?.length || 0)
    return response.data || []
>>>>>>> develop
  },

  async getEdital(id: string): Promise<EditalResponse> {
    console.log('🔍 Buscando edital:', id)
<<<<<<< HEAD
    
    return apiClient.get(`/api/editals/${id}/`)
=======

    return apiClient.get(`/edital/edital/${id}/`)
>>>>>>> develop
  },

  async deleteEdital(id: string): Promise<void> {
    console.log('🗑️ Deletando edital:', id)
<<<<<<< HEAD
    
    return apiClient.delete(`/api/editals/${id}/`)
=======

    return apiClient.delete(`/edital/edital/${id}/`)
>>>>>>> develop
  }
}
