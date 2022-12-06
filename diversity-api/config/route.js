const express = require('express');

const loginRouter = require('../services/login/index.js');
const recoverPassRouter = require('../services/recoverPass/index.js');
const changePassRouter = require('../services/changePass/index.js');
const signUpRouter = require('../services/signup/index.js');
const autocompleteRouter = require('../services/autocompletes/index.js');
const myCompanyRouter = require('../services/myCompany/index.js');
const userRouter = require('../services/user/index.js');
const jobsRouter = require('../services/jobs/index.js');
const chatRouter = require('../services/chat/index.js');
const notificationRouter = require('../services/notification/index.js');
const homeRouter = require('../services/home/index.js');
const networkRouter = require('../services/network/index.js');

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
    router.use('/my-company', myCompanyRouter);
    router.use('/user', userRouter);
    router.use('/jobs', jobsRouter);
    router.use('/chat', chatRouter);
    router.use('/notification', notificationRouter);
    router.use('/home', homeRouter);
    router.use('/network', networkRouter);

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