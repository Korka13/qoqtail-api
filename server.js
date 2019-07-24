const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs');
const cors = require("cors");
const knex = require("knex");

const port = process.env.PORT || 8080;

const signin = require("./controllers/signin");
const qoqtails = require("./controllers/qoqtails");

const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', signin.handleRegister(db, bcrypt));

app.post('/addqoqtail', qoqtails.addQoqtail(db));

app.delete('/deleteqoqtail', qoqtails.deleteQoqtail(db));

app.get('/searchqoqtailbyname/:keyword', qoqtails.searchByName());

app.get('/getqoqtailbyid/:id', qoqtails.getQoqtails());

app.listen(port, () => {
    console.log('server is running...');
});