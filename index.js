const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const shortenUrlDB = require('./models/urls');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/shortenUrl', (req, res) => {

    const host = req.protocol + '://' + req.get('Host');
    const { url } = req.body;
    console.log(host);
    try{
        const key = generateKey();
        const urlData = new shortenUrlDB({
            key: key,
            url: url
        });

        urlData.save();
        res.status(200).json({shortenUrl: host + '/' + key});
    }
    catch(err){
        res.status(500).json({err});
    }
})

app.get('/:key', async (req, res) => {
    const { key } = req.params;
    try{
        const data = await shortenUrlDB.findOne({key});
        res.redirect(data.url);
    }
    catch(err){
        res.status(500).json({err});
    }
})

function generateKey() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomKey = '';
    
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomKey += characters[randomIndex];
    }
    
    return randomKey;
  }

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.listen(5000, () => {
  console.log("Listening on port 3000");
})

