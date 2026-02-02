
import { describe, it, expect } from 'vitest';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Configuração do Cliente para bater no Fake Backend
const API_URL = 'http://localhost:8001';
const client = axios.create({ baseURL: API_URL });

describe('Edital Registration Integration (Fake Backend)', () => {

    it('should authenticate correctly', async () => {
        const response = await client.post('/core/api-token-auth/', {
            username: 'root8',
            password: 'root8'
        });
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');

        // Define token globalmente para as próximas requisições
        client.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
    });

    it('should create a new Edital (POST /edital/edital/)', async () => {
        const form = new FormData();

        // Dados obrigatórios conforme Swagger
        form.append('numero', '99/2025');
        form.append('status', 'ABERTO');
        form.append('nome', 'Edital de Teste Automatizado');

        // Simular arquivo (se houver, mas vamos testar o JSON/Form básico primeiro)
        // O Endpoint espera multipart/form-data conforme nossa análise do Swagger

        // Metadata (JSON stringified se for form-data misto, ou campos soltos)
        // O Mock Server espera o que definimos no index.js

        const response = await client.post('/edital/edital/', {
            numero: "99/2025",
            status: "ABERTO",
            nome: "Edital via Teste",
            tags: ["teste", "api"],
            metadata: { descricao: "Teste de integração vitest" }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        expect(response.status).toBe(201);
        expect(response.data.numero).toBe('99/2025');
    });

    it('should list the created Edital', async () => {
        const response = await client.get('/edital/edital/');
        expect(response.status).toBe(200);
        expect(response.data.results).toBeInstanceOf(Array);
        // O Mock Server pode retornar mocks estáticos + o que acabamos de criar se implementarmos persistência em memória
        // Como o Mock atual é stateless (ou simples), vamos verificar se a estrutura bate
        expect(response.data.results.length).toBeGreaterThan(0);
        const item = response.data.results[0];
        expect(item).toHaveProperty('numero');
        expect(item).toHaveProperty('status');
    });
});
