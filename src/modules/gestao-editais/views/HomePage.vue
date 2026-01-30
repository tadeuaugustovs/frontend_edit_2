<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
    <!-- Header with Glassmorphism -->
    <header class="glass-header sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <Logo :width="120" :height="48" />
            <div class="border-l border-gray-300 pl-4">
              <h1 class="text-xl font-semibold text-gray-900">Gestão de Editais</h1>
              <p class="text-xs text-gray-500">Sistema de Gerenciamento FAPES</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <AccessibilityMenu />
            <span class="text-sm text-gray-600 font-medium">{{ authStore.user?.name }}</span>
            <Button variant="outline" size="sm" @click="handleLogout" class="gap-2">
              <LogOut class="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Section -->
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Sistema de Gestão de Editais
          </h2>
          <p class="text-gray-600">
            Escolha uma das opções abaixo para começar
          </p>
        </div>

        <!-- Feature Cards with Glassmorphism -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <!-- Management Card -->
          <div 
            @click="navigateTo('/management')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <FileText class="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Gestão de Editais
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Crie e gerencie editais, faça upload de documentos e configure metadados
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                Acessar
              </Button>
            </div>
          </div>

          <!-- Metrics Card -->
          <div 
            @click="navigateTo('/metrics')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <BarChart3 class="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Métricas e Análises
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Visualize estatísticas de engajamento e mensagens por edital
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-green-50 dark:group-hover:bg-green-900/30">
                Acessar
              </Button>
            </div>
          </div>

          <!-- History Card -->
          <div 
            @click="navigateTo('/history')"
            class="glass-card group cursor-pointer backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6 hover:shadow-lg hover:bg-white/80 transition-all duration-300"
          >
            <div class="flex flex-col h-full">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <MessageSquare class="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                Histórico de Conversas
              </h3>
              <p class="text-sm text-gray-600 mb-4 flex-grow">
                Acesse o histórico completo de conversas entre usuários e chatbot
              </p>
              <Button variant="outline" size="sm" class="w-full bg-white dark:bg-transparent dark:text-gray-200 dark:border-gray-700 dark:hover:bg-slate-800 dark:hover:text-white group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30">
                Acessar
              </Button>
            </div>
          </div>
        </div>

        <!-- Editais Section -->
        <div class="glass-card backdrop-blur-sm bg-white/60 border border-gray-200/50 rounded-xl p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Editais Disponíveis</h2>
              <p class="text-sm text-gray-600 mt-1">Visualize e gerencie todos os editais cadastrados</p>
            </div>
            <Button @click="navigateTo('/management')" class="gap-2">
              <Plus class="h-4 w-4" />
              Novo Edital
            </Button>
          </div>

          <!-- Filters and Search -->
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1 relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Pesquisar editais..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
              />
            </div>
            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
            >
              <option value="">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="closed">Fechado</option>
              <option value="analyzing">Em Análise</option>
            </select>
            <Button variant="outline" @click="clearFilters" class="gap-2">
              <X class="h-4 w-4" />
              Limpar
            </Button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoadingEditais" class="text-center py-16">
            <Spinner />
            <p class="mt-4 text-gray-600">Carregando editais...</p>
          </div>

          <!-- Editais List -->
          <div v-else-if="paginatedEditais.length > 0" class="space-y-4">
            <div
              v-for="edital in paginatedEditais"
              :key="edital.id"
              @click="openEditalModal(edital)"
              class="group cursor-pointer backdrop-blur-sm bg-white/80 border border-gray-200/50 rounded-lg p-5 hover:shadow-md hover:bg-white transition-all duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {{ edital.title }}
                    </h3>
                    <Badge :variant="getStatusVariant(edital.status)">
                      {{ getStatusLabel(edital.status) }}
                    </Badge>
                  </div>
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ edital.description }}</p>

                </div>
                <div class="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" @click.stop="openEditalModal(edital)" class="gap-1.5">
                    <Eye class="h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileText class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum edital encontrado</h3>
            <p class="text-gray-600 mb-6">
              {{ searchQuery || statusFilter ? 'Tente ajustar os filtros de pesquisa' : 'Comece criando seu primeiro edital' }}
            </p>
            <Button @click="navigateTo('/management')" v-if="!searchQuery && !statusFilter" class="gap-2">
              <Plus class="h-4 w-4" />
              Criar Primeiro Edital
            </Button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredEditais.length > itemsPerPage" class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredEditais.length) }} de {{ filteredEditais.length }} editais
            </p>
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="previousPage"
                :disabled="currentPage === 1"
                class="gap-1.5"
              >
                <ChevronLeft class="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="gap-1.5"
              >
                Próxima
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edital Detail Modal -->
    <div
      v-if="selectedEdital"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click="closeEditalModal"
    >
      <div
        @click.stop
        class="glass-modal backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Modal Header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-200/50">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ isEditModeInline ? 'Editar Edital' : selectedEdital.title }}
              </h2>
              <Badge :variant="getStatusVariant(selectedEdital.status)">
                {{ getStatusLabel(selectedEdital.status) }}
              </Badge>
            </div>

          </div>
          <button
            @click="closeEditalModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          
          <!-- View Mode (Non-Editable) - Layout Otimizado para Leitura -->
          <!-- View Mode (Non-Editable) - Layout Otimizado para Leitura -->
          <div v-if="!isEditModeInline" class="space-y-6">
             <!-- Cabeçalho Visualização (Tags e ID) -->
             <div class="flex justify-between items-start">
                <div class="flex-1 mr-4 space-y-2">
                   <!-- Tags Display -->
                   <div v-if="selectedEdital.tags && selectedEdital.tags.length" class="flex flex-wrap gap-2">
                     <span v-for="tag in selectedEdital.tags" :key="tag" class="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs rounded-lg border border-blue-100 dark:border-blue-900/30">
                       #{{ tag }}
                     </span>
                   </div>
                </div>
                <!-- ID Box in View Mode -->
                <div class="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-xs font-mono text-gray-500 font-bold whitespace-nowrap border border-gray-200 dark:border-gray-700">
                  ID: {{ selectedEdital.numero || 'N/A' }}
                </div>
             </div>

             <!-- Descrição -->
             <div>
               <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Descrição</h3>
               <div class="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                 {{ selectedEdital.description }}
               </div>
             </div>

             <!-- Metadados (Informações Adicionais) -->
             <div v-if="selectedEdital.metadata && selectedEdital.metadata.filter(m => !['descricao', 'description', 'titulo', 'title'].includes(m.key.toLowerCase())).length > 0" class="pt-4 border-t border-gray-100 dark:border-gray-800">
                 <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Informações Adicionais</h3>
                 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div v-for="(meta, index) in selectedEdital.metadata.filter(m => !['descricao', 'description', 'titulo', 'title'].includes(m.key.toLowerCase()))" :key="index" class="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded border border-gray-100 dark:border-gray-800/50">
                         <span class="text-[10px] uppercase text-gray-400 font-bold mb-1">{{ meta.key }}</span>
                         <span class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ meta.value }}</span>
                     </div>
                 </div>
             </div>

             <!-- Files Display View Mode -->
             <div class="pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-2">
                 <Paperclip class="h-4 w-4" />
                 Arquivos e Documentos
               </h3>
               
               <div v-if="selectedEdital.files?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Arquivo Principal -->
                  <a 
                    v-if="selectedEdital.files.find(f => f.file_type === 'main_pdf')"
                    :href="selectedEdital.files.find(f => f.file_type === 'main_pdf')?.url"
                    target="_blank"
                    class="flex items-center p-3 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all group col-span-1 sm:col-span-2"
                  >
                    <div class="p-2 bg-white dark:bg-gray-800 rounded border border-blue-100 dark:border-blue-900/30 mr-3 shadow-sm">
                       <FileText class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-blue-700 dark:text-blue-300">Arquivo Principal</p>
                      <p class="text-xs text-blue-600/80 dark:text-blue-400/70 truncate">{{ selectedEdital.files.find(f => f.file_type === 'main_pdf')?.name }}</p>
                    </div>
                  </a>

                  <!-- Anexos -->
                  <a 
                    v-for="file in selectedEdital.files.filter(f => f.file_type !== 'main_pdf')" 
                    :key="file.id"
                    :href="file.url"
                    target="_blank"
                    class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 bg-gray-50 dark:bg-gray-800 transition-all group"
                  >
                    <div class="p-2 bg-white dark:bg-gray-700 rounded mr-3 shadow-sm">
                       <FileText class="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <div class="overflow-hidden">
                      <p class="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{{ file.name }}</p>
                      <p class="text-xs text-gray-500">Anexo</p>
                    </div>
                  </a>
               </div>
               <p v-else class="text-sm text-gray-500 italic">Nenhum arquivo anexado.</p>
             </div>
          </div>

          <!-- Edit Mode (Compact Grid Layout) -->
          <div v-else class="grid grid-cols-12 gap-6">
             <!-- Row 1: Título (Full) -->
             <div class="col-span-12">
               <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Título</label>
               <input v-model="editForm.title" type="text" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sm:text-sm" />
             </div>

             <!-- Row 2: Status, Número, Tags -->
             <div class="col-span-12 md:col-span-3">
               <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Status</label>
               <select v-model="editForm.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-gray-100">
                  <option value="open">Aberto</option>
                  <option value="analyzing">Em Análise</option>
                  <option value="closed">Encerrado</option>
                  <option value="draft">Rascunho</option>
                  <option v-if="!['open', 'analyzing', 'closed', 'draft'].includes(editForm.status)" :value="editForm.status">{{ editForm.status }}</option>
               </select>
             </div>

             <div class="col-span-12 md:col-span-3">
               <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">ID</label>
               <input v-model="editForm.numero" disabled placeholder="Ex: 01/2024" class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-0 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
             </div>

             <div class="col-span-12 md:col-span-6">
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Tags</label>
                <input v-model="editForm.tags" placeholder="Separe por vírgula" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-gray-100" />
             </div>

             <!-- Row 3: Descrição -->
             <div class="col-span-12">
               <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Descrição</label>
               <textarea v-model="editForm.description" rows="3" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-gray-100 resize-none"></textarea>
             </div>

             <!-- Row Extra: Metadata (Informações Adicionais) -->
             <div class="col-span-12" v-if="editForm.metadata.filter(m => !['descricao', 'description', 'titulo', 'title'].includes(m.key.toLowerCase())).length > 0">
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Informações Adicionais</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-800/20 rounded border border-gray-200 dark:border-gray-700">
                   <div 
                     v-for="(meta, index) in editForm.metadata.filter(m => !['descricao', 'description', 'titulo', 'title'].includes(m.key.toLowerCase()))" 
                     :key="index" 
                     class="flex flex-col"
                   >
                      <label class="text-[10px] text-gray-400 uppercase font-bold mb-1">{{ meta.key }}</label>
                      <input v-model="meta.value" class="px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100" />
                   </div>
                </div>
             </div>

             <!-- SEÇÃO 1: Arquivo do Edital (Principal - Único) -->
             <div class="col-span-12 md:col-span-6 pt-6 border-t border-gray-100 dark:border-gray-800">
               <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Arquivo Principal</label>
               
               <div class="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-h-[120px] flex flex-col justify-center transition-colors">
                  <!-- Estado: Arquivo Selecionado ou Existente -->
                  <div class="flex items-center justify-between gap-3">
                     <div class="flex items-center gap-3 overflow-hidden flex-1">
                        <div class="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0">
                           <FileText class="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div class="flex flex-col min-w-0">
                           <span v-if="editForm.mainPDF" class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Novo Selecionado</span>
                           <span v-else-if="existingMainFile" class="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Atual</span>
                           <span v-else class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pendente</span>
                           
                           <!-- Link para arquivo existente -->
                           <a 
                             v-if="existingMainFile && !editForm.mainPDF"
                             :href="existingMainFile.url"
                             target="_blank"
                             class="text-sm font-medium truncate text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                             :title="existingMainFile.name"
                           >
                             {{ existingMainFile.name }}
                             <ExternalLink class="h-3 w-3" />
                           </a>
                           <!-- Texto para novo arquivo ou vazio -->
                           <span v-else class="text-sm font-medium truncate text-gray-900 dark:text-gray-100" :title="editForm.mainPDF ? editForm.mainPDF.name : ''">
                              {{ editForm.mainPDF ? editForm.mainPDF.name : 'Nenhum arquivo carregado' }}
                           </span>
                        </div>
                     </div>
                     
                     <!-- Botão de Ação -->
                     <label class="cursor-pointer shrink-0 px-3 py-1.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all flex items-center gap-2">
                        <Upload class="h-3 w-3" />
                         {{ editForm.mainPDF || existingMainFile ? 'Trocar' : 'Carregar' }}
                        <input type="file" class="hidden" @change="(e) => handleReplaceMain(e)" />
                     </label>
                  </div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 px-1">Este é o documento principal do edital.</p>
               </div>
             </div>

             <!-- SEÇÃO 2: Anexos (Múltiplos) -->
             <div class="col-span-12 md:col-span-6 pt-6 border-t border-gray-100 dark:border-gray-800 md:border-t-0 md:border-l md:pl-8">
               <div class="flex justify-between items-center mb-2">
                 <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Anexos e Documentos</label>
                 <label class="cursor-pointer flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-900/30">
                    <Plus class="h-3 w-3" /> ADICIONAR
                    <input type="file" multiple class="hidden" @change="handleInlineFileUpload" />
                 </label>
               </div>


               <div class="bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 p-2 min-h-[200px] max-h-[300px] overflow-y-auto custom-scrollbar">
                  <!-- Lista Vazia -->
                  <div v-if="editForm.newAnnexes.length === 0 && existingAnnexes.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-2">
                     <span class="text-xs italic">Nenhum anexo adicional.</span>
                  </div>

                  <!-- Lista de Novos -->
                  <div v-for="(annex, index) in editForm.newAnnexes" :key="'new-'+index" class="flex items-center justify-between p-2 mb-2 bg-white dark:bg-gray-900/50 border border-green-200 dark:border-green-800/50 rounded-md shadow-sm">
                     <div class="flex items-center gap-2 overflow-hidden">
                        <Badge variant="outline" class="text-[9px] px-1 py-0 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">NOVO</Badge>
                        <span class="text-xs font-medium truncate text-gray-700 dark:text-gray-200" :title="annex.name">{{ annex.name }}</span>
                     </div>
                     <button @click="removeNewAnnex(index)" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remover">
                        <X class="h-3 w-3" />
                     </button>
                  </div>
                  
                  <!-- Lista de Existentes -->
                  <div v-for="file in existingAnnexes" :key="file.id" class="flex items-center justify-between p-2 mb-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                     <div class="flex items-center gap-2 overflow-hidden">
                        <FileText class="h-3 w-3 text-gray-400 dark:text-gray-500" />
                        <span class="text-xs font-medium truncate text-gray-700 dark:text-gray-200" :title="file.name">{{ file.name }}</span>
                     </div>
                     <button @click="markAnnexDeleted(file.id)" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Excluir Anexo">
                        <Trash2 class="h-3 w-3" />
                     </button>
                  </div>
               </div>
             </div>
          </div>

        </div>

    <!-- Modal Footer -->
    <div class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
       <!-- Delete Section -->
       <div>
          <!-- Initial Button -->
          <Button 
             v-if="!showDeleteConfirm && !isEditModeInline"
             variant="ghost" 
             @click="confirmDelete"
             class="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-900/20"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Excluir
          </Button>

          <!-- Confirmation UI -->
          <div v-else-if="showDeleteConfirm" class="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
             <span class="text-sm font-medium text-red-700 dark:text-red-400">Tem certeza?</span>
             <Button 
               variant="outline" 
               size="sm"
               @click="cancelDelete"
               class="h-8 px-3 text-xs"
             >
               Cancelar
             </Button>
             <Button 
               size="sm"
               @click="executeDelete"
               class="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white border-none"
             >
               Sim, Excluir
             </Button>
          </div>
       </div>

       <!-- Action Buttons -->
       <div class="flex gap-3">
          <Button variant="outline" @click="closeEditalModal">
            Fechar
          </Button>
          
          <!-- Mostrar botões de Salvar/Cancelar quando em modo de edição -->
          <template v-if="isEditModeInline">
            <Button 
              variant="outline"
              @click="cancelEdit"
              :disabled="isSaving"
            >
              Cancelar
            </Button>
            <Button 
              @click="saveEditalInline"
              :disabled="isSaving"
              class="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all"
            >
              <Save class="h-4 w-4" />
              {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
            </Button>
          </template>
          
          <!-- Mostrar botão Editar quando NÃO estiver em modo de edição -->
          <Button 
            v-else
            @click="enterEditMode" 
            class="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md hover:shadow-lg transition-all"
          >
            <Edit class="h-4 w-4" />
            Editar Edital
          </Button>
       </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/common/store/auth'
import { useUiStore } from '@/common/store/ui'
import { editalService } from '@/modules/gestao-editais/services/edital.service'
import type { EditalResponse } from '@/modules/gestao-editais/types/edital.types'

import Button from '@/common/components/ui/Button.vue'
import Logo from '@/common/components/ui/Logo.vue'
import Badge from '@/common/components/ui/Badge.vue'
import Spinner from '@/common/components/ui/Spinner.vue'
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Search, 
  X, 
  Eye, 
  Edit, 
  Paperclip, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Save,
  Trash2,
  Upload
} from 'lucide-vue-next'

