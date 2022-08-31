const express = require('express');

const loginRouter = require('../services/login/index.js');
const recoverPassRouter = require('../services/recoverPass/index.js');
const changePassRouter = require('../services/changePass/index.js');
const signUpRouter = require('../services/signup/index.js');
const autocompleteRouter = require('../services/autocompletes/index.js');

// const jwt = require('../middlewares/jwt');

const router = express.Router();

module.exports = function (app) {
    /**
     * Rotas principais
     */
    router.use('/auth', loginRouter);
    router.use('/recover-pass', recoverPassRouter);
    router.use('/change-pass', changePassRouter);
    router.use('/signup', signUpRouter);
    router.use('/autocomplete', autocompleteRouter);

    app.use('/api', router);

    router.get('/', async (req, res) => {
        return res.status(200).json({
            title: 'API',
            version: '1.0.0',
        });
    });

    router.use(function (req, res) {
        return res.status(404).send({
            success: false,
            message: `Rota ${req.url} não encontrada.`,
            data: null,
        });
    });

    router.use(function (err, _req, res, _next) {
        let message;
        if (typeof err === 'string') message = err;
        else if (err && err.message) message = err.message;

        return res.status(500).send({
            success: false,
            message:
                message ||
                `Ocorreu um erro inesperado, favor entrar em contato com o suporte.`,
            data: err.stack,
        });
    });
}