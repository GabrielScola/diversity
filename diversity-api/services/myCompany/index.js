module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
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

    router.get('/:id', async (req, res, next) => {
        try {
            const {
                id
            } = req.params;

            const response = await repository.find(
                id,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.get('/admin/:id', async (req, res, next) => {
        try {
            const {
                id
            } = req.params;

            const response = await repository.findAdmin(
                id,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
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
                setor,
                site,
                tamanho,
                slogan,
            } = req.body;
            
            const response = await repository.updatePerfil(   
                id,
                nome, 
                setor,
                site,
                tamanho,
                slogan,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/admin/:id', async (req, res, next) => {
        try {
            const {
                id
            } = req.params;

            const response = await repository.removeAdmin(
                id,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/add-admin', async (req, res, next) => {
        try {
            const {
                id,
                codempresa
            } = req.body;

            const response = await repository.addAdmin(
                id,
                codempresa
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.delete('/delete-page/:id', async (req, res, next) => {
        try {
            const {
                id
            } = req.params;

            const response = await repository.deletePage(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/publish', async (req, res, next) => {
        try {
            const {
                id,
                texto
            } = req.body;

            const response = await repository.publish(
                id,
                texto
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.get('/posts/:id', async (req, res, next) => {
        try {
            const {
                id,
            } = req.params;

            const response = await repository.findPosts(
                id,
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.delete('/delete-post/:id', async (req, res, next) => {
        try {
            const {
                id
            } = req.params;

            const response = await repository.deletePost(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.put('/edit-post', async (req, res, next) => {
        try {
            const {
                id,
                texto
            } = req.body;

            const response = await repository.editPost(
                id,
                texto
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    return router;
})();