// Local Interface
interface Edital {
  id: string
  title: string
  description: string
  status: 'open' | 'closed' | 'analyzing' | 'draft'
  numero?: string  // Número do edital (ex: 01/2024)
  tags?: string[]  // Tags do edital
  created_at: string
  updated_at: string
  metadata_count: number
  files_count: number
  metadata: Array<{ id: string; key: string; value: string }>
  files: Array<{ id: string; name: string; url: string; file_type: string }>
}

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const editais = ref<Edital[]>([])
const isLoadingEditais = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const selectedEdital = ref<Edital | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

// Inline Edit State
const isEditModeInline = ref(false)
const isSaving = ref(false)
const editForm = ref({
  title: '',
  description: '',
  status: 'open',
  tags: '',
  numero: '',
  mainPDF: null as { name: string, file: File } | null,
  newAnnexes: [] as Array<{ name: string, file: File }>,
  deletedAnnexIds: [] as string[],
  metadata: [] as Array<{ id?: string; key: string; value: string }>
})

// Helper para verificar arquivo existente
const existingMainFile = computed(() => {
  if (!selectedEdital.value || !selectedEdital.value.files) return null
  return selectedEdital.value.files.find(f => f.file_type === 'main_pdf') || null
})

// Helper para outros anexos existentes
const existingAnnexes = computed(() => {
  if (!selectedEdital.value || !selectedEdital.value.files) return []
  // Filtra tudo que NÃO for main_pdf E que NÃO esteja na lista de deletados
  return selectedEdital.value.files.filter(f => 
    f.file_type !== 'main_pdf' && 
    !editForm.value.deletedAnnexIds.includes(f.id)
  )
})

