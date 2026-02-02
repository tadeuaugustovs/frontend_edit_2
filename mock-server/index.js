
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8001; // Changed to 8001 to avoid conflict

app.use(cors());
app.use(bodyParser.json());

// Load Contracts
const editalSwagger = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../contracts/edital/swagger.json'), 'utf-8'));
const coreSwagger = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../contracts/core/swagger.json'), 'utf-8'));

console.log('📦 Loaded Contracts:');
console.log(' - Edital Module');
console.log(' - Core Module');

// helper
const createMockFromSchema = (schema) => {
    if (!schema) return {};
    const props = schema.properties || {};
    const obj = {};
    for (const [key, value] of Object.entries(props)) {
        if (value.type === 'string') obj[key] = "mock_string";
        if (value.type === 'integer') obj[key] = 1;
        if (value.type === 'array') obj[key] = [];
        if (value.format === 'date-time') obj[key] = new Date().toISOString();
        if (value.enum) obj[key] = value.enum[0];
    }
    return obj;
};

// --- MOCKED ROUTES ---

// Auth
// Auth - Alias common paths
const authHandler = (req, res) => {
    console.log('🔐 Login Request:', req.body);
    const { username, password } = req.body;

    if (username === 'root8' && password === 'root8') {
        return res.json({ token: 'mock-root8-token-jwt' });
    }

    return res.status(401).json({ error: 'Unauthorized. Please use username: root8 / password: root8' });
};

app.post('/core/api-token-auth/', authHandler);
app.post('/api-token-auth/', authHandler);
app.post('/api/auth/login/', authHandler);

// User Profile
app.get('/api/auth/me/', (req, res) => {
    console.log('👤 Get Current User');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Token ')) {
        return res.status(401).json({ error: 'Authentication credentials were not provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (token === 'mock-root8-token-jwt') {
        return res.json({
            id: 8,
            username: 'root8',
            email: 'root8@fapes.br',
            first_name: 'Root',
            last_name: 'Administrator'
        });
    }

    return res.status(403).json({ error: 'Invalid token.' });
});

// Edital List
app.get('/edital/edital/', (req, res) => {
    console.log('📄 Get Editais');

    const results = [
        {
            id: 1,
            numero: '01/2024',
            nome: 'Edital de Inovação Tecnológica 2024',
            status: 'ABERTO',
            tags: ['inovação', 'startup', 'tecnologia'],
            metadata: {
                descricao: 'Este edital visa apoiar startups em fase inicial com recursos para pesquisa e desenvolvimento.',
                prazo: '31/12/2024',
                valor_total: 'R$ 5.000.000,00'
            },
            arquivo: '/media/editais/edital-invo-2024.pdf',
            arquivos: [
                { id: 101, nome: 'Anexo I - Formulário', arquivo: '/media/anexos/form-v1.docx' },
                { id: 102, nome: 'Anexo II - Cronograma', arquivo: '/media/anexos/cronograma.xlsx' }
            ],
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-15T14:30:00Z'
        },
        {
            id: 2,
            numero: '02/2024',
            nome: 'Programa de Apoio à Pesquisa Científica',
            status: 'ENCERRADO',
            tags: ['ciência', 'academia', 'pesquisa'],
            metadata: {
                descricao: 'Fomento a projetos de pesquisa em universidades estaduais.',
                prazo: '01/06/2024'
            },
            arquivo: '/media/editais/pesquisa-2024.pdf',
            arquivos: [],
            created_at: '2024-02-10T09:00:00Z',
            updated_at: '2024-02-20T11:00:00Z'
        },
        {
            id: 3,
            numero: '03/2024',
            nome: 'Chamada Pública para Projetos de Extensão',
            status: 'EM_ANDAMENTO',
            tags: ['comunidade', 'extensão', 'social'],
            metadata: {
                descricao: 'Seleção de projetos voltados para o impacto social na região metropolitana.',
                impacto_estimado: '10.000 pessoas'
            },
            arquivo: null,
            arquivos: [
                { id: 301, nome: 'Guia do Candidato', arquivo: '/media/anexos/guia.pdf' }
            ],
            created_at: '2024-03-05T08:00:00Z',
            updated_at: '2024-03-05T08:00:00Z'
        }
    ];

    res.json({
        meta: {
            current_page: 1,
            per_page: 10,
            max_per_page: 50,
            total: results.length
        },
        data: results
    });
});

// Edital Detail
app.get('/edital/edital/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    const results = [
        {
            id: 1,
            numero: '01/2024',
            nome: 'Edital de Inovação Tecnológica 2024',
            status: 'ABERTO',
            tags: ['inovação', 'startup', 'tecnologia'],
            metadata: {
                descricao: 'Este edital visa apoiar startups em fase inicial com recursos para pesquisa e desenvolvimento.',
                prazo: '31/12/2024',
                valor_total: 'R$ 5.000.000,00'
            },
            arquivo: '/media/editais/edital-invo-2024.pdf',
            arquivos: [
                { id: 101, nome: 'Anexo I - Formulário', arquivo: '/media/anexos/form-v1.docx' },
                { id: 102, nome: 'Anexo II - Cronograma', arquivo: '/media/anexos/cronograma.xlsx' }
            ]
        },
        {
            id: 2,
            numero: '02/2024',
            nome: 'Programa de Apoio à Pesquisa Científica',
            status: 'ENCERRADO',
            tags: ['ciência', 'academia', 'pesquisa'],
            metadata: {
                descricao: 'Fomento a projetos de pesquisa em universidades estaduais.',
                prazo: '01/06/2024'
            },
            arquivo: '/media/editais/pesquisa-2024.pdf',
            arquivos: []
        },
        {
            id: 3,
            numero: '03/2024',
            nome: 'Chamada Pública para Projetos de Extensão',
            status: 'EM_ANDAMENTO',
            tags: ['comunidade', 'extensão', 'social'],
            metadata: {
                descricao: 'Seleção de projetos voltados para o impacto social na região metropolitana.',
                impacto_estimado: '10.000 pessoas'
            },
            arquivo: null,
            arquivos: [
                { id: 301, nome: 'Guia do Candidato', arquivo: '/media/anexos/guia.pdf' }
            ]
        }
    ];

    const edital = results.find(e => e.id === id) || results[0];
    res.json(edital);
});

app.post('/edital/edital/', (req, res) => {
    console.log('📝 Create Edital:', req.body);
    res.status(201).json(req.body);
});

// Start
app.listen(PORT, () => {
    console.log(`\n🚀 Fake Backend running at http://localhost:${PORT}`);
    console.log(`   - Auth: POST /core/api-token-auth/`);
    console.log(`   - Editais: GET /edital/edital/`);
});
