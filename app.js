
const express = require('express');
const mysql = require('mysql2/promise');
const postRoutes = require('./routes/postRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Disponibiliza a conexão para as rotas
app.locals.db = pool;

app.use(express.json());

app.use('/api/posts', postRoutes);

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

module.exports = app;


/*
const express = require('express');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(express.json());
app.use('/api/posts', postRoutes);

module.exports = app;
*/