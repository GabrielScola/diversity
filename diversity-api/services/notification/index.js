module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./notification');

    const router = express();

    router.post('/', async (req, res, next) => {
        try {
            const {
                id,
                tipo           
            } = req.body;

            const response = await repository.insert(
                id,
                tipo
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.get('/:ID', async (req, res, next) => {
        try {
            const {
                ID,
            } = req.params;

            const response = await repository.find(
                ID,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.put('/', async (req, res, next) => {
        try {
            const {
                codusuario,
                codnotificacao
            } = req.body;

            const response = await repository.update(
                codusuario,
                codnotificacao
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();