require('./config/config');

const validator = require('validator');
const parse_url = require('url-parse');
const express = require('express');
const base62 = require("base62/lib/ascii");
const dns = require('dns');

const { mongoose } = require('./db/mongoose');
const { Url } = require('./models/url');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

// Shorten URL/route
// Install into database
// Return shortened "base62" URL

const shorten = (route) => {
    let hash = CryptoJS.MD5(route).toString(CryptoJS.enc.Hex);
    let hash_val = parseInt(hash, 16);

    return base62.encode(hash_val);
};

app.post('/api/shorturl/:route(*)', (req, res) => {
    var route = req.params.route;
    if (validator.isURL(route)) {
        let { host } = parse_url(route);
        
        dns.lookup(host, (err, addr, family) => {
            if (err) {
                res.send({"error": "invalid URL" });
            } else {
                Url.findOne({ 'original': route }, '-_id original shortened').then((url) => {
                    if (url) {
                        res.send(url)
                    } else {
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
                    }
                });
            }
        });
    } else {
        res.send({"error": "invalid URL" });
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