const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToEdit = (id: string) => {
  // Passa o ID como parametro de rota. 
  // Precisa garantir que a rota existe em router/index.ts
  router.push({ name: 'management-edit', params: { id } }) 
}

const mapApiToEdital = (api: any): Edital => {
    console.log('🔍 mapApiToEdital - Dados recebidos da API:', api)
    
    let mainFileObj: any = null;
    let annexesList: any[] = [];
    
    const directMainUrl = api.arquivo || api.url || api.file;
    console.log('📁 Arquivo principal detectado:', directMainUrl)
    
    if (directMainUrl) {
       mainFileObj = { 
          id: `${api.id}-main`, 
          name: directMainUrl.split('/').pop() || 'arquivo_principal', 
          url: directMainUrl, 
          file_type: 'main_pdf' 
       };
       annexesList = api.arquivos || [];
       console.log('✅ Arquivo principal definido:', mainFileObj)
    } else if (api.arquivos && api.arquivos.length > 0) {
       const first = api.arquivos[0];
       mainFileObj = {
          id: first.id?.toString() || `${api.id}-main-promoted`,
          name: first.nome || first.arquivo?.split('/').pop() || 'arquivo_principal.pdf',
          url: first.arquivo,
          file_type: 'main_pdf'
       };
       annexesList = api.arquivos.slice(1);
       console.log('📌 Primeiro anexo promovido a principal:', mainFileObj)
    } else {
       console.log('⚠️ Nenhum arquivo encontrado')
    }
    
    const mappedEdital = {
      ...api,
      id: api.id?.toString() || '',
      title: api.nome || 'Sem título',
      description: api.metadata?.descricao || '',
      status: (api.status?.toLowerCase() || 'draft') as any,
      numero: api.numero || '',
      tags: api.tags || [],
      metadata_count: api.metadata ? Object.keys(api.metadata).length : 0,
      files_count: (mainFileObj ? 1 : 0) + annexesList.length,
      metadata: api.metadata ? Object.entries(api.metadata).map(([key, value]: any, i:number) => ({
        id: `${api.id}-${i}`, key, value: String(value)
      })) : [],
      files: [
        ...(mainFileObj ? [mainFileObj] : []),
        ...annexesList.map((a: any, i: number) => ({ 
            id: a.id?.toString() || `${api.id}-${i}`, 
            name: a.nome || a.arquivo?.split('/').pop() || `anexo-${i}.pdf`, 
            url: a.arquivo || '', 
            file_type: 'annexe' 
        }))
      ]
    } as Edital
    
    console.log('✨ Edital mapeado:', mappedEdital)
    return mappedEdital
}

