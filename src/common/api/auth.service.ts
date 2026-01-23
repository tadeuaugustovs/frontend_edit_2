import { apiClient } from './client'
import type { User, AuthTokens, LoginCredentials } from '@/common/types/user.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('🔐 Tentando login com:', { username: credentials.username })
    
    // Django JWT API - endpoint correto com prefixo /api/
    const response = await apiClient.post<{ 
      access: string
      refresh: string
      user: {
        id: number
        username: string
        email: string
        first_name: string
        last_name: string
      }
    }>('/api/auth/login/', {
      username: credentials.username,
      password: credentials.password
    })
    
    console.log('✅ Login bem-sucedido, tokens JWT recebidos')
    
    // Adaptar resposta do Django para o formato esperado
    return {
      user: {
        id: response.user.id.toString(),
        email: response.user.email,
        name: response.user.first_name || response.user.username
      },
      tokens: {
        access: response.access,
        refresh: response.refresh
      }
    }
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        await apiClient.post('/api/auth/logout/', { refresh: refreshToken })
      } catch (error) {
        console.warn('Erro ao fazer logout no servidor:', error)
      }
    }
    return Promise.resolve()
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<{ access: string }>('/api/auth/refresh/', {
      refresh: refreshToken
    })
    return {
      access: response.access,
      refresh: refreshToken
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{
      id: number
      username: string
      email: string
      first_name: string
      last_name: string
    }>('/api/auth/me/')
    
    return {
      id: response.id.toString(),
      email: response.email,
      name: response.first_name || response.username
    }
  },
}
