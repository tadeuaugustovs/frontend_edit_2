import type { Edital } from '../types/edital.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'

export const normalizeUrl = (url: string | null | undefined) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const cleanBase = API_BASE_URL.replace(/\/$/, '')
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    return `${cleanBase}${cleanPath}`
}

export const getStatusVariant = (status: string): 'success' | 'destructive' | 'warning' | 'default' => {
    const variants: Record<string, 'success' | 'destructive' | 'warning' | 'default'> = {
        open: 'success',
        aberto: 'success',
        closed: 'destructive',
        encerrado: 'destructive',
        analyzing: 'warning',
        em_andamento: 'warning',
        draft: 'default'
    }
    return variants[status.toLowerCase()] || 'default'
}

export const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        open: 'Aberto',
        aberto: 'Aberto',
        closed: 'Fechado',
        encerrado: 'Fechado',
        analyzing: 'Em Análise',
        em_andamento: 'Em Análise',
        draft: 'Rascunho'
    }
    return labels[status.toLowerCase()] || status
}

export const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-BR')
}

export const mapApiToEdital = (api: any): Edital => {
    let mainFileObj: any = null
    let annexesList: any[] = []

    const directMainUrl = api.arquivo
    if (directMainUrl) {
        mainFileObj = {
            id: `${api.id}-main`,
            name: directMainUrl.split('/').pop() || 'arquivo_principal',
            url: normalizeUrl(directMainUrl),
            file_type: 'main_pdf'
        }
        annexesList = api.arquivos || []
    } else if (api.arquivos && api.arquivos.length > 0) {
        const first = api.arquivos[0]
        mainFileObj = {
            id: first.id?.toString() || `${api.id}-main-promoted`,
            name: first.nome || first.arquivo?.split('/').pop() || 'arquivo_principal.pdf',
            url: normalizeUrl(first.arquivo),
            file_type: 'main_pdf'
        }
        annexesList = api.arquivos.slice(1)
    }

    return {
        ...api,
        id: api.id?.toString() || '',
        title: api.nome || 'Sem título',
        description: api.metadata?.descricao || '',
        status: (api.status?.toLowerCase() || 'draft') as any,
        numero: api.numero || '',
        tags: api.tags || [],
        metadata_count: api.metadata ? Object.keys(api.metadata).length : 0,
        files_count: (mainFileObj ? 1 : 0) + annexesList.length,
        metadata: api.metadata ? Object.entries(api.metadata).map(([key, value]: any, i: number) => ({
            id: `${api.id}-${i}`, key, value: String(value)
        })) : [],
        files: [
            ...(mainFileObj ? [mainFileObj] : []),
            ...annexesList.map((a: any, i: number) => ({
                id: a.id?.toString() || `${api.id}-${i}`,
                name: a.nome || a.arquivo?.split('/').pop() || `anexo-${i}.pdf`,
                url: normalizeUrl(a.arquivo),
                file_type: 'annexe'
            }))
        ]
    }
}
