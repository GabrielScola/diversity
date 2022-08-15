module.exports = (function () {
    const express = require('express');
    const jsonwebtoken = require('jsonwebtoken');
    const db = require('../../config/db');
// const jwt = require('../../middlewares/jwt.js');

    const router = express();

    router.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
    
            const result = await db(
                `SELECT id, nome, email FROM USUARIOS WHERE email = '${email.toLowerCase().trim()}' AND senha = '${password}'`,
                true
            );
    
            if (result.success && result.rowCount === 1) {
                const loggedUser = result.data;
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
        } catch (error) {
            next(error);
        }
    })

    return router;
})();