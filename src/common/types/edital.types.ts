export interface DynamicField {
  id: string
  key: string
  value: string
}

export interface UploadedFile {
  id: string
  name: string
  displayName: string
  file?: File
  uploadedAt?: string
  size?: number
  url?: string
}

export interface EditalFormData {
  numero: string // ID do Edital (xx/xxxx)
  title: string
  description: string // Mapeia para 'metadata.description' ou similar, já que ItemConhecimento tem 'nome' (title) e 'metadata'
  tags: string // No form é string separada por vírgula
  status: 'open' | 'closed' | 'analyzing'
  mainPDF: UploadedFile | null
  dynamicFields: DynamicField[]
  annexes: UploadedFile[]
  results: UploadedFile[]
}

export interface EditalPayload {
  numero: string
  nome: string // Backend usa 'nome' herdado de ItemConhecimento

  status: string
  tags: string[]
  metadata: Record<string, string>
  files: {
    mainPDF: { name: string; originalName: string } | null
    annexes: Array<{ id: string; name: string; originalName: string }>
    results: Array<{ id: string; name: string; originalName: string }>
  }
}

export interface EditalResponse {
  id: number
  numero: string
  nome: string
  status: string
  tags: string[]
  metadata: Record<string, any>
  arquivo: string | null // Main PDF
  arquivos: Array<{ id: number; nome: string; arquivo: string }> // Anexos (Model Anexo)
  created_at?: string
  updated_at?: string
}
