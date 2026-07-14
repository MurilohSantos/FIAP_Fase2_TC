const db = require('../db');

exports.getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.query('SELECT * FROM posts');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    console.log('Entrou na rota getPostById');
    console.log('ID recebido:', req.params.id);

    try {
        const connection = await db.getConnection();

        const [posts] = await connection.query(
            'SELECT * FROM posts WHERE id = ?',
            [req.params.id]
        );

        connection.release();

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(posts[0]);

    } catch (err) {
        console.error('Erro SQL:', err);
        res.status(500).json({ message: err.message });
    }
};


exports.createPost = async (req, res) => {
    const { materia, assunto, descricao, habilitado } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO posts (materia, assunto, descricao, habilitado) VALUES (?, ?, ?, ?)',
            [materia, assunto, descricao, habilitado]
        );

        res.status(201).json({
            id: result.insertId,
            materia,
            assunto,
            descricao,
            habilitado
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.updatePost = async (req, res) => {
    const { materia, assunto, descricao, habilitado } = req.body;

    try {
        const [result] = await db.execute(
            'UPDATE posts SET materia = ?, assunto = ?, descricao = ?, habilitado = ? WHERE id = ?',
            [
                materia,
                assunto,
                descricao,
                habilitado,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            id: req.params.id,
            materia,
            assunto,
            descricao,
            habilitado
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.deletePost = async (req, res) => {
    console.log('Entrou na rota deletePost');
    console.log('ID recebido:', req.params.id);

    try {
        const [result] = await db.execute(
            'DELETE FROM posts WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            message: 'Post ' + req.params.id + ' deletado com sucesso'
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.searchPostByAssunto = async (req, res) => {
    console.log('Entrou na busca por assunto');

    try {
        const { assunto } = req.query;

        if (!assunto) {
            return res.status(400).json({
                message: 'Informe um assunto para pesquisa'
            });
        }

        const connection = await db.getConnection();

        const [posts] = await connection.query(
            'SELECT * FROM posts WHERE assunto LIKE ?',
            [`%${assunto}%`]
        );

        connection.release();

        res.status(200).json(posts);

    } catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ message: err.message });
    }
};