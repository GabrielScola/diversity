module.exports = (function () {
    const express = require('express');
    const repository = require('./recoverPass');

    const router = express();

    router.post('/', async (req, res, next) => {
        try {
            const { email } = req.body;
            
            const response = await repository.find(email);

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    })

    return router;
})();