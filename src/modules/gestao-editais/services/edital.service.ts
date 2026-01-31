import { apiClient } from '@/common/api/client'
import type { EditalFormData, EditalPayload, EditalResponse } from '@/common/types/edital.types'

export const editalService = {
  formatPayload(formData: EditalFormData): any {
    // Formato correto para agentes-edite-controlpanel/controlpanel
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
    }

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

    let edital: EditalResponse

    // Passo 1: Criação Básica (Com ou Sem Arquivo)
    // Se tiver arquivo, usamos FormData mas SEM metadata/tags complexos para evitar erro 400
    if (formData.mainPDF && formData.mainPDF.file) {
      console.log('📂 Passo 1: Upload Arquivo Principal via FormData...')
      const form = new FormData()
      form.append('nome', formData.title)
      form.append('numero', formData.numero)
      const statusMap: Record<string, string> = {
        'open': 'ABERTO', 'closed': 'ENCERRADO', 'analyzing': 'EM_ANDAMENTO', 'draft': 'ABERTO'
      }
      form.append('status', statusMap[formData.status || 'open'] || 'ABERTO')
      form.append('arquivo', formData.mainPDF.file)

      // Enviamos metadata e tags básicos para evitar erro 400 se o backend esperar
      form.append('metadata', '{}')
      if (formData.tags) {
        const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t)
        tagsList.forEach(tag => {
          form.append('tags', tag)
        })
      }

      // Enviamos apenas o básico para criar o ID e salvar o arquivo
      edital = await apiClient.post<EditalResponse>('/edital/edital/', form)

    } else {
      console.log('📝 Passo 1: Criação Básica via JSON...')
      const payload = {
        nome: formData.title,
        numero: formData.numero,
        status: this.mapStatus(formData.status),
        // Envia vazio e atualiza no passo 2 para consistência
        tags: [],
        metadata: {}
      }
      edital = await apiClient.post<EditalResponse>('/edital/edital/', payload)
    }

    console.log('✅ Edital criado (ID):', edital.id)

    // Passo 2: Atualizar Metadata e Tags via JSON (PATCH)
    // Garantimos que estruturas complexas sejam salvas corretamente
    console.log('📝 Passo 2: Atualizando Metadados e Tags via JSON...')
    const metadataObj: Record<string, string> = {
      descricao: formData.description
    }
    formData.dynamicFields.forEach(field => {
      if (field.key && field.value) {
        metadataObj[field.key] = field.value
      }
    })

    const updatePayload = {
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
      metadata: metadataObj
    }

    edital = await apiClient.patch<EditalResponse>(`/edital/edital/${edital.id}/`, updatePayload)

    // Passo 3: Upload de Anexos
    if (formData.annexes && formData.annexes.length > 0) {
      console.log('📎 Passo 3: Enviando Anexos...')
      for (const annex of formData.annexes) {
        if (annex.file) {
          try {
            const annexForm = new FormData()
            annexForm.append('item', edital.id.toString()) // FK para o Edital
            annexForm.append('arquivo', annex.file)
            annexForm.append('nome', annex.displayName || annex.name)

            await apiClient.post('/anexo/', annexForm)
            console.log('   ✅ Anexo enviado:', annex.name)
          } catch (err) {
            console.error('   ❌ Falha ao enviar anexo:', annex.name, err)
          }
        }
      }
    }

    return edital
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
      }
    })

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
    }

    return edital
  },

  mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'open': 'ABERTO',
      'closed': 'ENCERRADO',
      'analyzing': 'EM_ANDAMENTO',
      'draft': 'ABERTO'
    }
    return statusMap[status] || 'ABERTO'
  },

  async getEditals(): Promise<EditalResponse[]> {
    console.log('🔍 Buscando editais...')

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
