import { apiClient } from '@/common/api/client'

export interface EngagementMetrics {
  total_messages: number
  total_users: number
  total_editals: number
  by_edital: Array<{
    edital_id: string
    edital_title: string
    message_count: number
    user_count: number
  }>
}

export interface Message {
  id: string
  user_email: string
  content: string
  timestamp: string
  edital_id?: string
  edital_title?: string
}

export interface MessagesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Message[]
}

export const metricsService = {
  async getEngagementMetrics(): Promise<EngagementMetrics> {
    console.log('📊 Buscando métricas de engajamento...')
    
    try {
      const response = await apiClient.get<EngagementMetrics>('/api/metrics/engagement/')
      console.log('✅ Métricas recebidas:', response)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar métricas:', error)
      // Retornar dados vazios em caso de erro
      return {
        total_messages: 0,
        total_users: 0,
        total_editals: 0,
        by_edital: []
      }
    }
  },

  async getMessages(params?: {
    page?: number
    page_size?: number
    edital_id?: string
    start_date?: string
    end_date?: string
  }): Promise<MessagesResponse> {
    console.log('📨 Buscando mensagens...', params)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString())
      if (params?.edital_id) queryParams.append('edital_id', params.edital_id)
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)
      
      const url = `/api/metrics/messages/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get<MessagesResponse>(url)
      
      console.log('✅ Mensagens recebidas:', response.results?.length || 0)
      return response
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens:', error)
      // Retornar dados vazios em caso de erro
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      }
    }
  }
}
