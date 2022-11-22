module.exports = (function () {
    const express = require('express');
    const repository = require('./user');
    const jwt  = require('../../middlewares/jwt');

    const router = express();

    router.get('/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            
            const response = await repository.findOne(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.get('/experiencia/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            
            const response = await repository.findExperiencia(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.get('/formacao/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            
            const response = await repository.findFormacao(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.get('/image/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            
            const response = await repository.findImage(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/update-avatar', async (req, res, next) => {
        try {
            const { id, newPic } = req.body;
            
            const response = await repository.updateAvatar(
                id,
                newPic
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/update-perfil', async (req, res, next) => {
        try {
            const {
                id,
                nome, 
                titulo,
                localizacao,
                telefone,
                endereco,
            } = req.body;
            
            const response = await repository.updatePerfil(   
                id,             
                nome,
                titulo,
                localizacao,
                telefone,
                endereco
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/add-experiencia', async (req, res, next) => {
        try {
            const {
                id,
                empresa,
                codprofissao,
                dt_inicio,
                dt_fim,
            } = req.body;
            
            const response = await repository.insertExperiencia(
                id,
                empresa,
                codprofissao,
                dt_inicio,
                dt_fim,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/add-formacao', async (req, res, next) => {
        try {
            const {
                id,
                instituicao,
                formacao,
                dt_inicio,
                dt_fim,
            } = req.body;
            
            const response = await repository.insertFormacao(
                id,
                instituicao,
                formacao,
                dt_inicio,
                dt_fim,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/delete-account/:ID', async (req, res, next) => {
        try {
            const {
                ID
            } = req.params;

            const response = await repository.deleteAccount(
                ID
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.put('/update-password', async (req, res, next) => {
        try {
            const {
                id,
                oldPass,
                newPass,
            } = req.body;
            
            const response = await repository.updatePass(
                id,
                oldPass,
                newPass,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/add-email', async (req, res, next) => {
        try {
            const {
                id,
                newEmail
            } = req.body;
            
            const response = await repository.insertEmail(
                id,
                newEmail
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/add-phone', async (req, res, next) => {
        try {
            const {
                id,
                newPhone
            } = req.body;
            
            const response = await repository.insertPhone(
                id,
                newPhone
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    return router;
})();