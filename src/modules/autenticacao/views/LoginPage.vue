<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 relative overflow-hidden">
    <!-- Subtle Background Pattern (Dark Mode Only) -->
    <div class="absolute inset-0 z-0 opacity-20 hidden dark:block">
      <div class="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-[120px]"></div>
    </div>

    <!-- Main Card -->
    <div class="w-full max-w-md p-8 relative z-10 mx-4">
      <!-- Glass Container -->
      <div class="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-8 transition-all duration-300">
        <!-- Logo Section -->
        <div class="flex flex-col items-center mb-10">
          <div class="bg-transparent dark:bg-white/90 p-3 rounded-xl mb-6 dark:shadow-lg">
            <Logo :width="140" :height="48" />
          </div>
          <h1 class="text-2xl font-bold text-center text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-200 dark:to-white">
            Gestão de Editais
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center font-light tracking-wide">
            Entre com suas credenciais para acessar
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <!-- Username Input -->
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Usuário</label>
              <div class="relative group">
                <input
                  v-model="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all group-hover:border-blue-400 dark:group-hover:border-slate-600"
                  :class="{'border-red-500 focus:border-red-500 dark:border-red-500/50 dark:focus:border-red-500': errors.username}"
                  @blur="validateUsername"
                  :disabled="isLoading"
                />
              </div>
              <p v-if="errors.username" class="text-xs text-red-500 dark:text-red-400 ml-1">{{ errors.username }}</p>
            </div>
            
            <!-- Password Input -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-center ml-1">
                <label class="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Senha</label>
              </div>
              <div class="relative group">
                <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all group-hover:border-blue-400 dark:group-hover:border-slate-600"
                  :class="{'border-red-500 focus:border-red-500 dark:border-red-500/50 dark:focus:border-red-500': errors.password}"
                  @blur="validatePassword"
                  :disabled="isLoading"
                />
              </div>
              <p v-if="errors.password" class="text-xs text-red-500 dark:text-red-400 ml-1">{{ errors.password }}</p>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 flex items-start gap-3">
            <span class="text-red-500 dark:text-red-400 mt-0.5">⚠️</span>
            <p class="text-sm text-red-600 dark:text-red-200">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg dark:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Entrar na Plataforma</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 text-center">
          <p class="text-xs text-slate-500">
            © 2026 FAPES - Fundação de Amparo à Pesquisa
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import Logo from '@/common/components/ui/Logo.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const errors = ref({
  username: '',
  password: '',
})

const validateUsername = () => {
  if (!username.value) {
    errors.value.username = 'Digite seu usuário'
    return false
  }
  if (username.value.length < 3) {
    errors.value.username = 'Mínimo de 3 caracteres'
    return false
  }
  errors.value.username = ''
  return true
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = 'Digite sua senha'
    return false
  }
  if (password.value.length < 5) {
    errors.value.password = 'Mínimo de 5 caracteres'
    return false
  }
  errors.value.password = ''
  return true
}

const handleSubmit = async () => {
  if (!validateUsername() || !validatePassword()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })

    uiStore.showToast({
      type: 'success',
      message: 'Bem-vindo de volta!',
    })

    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.response?.status === 401) {
      errorMessage.value = 'Usuário ou senha incorretos.'
    } else {
      errorMessage.value = 'Erro ao conectar. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Custom autofill style handling for both modes */
/* Light Mode Default */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #0f172a !important; /* slate-900 */
    transition: background-color 5000s ease-in-out 0s;
}

/* Dark Mode Override using global selector since .dark is on html/body */
:global(.dark) input:-webkit-autofill,
:global(.dark) input:-webkit-autofill:hover, 
:global(.dark) input:-webkit-autofill:focus, 
:global(.dark) input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #0f172a inset !important; /* slate-900 */
    -webkit-text-fill-color: white !important;
}
</style>
