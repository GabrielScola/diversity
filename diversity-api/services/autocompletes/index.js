module.exports = (function () {
    const express = require('express');
    const repository = require('./autocompletes');

    const router = express();

    router.post('/city', async (req, res, next) => {
        try {
            const response = await repository.city();

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    })

    router.post('/jobs', async (req, res, next) => {
        try {
            const response = await repository.jobs();

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    })

    router.post('/add-admins', async (req, res, next) => {
        try {
            const response = await repository.addAdmins();

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    })

    return router;
})();