const loadEditais = async () => {
  isLoadingEditais.value = true
  try {
    const response = await editalService.getEditals()
    // Mapeia os dados da API para a estrutura esperada usando o helper padronizado
    editais.value = response.map(mapApiToEdital)
  } catch (error) {
    console.error('Erro ao carregar editais:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar editais'
    })
  } finally {
    isLoadingEditais.value = false
  }
}

const filteredEditais = computed(() => {
  let result = editais.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(e => 
      e.title.toLowerCase().includes(query) || 
      e.description.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(e => e.status === statusFilter.value)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredEditais.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const paginatedEditais = computed(() => {
  return filteredEditais.value.slice(startIndex.value, endIndex.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}


const openEditalModal = async (edital: any) => {
  try {
    const apiEdital: any = await editalService.getEdital(edital.id)
    
    // Mapear os dados da API para a estrutura local usando helper padronizado
    selectedEdital.value = mapApiToEdital(apiEdital)
    
    isEditModeInline.value = false // Reset mode
  } catch (error) {
    console.error('Erro ao carregar detalhes do edital:', error)
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao carregar detalhes do edital'
    })
  }
}

const closeEditalModal = () => {
  selectedEdital.value = null
  isEditModeInline.value = false
}

// Inline Edit Logic
const enterEditMode = () => {
  if (!selectedEdital.value) return
  
  // Helper: Garantir que metadata seja sempre array
  const getMetadataArray = () => {
    if (!selectedEdital.value?.metadata) return []
    if (Array.isArray(selectedEdital.value.metadata)) {
      return selectedEdital.value.metadata.map(m => ({ key: m.key, value: m.value }))
    }
    // Se metadata é objeto, converter para array
    return Object.entries(selectedEdital.value.metadata)
      .filter(([key]) => key !== 'descricao') // descricao já está em description
      .map(([key, value]) => ({ key, value: String(value) }))
  }
  
  editForm.value = {
    title: selectedEdital.value.title,
    description: selectedEdital.value.description,
    status: selectedEdital.value.status,
    tags: (selectedEdital.value as any).tags?.join(',') || '',
    numero: (selectedEdital.value as any).numero || '',
    mainPDF: null,
    newAnnexes: [],
    deletedAnnexIds: [],
    metadata: getMetadataArray()
  }
  isEditModeInline.value = true
}

const cancelEdit = () => {
  isEditModeInline.value = false
  // Resetar o formulário para os valores originais
  if (selectedEdital.value) {
    editForm.value = {
      title: selectedEdital.value.title,
      description: selectedEdital.value.description,
      status: selectedEdital.value.status,
      tags: (selectedEdital.value as any).tags?.join(',') || '',
      numero: (selectedEdital.value as any).numero || '',
      mainPDF: null,
      newAnnexes: [],
      deletedAnnexIds: [],
      metadata: []
    }
  }
}

const handleReplaceMain = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    editForm.value.mainPDF = { name: file.name, file: file }
  }
}

const handleInlineFileUpload = (event: Event) => {
  // Alias para adicionar novos anexos (múltiplos)
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach(file => {
        editForm.value.newAnnexes.push({ name: file.name, file: file })
    })
  }
}

