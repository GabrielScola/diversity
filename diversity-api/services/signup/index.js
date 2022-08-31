module.exports = (function () {
    const express = require('express');
    const repository = require('./signup');

    const router = express();

    router.post('/check-email', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            
            const response = await repository.sendEmail(
                email, 
                password
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/check-phone', async (req, res, next) => {
        try {
            const { countryCode, phoneNumber } = req.body;

            const response = await repository.sendSMS(
                countryCode,
                phoneNumber
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/register', async (req, res, next) => {
        try {
            const {
                email,
                password,
                nome,
                sobrenome,
                lgbt,
                negros,
                pcd,
                countryCode,
                phoneNumber,
                city,
                cargo,
                empresa,
                dia,
                mes,
                image,
                alerta_cargo,
                alerta_local
            } = req.body;

            const response = await repository.register(
                email,
                password,
                nome,
                sobrenome,
                lgbt,
                negros,
                pcd,
                countryCode,
                phoneNumber,
                city,
                cargo,
                empresa,
                dia,
                mes,
                image,
                alerta_cargo,
                alerta_local
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();