module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./network');

    const router = express();

    router.post('/following', async (req, res, next) => {
        try {
            const {
                id          
            } = req.body;

            const response = await repository.findFollowing(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/followers', async (req, res, next) => {
        try {
            const {
                id          
            } = req.body;

            const response = await repository.findFollowers(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();