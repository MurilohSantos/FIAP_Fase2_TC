require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.locals.db = pool;

app.listen(PORT, async () => {
    try {
        const conn = await pool.getConnection();
        console.log('MySQL conectado!');
        conn.release();

        console.log(`Servidor rodando na porta ${PORT}`);
    } catch (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
    }
});