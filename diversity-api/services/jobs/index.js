module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./jobs');

    const router = express();

    router.post('/filter', async (req, res, next) => {
        try {

            const response = await repository.find();

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/apply', async (req, res, next) => {
        try {
            const {
                id,
                codvaga,
                email,
                cargo,
                pergunta,
                resposta
            } = req.body;

            const response = await repository.apply(
                id,
                codvaga,
                email,
                cargo,
                pergunta,
                resposta,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/register', async (req, res, next) => {
        try {
            const {
                cargo,
                horas,
                presencial,
                grupo,
                local,
                descricao,
                responsavel,
                pergunta,
                codempresa,
                
            } = req.body;

            const response = await repository.register(
                cargo,
                horas,
                presencial,
                grupo,
                local,
                descricao,
                responsavel,
                pergunta,
                codempresa
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.get('/user-jobs/:ID', async (req, res, next) => {
        try {
            const {
                ID                
            } = req.params;

            console.log(req.params)

            const response = await repository.findUserJobs(
                ID
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.get('/company-jobs/:ID', async (req, res, next) => {
        try {
            const {
                ID                
            } = req.params;

            console.log(req.params)

            const response = await repository.findCompanyJobs(
                ID
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.delete('/:ID', async (req, res, next) => {
        try {
            const {
                ID                
            } = req.params;

            console.log(req.params)

            const response = await repository.removeJob(
                ID
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();