const removeNewAnnex = (index: number) => {
    editForm.value.newAnnexes.splice(index, 1)
}

const markAnnexDeleted = (id: string) => {
    editForm.value.deletedAnnexIds.push(id)
}

const saveEditalInline = async () => {
  if (!selectedEdital.value) return
  
  console.log('💾 Iniciando salvamento do edital...')
  console.log('📋 Dados do formulário:', editForm.value)
  
  isSaving.value = true
  try {
    const formData: any = {
      title: editForm.value.title,
      description: editForm.value.description,
      status: editForm.value.status as any,
      numero: editForm.value.numero, 
      tags: editForm.value.tags,
      mainPDF: editForm.value.mainPDF, // Arquivo para upload
      dynamicFields: editForm.value.metadata.map(m => ({
        id: m.id || `temp-${Math.random()}`,
        key: m.key,
        value: m.value
      })),
      // TODO: Adicionar lógica de anexos extras aqui quando backend suportar
      // annexes: editForm.value.newAnnexes.map(a => a.file),
      // deletedAnnexes: editForm.value.deletedAnnexIds
      annexes: [], 
      results: []
    }
    
    console.log('📤 Enviando para API:', formData)
    console.log('🆔 ID do edital:', selectedEdital.value.id)
    
    // O service updateEdital foi atualizado para aceitar formData com mainPDF
    const updated = await editalService.updateEdital(selectedEdital.value.id, formData)
    
    console.log('✅ Resposta da API:', updated)
    
    // Atualiza a visualização local com os dados retornados
    const api = updated
    selectedEdital.value = {
       ...selectedEdital.value,
       title: api.nome || editForm.value.title,
       description: api.metadata?.descricao || editForm.value.description,
       status: (api.status?.toLowerCase() || 'draft') as any,
       numero: api.numero || editForm.value.numero,
       tags: api.tags || [],
       files: [
        ...(api.arquivo ? [{ id: `${api.id}-main`, name: api.arquivo.split('/').pop() || 'arquivo.pdf', url: api.arquivo, file_type: 'main_pdf' }] : []),
        ...(api.arquivos?.map((a: any, i: number) => ({ id: a.id?.toString() || `${api.id}-${i}`, name: a.nome || a.arquivo?.split('/').pop() || `anexo-${i}.pdf`, url: a.arquivo || '', file_type: 'annexe' })) || [])
      ]
    }
    
    // Atualiza a lista principal
    const index = editais.value.findIndex(e => e.id === selectedEdital.value?.id)
    if (index !== -1 && selectedEdital.value) {
       editais.value[index] = { ...selectedEdital.value }
    }
    
    uiStore.showToast({
      type: 'success',
      message: 'Edital atualizado com sucesso!'
    })
    isEditModeInline.value = false
  } catch (error) {
    console.error('❌ Erro ao salvar edital:', error)
    console.error('❌ Detalhes do erro:', JSON.stringify(error, null, 2))
    uiStore.showToast({
      type: 'error',
      message: 'Erro ao salvar alterações'
    })
  } finally {
    isSaving.value = false
  }
}

