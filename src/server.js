require('dotenv').config();


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dns = require('dns');
const {MongoClient} = require('mongodb');

const databaseUrl = process.env.DATABASE


const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MongoClient.connect(databaseUrl, { useNewUrlParser: true})
 .then(client => {
     app.locals.db = client.db('shortener');
 })
 .catch(() => console.error('Failed to connect to the database'));

app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(htmlPath);
});

app.post('/new', (req, res) => {
    let originalUrl;
    try{
        originalUrl = new URL(req.body.url);
    } 
    catch (err) {
        return res.status(400).send({error: 'invalid URL'});
    }
    dns.lookup(originalUrl.hostname, (err) => {
        if (err) {
            return res.status(404).send({ error: 'Address not found'});
        };
        console.log(req.body);

    });
});


app.set('port', process.env.PORT || 4100);
const server = app.listen(app.get('port'), ()=> {
    console.log(`Express running on PORT ${server.address().port}`)
});