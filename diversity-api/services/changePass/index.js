module.exports = (function () {
    const express = require('express');
    const repository = require('./changePass');

    const router = express();

    router.post('/', async (req, res, next) => {
        try {
            const { ID, PASSWORD } = req.body;
            
            const response = await repository.update(
                ID, 
                PASSWORD
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    return router;
})();