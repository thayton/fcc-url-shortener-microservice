require('./config/config');

const { mongoose } = require('./db/mongoose');
const port = process.env.PORT || 3000;

const { processRequest } = require('./util');
const { Url } = require('./models/url');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.post('/api/shorturl/:route(*)', (req, res) => {
    processRequest(req, res);
});

app.get('/api/shorturl/urls', (req, res) => {
    Url.find().then((urls) => {
        res.send({ urls });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

