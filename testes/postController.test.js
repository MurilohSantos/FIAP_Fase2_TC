const request = require('supertest');
const app = require('../app.js');
const { response } = require('express');

describe('Teste integrado', () => {

    it('Criar um novo post', async () => {
       const postData = {materia: 'Historia', assunto: 'Como surgir os palavroes', descricao: 'A historia comecando quando os barbaros na decada de XIV .....', habilitado: 1};
       const response = await request(app).post('/api/posts').send(postData);
       expect(response.statusCode).toBe(201);
       expect(response.body).toEqual(expect.objectContaining(postData));
       expect(response.body).toHaveProperty('id');

    
    });

    it('deve retornar todos os posts', async () => {
        const response = await request(app).get('/api/posts');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

});
