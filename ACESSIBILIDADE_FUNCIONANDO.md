# ✅ Menu de Acessibilidade Funcionando

## Como Funciona

### 🌓 Modo Escuro vs Contraste

O sistema agora separa completamente duas funcionalidades:

#### 1. **Tema (Claro/Escuro/Auto)**
- **O que faz**: Muda as CORES do site
- **Modo Claro**: Fundo branco, texto preto
- **Modo Escuro**: Fundo escuro (#0f172a), texto claro (#f1f5f9)
- **Auto**: Segue a preferência do sistema operacional

**Implementação**:
- Adiciona/remove a classe `dark` no elemento `<html>`
- CSS aplica cores diferentes quando `.dark` está presente
- Não usa filtros CSS

#### 2. **Contraste (Normal/Alto/Máximo)**
- **O que faz**: Intensifica as cores EXISTENTES usando filtros CSS
- **Normal**: Sem filtros (`filter: none`)
- **Alto**: Aumenta contraste e saturação (`filter: contrast(125%) saturate(110%)`)
- **Máximo**: Preto e branco + alto contraste (`filter: grayscale(100%) contrast(150%)`)

**Implementação**:
- Adiciona classe `contrast-normal`, `contrast-high` ou `contrast-maximum` no `<html>`
- CSS aplica filtros que afetam TODO o site
- Funciona tanto no modo claro quanto escuro

### 📏 Tamanho da Fonte

Muda o tamanho base da fonte no elemento `<html>`:
- **Pequena**: 14px
- **Normal**: 16px
- **Grande**: 18px
- **Extra**: 20px

### ⚙️ Opções Adicionais

1. **Reduzir Movimento**: Desativa animações CSS
2. **Indicadores de Foco**: Aumenta o outline dos elementos focados
3. **Otimizar para Leitor de Tela**: Adiciona melhorias de acessibilidade

## Estrutura de Arquivos

```
src/
├── common/
│   ├── components/
│   │   └── AccessibilityMenu.vue       # Menu visual
│   ├── composables/
│   │   └── useAccessibility.ts         # Lógica e estado
│   ├── styles/
│   │   └── accessibility.css           # Estilos de contraste e reduce-motion
│   └── assets/styles/
│       └── main.css                    # Estilos de modo escuro
└── App.vue                             # Inicializa as configurações
```

## Como Usar

### No Código

```typescript
import { useAccessibility } from '@/common/composables/useAccessibility'

const { settings, setTheme, setContrast, setFontSize } = useAccessibility()

// Mudar tema
setTheme('dark')

// Mudar contraste
setContrast('high')

// Mudar tamanho da fonte
setFontSize('large')
```

### No Template

```vue
<template>
  <AccessibilityMenu />
</template>

<script setup>
import AccessibilityMenu from '@/common/components/AccessibilityMenu.vue'
</script>
```

## Persistência

Todas as configurações são salvas automaticamente no `localStorage`:
- Chave: `accessibility-settings`
- Formato: JSON
- Carregadas automaticamente ao abrir o site

## Testando

1. **Modo Escuro**:
   - Clique no botão "Escuro"
   - O fundo deve ficar escuro e o texto claro
   - Todos os cards e elementos devem ter cores escuras

2. **Contraste**:
   - Com o site no modo claro, clique em "Alto"
   - As cores devem ficar mais intensas (não muda claro/escuro)
   - Clique em "Máximo" para ver preto e branco

3. **Combinação**:
   - Ative "Modo Escuro" + "Contraste Alto"
   - O site deve ficar escuro COM contraste intensificado

4. **Tamanho da Fonte**:
   - Clique em "Grande" ou "Extra"
   - Todo o texto do site deve aumentar proporcionalmente

## Debug

Abra o console do navegador e veja os logs:
```
🎨 Applying theme: dark
  → Manual mode, dark: true
  → HTML classes: dark contrast-normal

🎨 Applying contrast: high
  → HTML classes: dark contrast-high
  → Filter applied: contrast(125%) saturate(110%)
```

## Classes CSS Aplicadas

### No elemento `<html>`:
- `dark` - Modo escuro ativo
- `contrast-normal` - Contraste normal
- `contrast-high` - Alto contraste
- `contrast-maximum` - Contraste máximo
- `reduce-motion` - Animações desativadas
- `enhanced-focus` - Indicadores de foco aumentados
- `screen-reader-optimized` - Otimizado para leitores de tela

## Troubleshooting

### Problema: Modo escuro não funciona
- Verifique se a classe `dark` está no `<html>` (inspecione o elemento)
- Verifique se o Tailwind está configurado com `darkMode: 'class'`
- Limpe o cache do navegador

### Problema: Contraste não muda nada
- Abra o DevTools e inspecione o elemento `<html>`
- Verifique se a propriedade `filter` está aplicada
- Teste em outro navegador (alguns navegadores antigos não suportam filtros CSS)

### Problema: Configurações não persistem
- Verifique o localStorage no DevTools (Application > Local Storage)
- Procure pela chave `accessibility-settings`
- Se não existir, pode haver um erro no JavaScript (veja o console)
