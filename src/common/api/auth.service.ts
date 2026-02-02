import { apiClient } from './client'
import type { User, AuthTokens, LoginCredentials } from '@/common/types/user.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('🔐 Tentando login com:', { username: credentials.username })

    // Django Token Auth - endpoint para o mock server e compatibilidade local
    const response = await apiClient.post<{
      token: string
    }>('/api-token-auth/', {
      username: credentials.username,
      password: credentials.password
    })

    console.log('✅ Login bem-sucedido, token recebido')

    // Configura o token no client para a próxima chamada
    localStorage.setItem('access_token', response.token)

    // Busca dados do usuário após login para remover fake data do frontend
    const user = await this.getCurrentUser()

    return {
      user,
      tokens: {
        access: response.token,
        refresh: response.token
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
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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
