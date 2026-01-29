<template>
  <!-- Modal de Envio de Relatório -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <Mail class="h-6 w-6 text-blue-700" />
            <div>
              <h2 class="text-xl font-semibold text-slate-800">Enviar Relatório por E-mail</h2>
              <p class="text-sm text-slate-600">Configure o recebimento automático dos seus relatórios</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" @click="$emit('close')">
            <X class="h-5 w-5" />
          </Button>
        </div>

        <div class="p-6">
          <form @submit.prevent="saveRoutine" class="space-y-6">
            
            <!-- Ativar/Desativar Envio -->
            <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div class="flex items-center gap-3">
                <div 
                  class="p-2 rounded-full"
                  :class="routineForm.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'"
                >
                  <component :is="routineForm.isActive ? CheckCircle : Ban" class="h-5 w-5" />
                </div>
                <div>
                  <h3 class="font-medium text-slate-800">Envio Automático</h3>
                  <p class="text-sm text-slate-500">
                    {{ routineForm.isActive ? 'Ativado: Você receberá os relatórios periodicamente' : 'Desativado: Nenhum relatório será enviado' }}
                  </p>
                </div>
              </div>
              
              <!-- Toggle Switch -->
              <button 
                type="button"
                @click="routineForm.isActive = !routineForm.isActive"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="routineForm.isActive ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span class="sr-only">Use setting</span>
                <span 
                  aria-hidden="true" 
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="routineForm.isActive ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <!-- Opções de Configuração (Apenas se Ativo) -->
            <div v-if="routineForm.isActive" class="space-y-6 pt-2 transition-all">
              
              <!-- Destinatário (Fixo) -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Destinatário</label>
                <div class="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-blue-50/50 rounded-lg text-slate-700">
                  <User class="h-4 w-4 text-blue-500" />
                  {{ authStore.user?.email || 'admin@fapes.es.gov.br' }}
                  <span class="text-xs text-blue-400 ml-auto">(Seu e-mail)</span>
                </div>
              </div>

              <!-- Frequência -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Frequência de Envio</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    v-model="routineForm.frequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="biweekly">Quinzenalmente</option>
                    <option value="monthly">Mensalmente</option>
                  </select>
                  
                  <!-- Info complementar da frequencia -->
                  <div class="flex items-center text-sm text-slate-500 px-2">
                    <Clock class="h-4 w-4 mr-2 text-slate-400" />
                    <span v-if="routineForm.frequency === 'daily'">Todo dia às 08:00</span>
                    <span v-else-if="routineForm.frequency === 'weekly'">Toda segunda-feira às 08:00</span>
                    <span v-else-if="routineForm.frequency === 'biweekly'">A cada 15 dias (segunda)</span>
                    <span v-else-if="routineForm.frequency === 'monthly'">Dia 1º de cada mês</span>
                    <span v-else>Selecione uma frequência</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Botões de Ação -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
              <Button type="button" variant="ghost" @click="$emit('close')">
                Cancelar
              </Button>
              <div class="flex items-center gap-3">
                <Button 
                  v-if="routineForm.isActive"
                  type="button" 
                  variant="outline" 
                  @click="testRoutine"
                  :disabled="!routineForm.frequency"
                >
                  <Send class="h-4 w-4 mr-2" />
                  Enviar Teste Agora
                </Button>
                <Button type="submit">
                  <Save class="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import Button from '@/common/components/ui/Button.vue'
import { 
  Mail,
  X,
  Send, 
  Save,
  CheckCircle,
  Ban,
  User,
  Clock
} from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const uiStore = useUiStore()

// Estado Único da Rotina do Usuário
const routineForm = reactive({
  isActive: false, // Começa desativado por padrão ou carrega do backend
  frequency: '',
  lastSent: null as string | null
})

// Simular carregamento das preferências do usuário
onMounted(() => {
  // Aqui buscaria do backend: GET /api/user/report-settings
  // Mock simulation:
  setTimeout(() => {
    routineForm.isActive = true 
    routineForm.frequency = 'weekly'
  }, 500)
})

const saveRoutine = () => {
  // Lógica de salvamento
  console.log('Salvando preferências de relatório:', {
    user: authStore.user?.email,
    settings: routineForm
  })
  
  uiStore.showToast({
    type: 'success',
    message: routineForm.isActive 
      ? `Envio automático ativado (${routineForm.frequency})`
      : 'Envio automático desativado'
  })
  
  emit('close')
}

const testRoutine = () => {
  uiStore.showToast({
    type: 'info',
    message: `Enviando relatório de teste para ${authStore.user?.email}...`
  })
  // Mock sending
  setTimeout(() => {
    uiStore.showToast({
      type: 'success',
      message: 'Relatório de teste enviado com sucesso!'
    })
  }, 1500)
}
</script>