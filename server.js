const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const data = require('./controllers/budgetData');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});


const app = express();

app.use(bodyParser.json());
app.use(cors());


//home endpoint
app.get('/', (req, res) => {
    res.json('Home route is working');
})

//signin endpoint
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//register endpoint
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });

//profile endpoint
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

//budgetData endpoint
app.put('/data', (req, res) => { data.handleBudget(req, res, db) });

//Monitor app
app.listen(process.env.PORT || 3000, ()=> { console.log('app is running :)') })