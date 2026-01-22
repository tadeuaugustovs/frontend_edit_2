<template>
  <Card class="h-full flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
    <CardHeader class="flex-shrink-0">
      <CardTitle class="text-gray-900 dark:text-gray-100">Sessões de Conversa</CardTitle>
      <CardDescription class="text-gray-500 dark:text-gray-400">
        Selecione uma sessão para visualizar a conversa completa
      </CardDescription>
    </CardHeader>
    <CardContent class="flex-1 flex flex-col overflow-hidden">
      <!-- Search -->
      <div class="mb-4 flex-shrink-0">
        <Input
          v-model="searchQuery"
          placeholder="Buscar por telefone ou ID de usuário..."
          @input="handleSearch"
          class="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="sessions.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Nenhuma sessão encontrada</p>
      </div>

      <!-- Sessions List -->
      <div v-else class="flex-1 overflow-hidden">
        <div class="space-y-2 h-full overflow-y-auto pr-2 custom-scrollbar">
          <div
            v-for="session in paginatedSessions"
            :key="session.id"
            class="p-4 border rounded-lg cursor-pointer transition-all flex-shrink-0"
            :class="session.id === selectedSessionId 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'"
            @click="selectSession(session.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-sm font-medium truncate" :class="session.id === selectedSessionId ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'">
                    {{ formatUserEmail(session.userEmail) }}
                  </p>
                  <Badge size="sm" variant="secondary" class="dark:bg-gray-700 dark:text-gray-300">
                    {{ session.messageCount }} msgs
                  </Badge>
                </div>
                <div class="space-y-1">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    ID: {{ session.userId }}
                  </p>
                  <p v-if="session.edital" class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {{ session.edital }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeDate(session.startTime) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Página {{ currentPage }} de {{ totalPages }}
        </div>
        <div class="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Próxima
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Card from '@/common/components/ui/Card.vue'
import CardHeader from '@/common/components/ui/CardHeader.vue'
import CardTitle from '@/common/components/ui/CardTitle.vue'
import CardDescription from '@/common/components/ui/CardDescription.vue'
import CardContent from '@/common/components/ui/CardContent.vue'
import Input from '@/common/components/ui/Input.vue'
import Badge from '@/common/components/ui/Badge.vue'
import Button from '@/common/components/ui/Button.vue'
import type { ConversationSession } from '@/common/types/api.types'

export interface SessionsListProps {
  sessions: ConversationSession[]
  selectedSessionId?: string
  isLoading: boolean
}

const props = withDefaults(defineProps<SessionsListProps>(), {
  isLoading: false,
})

const emit = defineEmits<{
  'session-select': [id: string]
  'search': [query: string]
}>()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(props.sessions.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.sessions.length))

const paginatedSessions = computed(() => {
  return props.sessions.slice(startIndex.value, endIndex.value)
})

const selectSession = (id: string) => {
  emit('session-select', id)
}

const handleSearch = () => {
  currentPage.value = 1
  emit('search', searchQuery.value)
}

const formatRelativeDate = (timestamp: string): string => {
  try {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch {
    return timestamp
  }
}

const formatUserEmail = (contact: string): string => {
  // Se parece com telefone (só números), formatar como telefone
  if (/^\d+$/.test(contact)) {
    // Formatar telefone brasileiro: 11988887777 -> (11) 98888-7777
    if (contact.length === 11) {
      return `(${contact.slice(0, 2)}) ${contact.slice(2, 7)}-${contact.slice(7)}`
    }
    return contact
  }
  // Se é email, retornar como está
  return contact
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Estilo customizado para scroll */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
