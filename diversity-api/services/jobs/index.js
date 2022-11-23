module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./jobs');

    const router = express();

    router.post('/filter', async (req, res, next) => {
        try {
            const {
                cargo,
                local,
                negro,
                lgbt,
                pcd
            } = req.body;

            const response = await repository.find(
                cargo,
                local,
                negro,
                lgbt,
                pcd
            );

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

    router.get('/candidatos/:CODVAGA', async (req, res, next) => {
        try {
            const {
                CODVAGA
            } = req.params;

            console.log(req.params)

            const response = await repository.findCandidatos(
                CODVAGA
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

    router.put('/update-alert', async (req, res, next) => {
        try {
            const {
                id,
                profissao,
                local
            } = req.body;
            
            const response = await repository.updateAlert(
                id,
                profissao,
                local
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/notify', async (req, res, next) => {
        try {
            const {
                cargo,
                local
            } = req.body;

            const response = await repository.notify(
                cargo,
                local
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();