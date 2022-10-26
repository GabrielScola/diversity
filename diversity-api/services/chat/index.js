module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./chat');

    const router = express();

    router.post('/list', async (req, res, next) => {
        try {
            const {
                userId           
            } = req.body;

            const response = await repository.findList(
                userId,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/messages', async (req, res, next) => {
        try {
            const {
                remetente,
                destinatario,             
            } = req.body;

            const response = await repository.find(
                remetente,
                destinatario,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/send', async (req, res, next) => {
        try {
            const {
                remetente,
                destinatario,
                mensagem,                
            } = req.body;

            const response = await repository.insert(
                remetente,
                destinatario,
                mensagem, 
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();