// Inline Edit State
const showDeleteConfirm = ref(false)

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const executeDelete = async () => {
  if (!selectedEdital.value) return
  
  try {
    await editalService.deleteEdital(selectedEdital.value.id)
    uiStore.showToast({ type: 'success', message: 'Edital excluído com sucesso' })
    closeEditalModal()
    await loadEditais() // Refresh list
  } catch (error) {
    console.error('Erro ao excluir:', error)
    uiStore.showToast({ type: 'error', message: 'Erro ao excluir edital' })
  }
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    open: 'success',
    aberto: 'success',
    closed: 'destructive',
    encerrado: 'destructive',
    analyzing: 'warning',
    em_andamento: 'warning',
    draft: 'default'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: 'Aberto',
    aberto: 'Aberto',
    closed: 'Fechado',
    encerrado: 'Fechado',
    analyzing: 'Em Análise',
    em_andamento: 'Em Análise',
    draft: 'Rascunho'
  }
  return labels[status] || status
}

const getFileTypeLabel = (fileType: string) => {
  const labels: Record<string, string> = {
    main_pdf: 'PDF Principal',
    annexe: 'Anexo',
    result: 'Resultado'
  }
  return labels[fileType] || fileType
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const handleLogout = () => {
  authStore.logout()
  uiStore.showToast({
    type: 'success',
    message: 'Logout realizado com sucesso',
  })
  router.push('/login')
}

onMounted(() => {
  loadEditais()
})
</script>

<style scoped>
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.glass-card {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-modal {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
