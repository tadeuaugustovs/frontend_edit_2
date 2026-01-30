import { apiClient } from './client'
import type { User, AuthTokens, LoginCredentials } from '@/common/types/user.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('🔐 Tentando login com:', { username: credentials.username })

    // Django Token Auth - endpoint legado (local)
    const response = await apiClient.post<{
      token: string
    }>('/api-token-auth/', {
      username: credentials.username,
      password: credentials.password
    })

    console.log('✅ Login bem-sucedido, token recebido')

    return {
      user: {
        id: '1',
        email: `${credentials.username}@example.com`,
        name: credentials.username
      },
      tokens: {
        access: response.token,
        refresh: response.token // Backend legado não usa refresh/access par separado neste endpoint
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
