const parse_url = require('url-parse');
const validator = require('validator');
const base62 = require("base62/lib/ascii");
const dns = require('dns');

const { Url } = require('./models/url');

//
// Shorten the URL
// Use shortned URL as search key to lookup existing entry
// If no existing entry install new entry into database
// Return shortened "base62" URL
//
function processRequest(req, res) {
    var url = req.params.route;
    validateUrl(url, processValidatedUrl);

    // The URL needs to be:
    // - valid syntactically
    // - point to an actual host that we can resolve
    function validateUrl(url, cb) {
        if (validator.isURL(url)) {
            let { host } = parse_url(url);
        
            dns.lookup(host, (err, addr, family) => {
                if (err) {
                    return cb(false, null); // syntactically correct url but invalid host
                }
            
                cb(true, url); // everything is valid
            });
        } else {
            cb(false, url); // syntactically incorrect url
        }
    }
    
    function processValidatedUrl(isValid, url) {
        if (!isValid) {
            return res.send({"error": "invalid URL" });
        }

        shortenUrl(url, returnShortenedUrl);
    }

    // The shortened URL is the base62 encoded count of URLs we currently
    // have in the database
    function shortenUrl(origUrl, cb) {
        Url.findOne({ 'original': origUrl }, '-_id original shortened').then((url) => {
            if (url) {
                return cb(null, url);
            } 

            Url.count({}).then((cnt) => {
                var shortUrl = base62.encode(cnt + 1);
                var url = new Url({
                    original: origUrl,
                    shortened: shortUrl
                });
                            
                url.save().then((url) => {
                    return cb(null, url);
                });
            });
        }).catch((e) => {
            res.status(400).send(e);
        });
    }

    function returnShortenedUrl(err, url) {
        if (err) {
            return res.status(400).send(err);
        }
        
        res.send(url);
    }
}

module.exports = {
    processRequest
};
