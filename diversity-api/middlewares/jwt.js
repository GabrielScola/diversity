const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { secret } = process.env;
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);

    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (!token)
        return res.status(401).send({
            success: false,
            message: 'No token provided.',
        });

    jwt.verify(token, secret, async function (err, decoded) {
        if (err)
            return res.status(401).send({
                success: false,
                message: 'Failed to authenticate token.',
            });

        req.user = {
            ... decoded ,
            Ip: req.ipInfo,
        };

        next();
    });
};