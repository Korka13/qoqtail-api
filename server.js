const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs');
const cors = require("cors");
const knex = require("knex");

const signin = require("./controllers/signin");
const qoqtails = require("./controllers/qoqtails");

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'newPassword',
    database : 'qoqtail'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', signin.handleRegister(db, bcrypt));

app.post('/addqoqtail', qoqtails.addQoqtail(db));

app.delete('/deleteqoqtail', qoqtails.deleteQoqtail(db));

app.get('/searchqoqtailbyname/:keyword', qoqtails.searchByName());

app.get('/getqoqtailbyid/:id', qoqtails.getQoqtails());

app.listen(8080, () => {
    console.log('server is running...');
});