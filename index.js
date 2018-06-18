require('./config/config');

const { mongoose } = require('./db/mongoose');
const port = process.env.PORT || 3000;

const { processRequest } = require('./util');
const { Url } = require('./models/url');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/shorturl/new', (req, res) => {
    processRequest(req, res);
});

app.get('/api/shorturl/:shortened_url([a-zA-Z0-9]+)', (req, res) => {
    Url.findOne({ shortened: req.params.shortened_url }).then((url) => {
        if (url === null) {
            return res.status(404).send({
                'error': 'URL not found'
            });            
        }

        res.redirect(url.original);
    }).catch((e) => {
        console.log('Error - ', e);        
        res.status(400).send({e});
    });
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

module.exports = { app };
