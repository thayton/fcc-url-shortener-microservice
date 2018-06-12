const validator = require('validator');
const parse_url = require('url-parse');
const express = require('express');
const dns = require('dns');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(__dirname + '/public'));

app.post('/api/shorturl/:route(*)', (req, res) => {
    var route = req.params.route;
    if (validator.isURL(route)) {
        let { host } = parse_url(route);
        
        dns.lookup(host, (err, addr, family) => {
            if (err) {
                res.send({"error": "invalid URL" });
            } else {
                res.send({ "original_url": req.params.route, "short_url": 1 });
            }
        });
    } else {
        res.send({"error": "invalid URL" });
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
