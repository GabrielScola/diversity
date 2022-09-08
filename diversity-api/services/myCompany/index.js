// const jwt  = require('../../middlewares/jwt');

module.exports = (function () {
    const express = require('express');
    const repository = require('./myCompany');

    const router = express();

    router.post('/register', async (req, res, next) => {
        try {
            const {
                nome,
                site,
                setor,
                tamanho,
                logo,
                slogan
            } = req.body;

            const response = await repository.register(
                nome,
                site,
                setor,
                tamanho,
                logo,
                slogan
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();