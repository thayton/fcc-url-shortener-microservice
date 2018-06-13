require('./config/config');

const { mongoose } = require('./db/mongoose');
const port = process.env.PORT || 3000;

const { processRequest } = require('./util');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.post('/api/shorturl/:route(*)', (req, res) => {
    processRequest(req, res);
});

/*
app.post('/api/shorturl/:route(*)', (req, res) => {
    var route = req.params.route;
    if (validator.isURL(route)) {
        let { host } = parse_url(route);
        
        dns.lookup(host, (err, addr, family) => {
            if (err) {
                return res.send({"error": "invalid URL" });
            }
            Url.findOne({ 'original': route }, '-_id original shortened').then((url) => {
                if (url) {
                    return res.send(url)
                } 

                Url.count({}).then((cnt) => {
                    var url = new Url({
                        original: route,
                        shortened: cnt+1
                    });
                            
                    url.save().then((url) => {
                        res.send(url);
                    }, (e) => {
                        res.status(400).send(e);
                    });
                });
            });
        });
    } else {
        res.send({"error": "invalid URL" });
    }
});
*/

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

