require('dotenv').config();
const express = require("express");
const cors = require('cors');
const db = require('./config/db');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('./middlewares/jwt');

const { PORT, SECRET } = process.env;
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await db(
            `SELECT id, nome, email 
               FROM USUARIOS
              WHERE email = '${email}'
                AND senha = '${password}'
              LIMIT 1`,
            true
        );

        if (result.success && result.rowCount === 1) {
            const loggedUser = result.data;
            const token = jsonwebtoken.sign(
                loggedUser,
                SECRET,
                { expiresIn: 43200 }
            );

            return res.status(200).json({
                success: true,
                message: 'Autenticado com sucesso!',
                data: {
                    token: token,
                    user: loggedUser,
                },
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Usuário ou senha incorretos!',
                data: null,
            });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/', jwt, (req, res) => {
    return res.json({ message: "Autenticado" });
})

app.listen(PORT, () => console.log(`Server ON em: http://localhost:${PORT}`));