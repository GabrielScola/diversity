module.exports = (function () {
    const jwt  = require('../../middlewares/jwt');
    const express = require('express');
    const repository = require('./home');

    const router = express();

    router.post('/find', async (req, res, next) => {
        try {
            const {
                id          
            } = req.body;

            const response = await repository.find(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/recomendation', async (req, res, next) => {
        try {
            const {
                id          
            } = req.body;

            const response = await repository.recomendation(
                id
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.post('/follow', async (req, res, next) => {
        try {
            const {
                idUsuario,
                idFollower        
            } = req.body;

            const response = await repository.follow(                
                idUsuario,
                idFollower
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.delete('/unfollow', async (req, res, next) => {
        try {
            const {
                idUsuario,
                idFollower        
            } = req.body;

            const response = await repository.unfollow(                
                idUsuario,
                idFollower
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
                publicacao,
                anexo    
            } = req.body;

            const response = await repository.publish(                
                id,
                publicacao,
                anexo
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.put('/edit-post', async (req, res, next) => {
        try {
            const {
                codpublicacao,
                descricao
            } = req.body;

            const response = await repository.editPost(
                codpublicacao,
                descricao
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });

    router.delete('/delete-post/:codpublicacao', async (req, res, next) => {
        try {
            const {
                codpublicacao
            } = req.params;

            const response = await repository.deletePost(
                codpublicacao
            );

            return res.status(response.success ? 200 : 500).json(response);
        } catch (error) {
            next(error)
        }
    });


    return router;
})();