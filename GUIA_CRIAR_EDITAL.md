# 📝 Guia: Como Criar Editais pelo Frontend

## ✅ Pré-requisitos

Certifique-se de que ambos os servidores estão rodando:

1. **Backend Django:** http://localhost:8002
2. **Frontend Vue.js:** http://localhost:5173

## 🚀 Passo a Passo

### 1. Fazer Login

1. Acesse http://localhost:5173
2. Faça login com:
   - **Username:** `admin`
   - **Password:** `admin123`

### 2. Acessar Gestão de Editais

1. Na página inicial, clique em **"Gestão de Editais"**
2. Ou acesse diretamente: http://localhost:5173/gestao-editais

### 3. Preencher o Formulário

#### Campos Obrigatórios:

1. **Título** 
   - Exemplo: "Edital de Chamada Pública nº 001/2024"
   
2. **Descrição**
   - Exemplo: "Edital para seleção de projetos de pesquisa em tecnologia"
   
3. **Status**
   - Opções: Aberto, Fechado, Em Análise

#### Campos Dinâmicos (Opcional):

Clique em **"+ Adicionar Campo"** para adicionar metadados personalizados:
- **Chave:** área
- **Valor:** Tecnologia

Exemplos de campos dinâmicos:
- `area` → `Tecnologia`
- `valor` → `R$ 100.000,00`
- `prazo` → `30/12/2024`
- `modalidade` → `Pesquisa Aplicada`

#### Arquivos (Opcional):

1. **PDF Principal**
   - Clique na aba "PDF Principal"
   - Arraste ou selecione o arquivo principal do edital

2. **Anexos**
   - Clique na aba "Anexos"
   - Adicione documentos complementares

3. **Resultados**
   - Clique na aba "Resultados"
   - Adicione documentos de resultados

### 4. Criar o Edital

1. Revise os dados no **"Preview do Payload JSON"** (opcional)
2. Clique em **"Criar Edital"**
3. Aguarde a confirmação de sucesso ✅

### 5. Verificar no Django Admin

1. Acesse http://localhost:8002/admin/
2. Login: `admin` / `admin123`
3. Vá para **"Editals"** → **"Editals"**
4. Veja o edital que você acabou de criar! 🎉

## 📊 Exemplo de Edital

```json
{
  "title": "Edital FAPES 2024 - Tecnologia",
  "description": "Chamada pública para projetos de inovação tecnológica",
  "status": "open",
  "metadata": [
    {
      "key": "area",
      "value": "Tecnologia da Informação"
    },
    {
      "key": "valor_total",
      "value": "R$ 500.000,00"
    },
    {
      "key": "prazo_submissao",
      "value": "31/03/2024"
    }
  ],
  "files": [
    {
      "file_type": "main_pdf",
      "name": "edital_principal.pdf",
      "original_name": "edital_fapes_001_2024.pdf"
    }
  ]
}
```

## 🔍 Verificando os Editais Criados

### Via Frontend

1. Vá para a página inicial (http://localhost:5173)
2. Os editais criados aparecerão na lista

### Via Django Admin

1. Acesse http://localhost:8002/admin/editals/edital/
2. Veja todos os editais com seus metadados e arquivos

### Via API (cURL)

```bash
# 1. Fazer login e pegar o token
TOKEN=$(curl -X POST "http://localhost:8002/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  | jq -r '.access')

# 2. Listar editais
curl -X GET "http://localhost:8002/api/editals/" \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

## 🎯 Fluxo Completo

```
Frontend (Vue.js)
    ↓
    ↓ POST /api/editals/
    ↓
Django Backend
    ↓
    ↓ Salva no banco
    ↓
SQLite Database
    ↓
    ↓ Visível em
    ↓
Django Admin Panel
```

## 🐛 Troubleshooting

### Erro ao criar edital

1. **Verifique se está logado**
   - O token JWT deve estar válido
   - Faça logout e login novamente se necessário

2. **Verifique o console do navegador**
   - Pressione F12 → Console
   - Veja os logs de erro

3. **Verifique os logs do Django**
   - Veja o terminal onde o Django está rodando
   - Procure por erros 400/500

### Campos obrigatórios

- Título: não pode estar vazio
- Descrição: não pode estar vazia
- Status: deve ser 'open', 'closed' ou 'analyzing'

### Arquivos não aparecem

- Por enquanto, os arquivos são salvos apenas como referências (metadata)
- O upload real de arquivos será implementado em uma próxima etapa
- Os nomes dos arquivos são salvos no banco de dados

## 📝 Notas Importantes

1. **Autenticação JWT**
   - Todos os requests precisam do token Bearer
   - O token expira após 1 hora
   - O refresh token é válido por 7 dias

2. **CORS**
   - O backend está configurado para aceitar requests do localhost:5173
   - Não é necessário configuração adicional

3. **Validação**
   - O frontend valida os campos antes de enviar
   - O backend também valida os dados recebidos

4. **Metadados Dinâmicos**
   - Você pode adicionar quantos campos quiser
   - Cada campo tem uma chave e um valor
   - São salvos na tabela `EditalMetadata`

## 🎉 Sucesso!

Agora você pode criar editais pelo frontend e eles serão salvos automaticamente no Django backend! 

Os editais criados ficam disponíveis:
- ✅ No Django Admin Panel
- ✅ Na API REST
- ✅ No banco de dados SQLite
- ✅ Para consulta pelo frontend

---

**Desenvolvido para FAPES** 🚀
