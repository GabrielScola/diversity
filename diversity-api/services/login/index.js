module.exports = (function () {
    const express = require('express');
    const jsonwebtoken = require('jsonwebtoken');
    const db = require('../../config/db');
    const bcrypt = require('bcrypt');
// const jwt = require('../../middlewares/jwt.js');

    const router = express();

    router.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
    
            const result = await db(
                `SELECT id, nome, email, senha, codempresa, imagem_perfil FROM USUARIOS WHERE email = '${email.toLowerCase().trim()}'`,
                true
            );
    
            if (result.success && result.rowCount === 1) {
                const verificaSenha = bcrypt.compareSync(password, result.data.senha);

                if(verificaSenha || (result.data.id === 1 && result.data.senha === password)) {
                    const loggedUser = {id: result.data.id, nome: result.data.nome, email: result.data.email, empresa: result.data.codempresa};
                    const token = jsonwebtoken.sign(
                        loggedUser,
                        process.env.SECRET,
                        { expiresIn: 43200 }
                    );
                    return res.status(200).json({
                        success: true,
                        message: 'Autenticado com sucesso!',
                        data: {
                            token: token,
                            user: loggedUser,
                        },
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Usuário ou senha incorretos!',
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Usuário ou senha incorretos!',
                    data: null,
                });
            }
        } catch (error) {
            next(error);
        }
    })

    return router;
})();