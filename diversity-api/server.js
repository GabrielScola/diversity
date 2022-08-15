require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { createServer } = require('http');

const { PORT, API_URL } = process.env;
const path = require('path');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

const router = require('./config/route');

app.use(cors());

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (_req, res) => {
    res.render('index.html', { API_URL });
});

// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'public')));

//Routes
router(app);

app.get('/*', (_req, res) => {
    res.render('index.html', { API_URL });
});

const server = createServer(app);
app.listen(PORT, () => console.log(`Server ON em: http://localhost:${PORT}`));

module.exports = server;