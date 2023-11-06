const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/shortenUrl', (req, res) => {

    const host = req.protocol + '://' + req.get('Host');
    const { url } = req.body;
    console.log(host);
    try{
        const key = generateKey();
        const data = JSON.parse(fs.readFileSync('data.json')) || {};
        data[key] = url;
        fs.writeFileSync('data.json', JSON.stringify(data));
        res.status(200).json({shortenUrl: host + '/' + key});
    }
    catch(err){
        res.status(500).json({err});
    }
})

app.get('/:key', (req, res) => {
    const { key } = req.params;
    try{
        const data = JSON.parse(fs.readFileSync('data.json'));
        if(data[key] === undefined) return null;
        else res.redirect(data[key]);
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

app.listen(5000, () => {
  console.log("Listening on port 3000");
})

