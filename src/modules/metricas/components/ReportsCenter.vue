<template>
  <!-- Modal da Central de Relatórios -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal Content -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <FileClockIcon class="h-6 w-6 text-blue-700" />
            <div>
              <h2 class="text-xl font-semibold text-slate-800">Central de Relatórios</h2>
              <p class="text-sm text-slate-600">Gerencie rotinas automáticas de envio</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" @click="$emit('close')">
            <X class="h-5 w-5" />
          </Button>
        </div>

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'routines'"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'routines' 
                ? 'border-blue-700 text-blue-700' 
                : 'border-transparent text-slate-600 hover:text-slate-800'"
            >
              <div class="flex items-center gap-2">
                <List class="h-4 w-4" />
                Rotinas Ativas
              </div>
            </button>
            <button
              @click="activeTab = 'editor'"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'editor' 
                ? 'border-blue-700 text-blue-700' 
                : 'border-transparent text-slate-600 hover:text-slate-800'"
            >
              <div class="flex items-center gap-2">
                <Plus class="h-4 w-4" />
                {{ editingRoutine ? 'Editar Rotina' : 'Nova Rotina' }}
              </div>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Visão A: Rotinas Ativas -->
          <div v-if="activeTab === 'routines'" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-slate-800">Rotinas Configuradas</h3>
              <Button @click="createNewRoutine" class="gap-2">
                <Plus class="h-4 w-4" />
                Nova Rotina de Envio
              </Button>
            </div>

            <!-- Tabela de Rotinas -->
            <div class="bg-gray-50 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">Nome da Rotina</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">Frequência</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">Destinatários</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-slate-700">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="routine in routines" :key="routine.id" class="hover:bg-white transition-colors">
                    <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ routine.name }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">{{ routine.frequency }}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="email in routine.recipients.slice(0, 2)" 
                          :key="email"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                        >
                          {{ email }}
                        </span>
                        <span v-if="routine.recipients.length > 2" class="text-xs text-slate-500">
                          +{{ routine.recipients.length - 2 }} mais
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="routine.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'"
                      >
                        {{ routine.status === 'active' ? 'Ativo' : 'Pausado' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <div class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" @click="editRoutine(routine)">
                          <Edit class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" @click="toggleRoutineStatus(routine)">
                          <component :is="routine.status === 'active' ? Pause : Play" class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" @click="deleteRoutine(routine.id)" class="text-red-600">
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Estado vazio -->
              <div v-if="routines.length === 0" class="text-center py-12">
                <FileClockIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma rotina configurada</h3>
                <p class="text-gray-600 mb-4">Crie sua primeira rotina automática de relatórios</p>
                <Button @click="createNewRoutine">
                  <Plus class="h-4 w-4 mr-2" />
                  Criar Primeira Rotina
                </Button>
              </div>
            </div>
          </div>

          <!-- Visão B: Editor de Rotina -->
          <div v-if="activeTab === 'editor'" class="space-y-6">
            <h3 class="text-lg font-medium text-slate-800">
              {{ editingRoutine ? 'Editar Rotina' : 'Nova Rotina de Envio' }}
            </h3>

            <form @submit.prevent="saveRoutine" class="space-y-6">
              <!-- Nome da Rotina -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Nome da Rotina</label>
                <input
                  v-model="routineForm.name"
                  type="text"
                  placeholder="Ex: Relatório Diretoria"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Destinatários (Tags/Chips) -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Destinatários</label>
                <div class="border border-gray-300 rounded-lg p-3 min-h-[100px] focus-within:ring-2 focus-within:ring-blue-500">
                  <!-- Tags dos emails -->
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span 
                      v-for="(email, index) in routineForm.recipients" 
                      :key="index"
                      class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {{ email }}
                      <button type="button" @click="removeRecipient(index)" class="hover:text-blue-900">
                        <X class="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                  <!-- Input para novo email -->
                  <input
                    v-model="newRecipient"
                    @keydown.enter.prevent="addRecipient"
                    type="email"
                    placeholder="Digite um e-mail e pressione Enter"
                    class="w-full border-0 outline-0 text-sm"
                  />
                </div>
                <p class="text-xs text-slate-500 mt-1">Digite um e-mail e pressione Enter para adicionar</p>
              </div>

              <!-- Frequência -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Frequência de Envio</label>
                <select
                  v-model="routineForm.frequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione a frequência</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quinzenal (a cada 15 dias)</option>
                  <option value="monthly">Mensal</option>
                  <option value="custom">Personalizado (Cron)</option>
                </select>
              </div>

              <!-- Cron personalizado (se selecionado) -->
              <div v-if="routineForm.frequency === 'custom'">
                <label class="block text-sm font-medium text-slate-700 mb-2">Expressão Cron</label>
                <input
                  v-model="routineForm.cronExpression"
                  type="text"
                  placeholder="0 9 * * 1 (toda segunda às 9h)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-slate-500 mt-1">
                  Exemplo: "0 9 * * 1" = toda segunda-feira às 9h
                </p>
              </div>

              <!-- Conteúdo do PDF -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-3">Conteúdo do Relatório</label>
                <div class="space-y-3">
                  <label class="flex items-center gap-3">
                    <input
                      v-model="routineForm.includeKpis"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-slate-700">KPIs (Mensagens, Usuários, Média, Custo)</span>
                  </label>
                  <label class="flex items-center gap-3">
                    <input
                      v-model="routineForm.includeCharts"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-slate-700">Gráficos de Editais</span>
                  </label>
                  <label class="flex items-center gap-3">
                    <input
                      v-model="routineForm.includeAiMetrics"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm text-slate-700">Métricas de IA (Tokens, Custos)</span>
                  </label>
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                <Button type="button" variant="ghost" @click="cancelEdit">
                  Cancelar
                </Button>
                <div class="flex items-center gap-3">
                  <Button type="button" variant="outline" @click="testRoutine">
                    <Send class="h-4 w-4 mr-2" />
                    Enviar Teste
                  </Button>
                  <Button type="submit">
                    <Save class="h-4 w-4 mr-2" />
                    {{ editingRoutine ? 'Atualizar' : 'Salvar' }} Rotina
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Button from '@/common/components/ui/Button.vue'
import { 
  FileClockIcon, 
  X, 
  List, 
  Plus, 
  Edit, 
  Pause, 
  Play, 
  Trash2, 
  Send, 
  Save 
} from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const activeTab = ref('routines')
const editingRoutine = ref(null)
const newRecipient = ref('')

// Dados das rotinas (mock)
const routines = ref([
  {
    id: 1,
    name: 'Relatório Diretoria',
    frequency: 'Quinzenal',
    recipients: ['diretoria@fapes.es.gov.br', 'coordenacao@fapes.es.gov.br'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Relatório Mensal TI',
    frequency: 'Mensal',
    recipients: ['ti@fapes.es.gov.br'],
    status: 'paused'
  }
])

// Formulário da rotina
const routineForm = reactive({
  name: '',
  recipients: [],
  frequency: '',
  cronExpression: '',
  includeKpis: true,
  includeCharts: true,
  includeAiMetrics: true
})

// Funções
const createNewRoutine = () => {
  editingRoutine.value = null
  resetForm()
  activeTab.value = 'editor'
}

const editRoutine = (routine) => {
  editingRoutine.value = routine
  Object.assign(routineForm, routine)
  activeTab.value = 'editor'
}

const resetForm = () => {
  Object.assign(routineForm, {
    name: '',
    recipients: [],
    frequency: '',
    cronExpression: '',
    includeKpis: true,
    includeCharts: true,
    includeAiMetrics: true
  })
}

const addRecipient = () => {
  if (newRecipient.value && !routineForm.recipients.includes(newRecipient.value)) {
    routineForm.recipients.push(newRecipient.value)
    newRecipient.value = ''
  }
}

const removeRecipient = (index) => {
  routineForm.recipients.splice(index, 1)
}

const saveRoutine = () => {
  console.log('Salvando rotina:', routineForm)
  // Aqui implementaria a lógica de salvamento
  activeTab.value = 'routines'
}

const cancelEdit = () => {
  resetForm()
  editingRoutine.value = null
  activeTab.value = 'routines'
}

const testRoutine = () => {
  console.log('Enviando teste da rotina:', routineForm)
  // Aqui implementaria o envio de teste
}

const toggleRoutineStatus = (routine) => {
  routine.status = routine.status === 'active' ? 'paused' : 'active'
}

const deleteRoutine = (id) => {
  const index = routines.value.findIndex(r => r.id === id)
  if (index > -1) {
    routines.value.splice(index, 1)
  }
}
</script>