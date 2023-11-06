const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    key: String,
    url: String
})

const Url = mongoose.model('StortenUrl', urlSchema);

module.exports = Url;