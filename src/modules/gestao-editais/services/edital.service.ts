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

    // Verifica se há arquivo principal para decidir entre JSON e FormData
    // Nota: O backend espera 'arquivo' no multipart. 
    // Mesmo sem arquivo, vamos usar FormData para padronizar se possível, ou manter a lógica dual.
    // Como backend aceita JSON também, mantemos dual, mas corrigimos os nomes dos campos.

    if (formData.mainPDF) {
      console.log('📂 Detectado arquivo principal, usando FormData...')

      const form = new FormData()

      // Mapeamento correto para o backend controlpanel (Model Edital/ItemConhecimento)
      form.append('nome', formData.title) // Backend usa 'nome'
      form.append('numero', formData.numero) // Backend tem campo 'numero'

      const statusMap: Record<string, string> = {
        'open': 'ABERTO',
        'closed': 'ENCERRADO',
        'analyzing': 'EM_ANDAMENTO',
        'draft': 'ABERTO'
      }
      form.append('status', statusMap[formData.status || 'open'] || 'ABERTO')

      // Arquivo principal
      if (formData.mainPDF.file) {
        form.append('arquivo', formData.mainPDF.file) // Backend usa 'arquivo'
        // form.append('main_pdf_display_name', formData.mainPDF.name) // Desnecessário no backend real
      } else {
        console.warn('⚠️ mainPDF está definido mas sem o objeto File (blob) interno!')
      }

      // Tags (ArrayField no Django)
      if (formData.tags) {
        // Enviar como string separada por vírgula pode funcionar se o DRF/Django converter,
        // mas para ArrayField via FormData, melhor enviar múltiplos valores
        const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t)
        tagsList.forEach(tag => {
          form.append('tags', tag)
        })
      }

      // Metadata (backend espera JSON no campo 'metadata')
      const metadataObj: Record<string, string> = {
        descricao: formData.description // Backend não tem campo 'description' direto no ItemConhecimento, salvamos no metadata
      }

      formData.dynamicFields.forEach(field => {
        if (field.key && field.value) {
          metadataObj[field.key] = field.value
        }
      })

      form.append('metadata', JSON.stringify(metadataObj))

      console.log('📝 Enviando FormData...')
      const edital = await apiClient.post<EditalResponse>('/edital/edital/', form)
      console.log('✅ Edital criado com arquivo:', edital)
      return edital

    } else {
      // Sem arquivos, usa JSON
      console.log('📝 Sem arquivos, criando via JSON...')

      // Precisamos adaptar o payload JSON também para os campos corretos
      // O formatPayload original talvez esteja gerando campos errados?
      // Vamos fazer manual aqui para garantir

      const payload = {
        nome: formData.title,
        numero: formData.numero,
        status: this.mapStatus(formData.status),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        metadata: {
          descricao: formData.description,
          ...formData.dynamicFields.reduce((acc, field) => ({ ...acc, [field.key]: field.value }), {})
        }
      }

      console.log('📝 Enviando JSON:', payload)
      const edital = await apiClient.post<EditalResponse>('/edital/edital/', payload)
      console.log('✅ Edital criado:', edital)
      return edital
    }
  },

  async updateEdital(id: string, formData: EditalFormData): Promise<EditalResponse> {
    console.log('📝 Atualizando edital:', id)

    // Verifica se há NOVO arquivo principal (tem propriedade .file)
    if (formData.mainPDF && formData.mainPDF.file) {
      console.log('📂 Detectado NOVO arquivo principal na edição, usando FormData...')

      const form = new FormData()

      form.append('nome', formData.title)
      // numero é imutável geralmente, mas se quiser permitir editar, descomente:
      // form.append('numero', formData.numero) 

      const statusMap: Record<string, string> = {
        'open': 'ABERTO',
        'closed': 'ENCERRADO',
        'analyzing': 'EM_ANDAMENTO',
        'draft': 'ABERTO'
      }
      form.append('status', statusMap[formData.status || 'open'] || 'ABERTO')

      // Novo Arquivo principal
      form.append('arquivo', formData.mainPDF.file) // Backend usa 'arquivo'

      // Tags
      if (formData.tags) {
        const tagsList = formData.tags.split(',').map(t => t.trim()).filter(t => t)
        tagsList.forEach(tag => {
          form.append('tags', tag)
        })
      }

      // Metadata 
      const metadataObj: Record<string, string> = {
        descricao: formData.description
      }
      formData.dynamicFields.forEach(field => {
        if (field.key && field.value) {
          metadataObj[field.key] = field.value
        }
      })

      form.append('metadata', JSON.stringify(metadataObj))

      console.log('📝 Enviando FormData (PUT)...')
      return apiClient.put<EditalResponse>(`/edital/edital/${id}/`, form)
    } else {
      // JSON Update
      const payload = {
        nome: formData.title,
        // numero: formData.numero, // Mantemos imutável no JSON também
        status: this.mapStatus(formData.status),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        metadata: {
          descricao: formData.description,
          ...formData.dynamicFields.reduce((acc, field) => ({ ...acc, [field.key]: field.value }), {})
        }
      }

      console.log('📝 Atualizando edital via JSON:', payload)
      return apiClient.put(`/edital/edital/${id}/`, payload)
    }
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
    }>('/edital/edital/')

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
