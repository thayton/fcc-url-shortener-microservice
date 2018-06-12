const mongoose = require('mongoose');
const _ = require('lodash');

var UrlSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true,
        minlength: 12,
        unique: true,        
        trim: true
    },
    shortened: {
        type: String,
        required: true,
        unique: true,        
        trim: true
    },    
});

UrlSchema.methods.toJSON = function () {
    var url = this;
    var urlObject = url.toObject();
    
    return _.pick(urlObject, ['original', 'shortened']);
};

var Url = mongoose.model('Url', UrlSchema);

module.exports = { Url };
