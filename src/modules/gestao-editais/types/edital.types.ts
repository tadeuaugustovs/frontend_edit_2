export interface Edital {
    id: string
    title: string
    description: string
    status: 'open' | 'closed' | 'analyzing' | 'draft'
    numero?: string
    tags?: string[]
    created_at: string
    updated_at: string
    metadata_count: number
    files_count: number
    metadata: Array<{ id: string; key: string; value: string }>
    files: Array<{ id: string; name: string; url: string; file_type: string }>
}

export interface EditalFormData {
    title: string
    description: string
    status: 'open' | 'closed' | 'analyzing' | 'draft'
    numero: string
    tags: string
    mainPDF: { name: string; file: File } | null
    newAnnexes: Array<{ name: string; file: File }>
    deletedAnnexIds: string[]
    metadata: Array<{ id?: string; key: string; value: string }>
}
