const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '123456',
        database: 'budgetly'
    }
});



//test databse connection
// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

//hard coded database
// const database = {
//     users: [
//         {   
//             id: '1',
//             firstName: 'Nour',
//             lastName: 'Ebid',
//             email: 'nour@gmail.com',
//             password: '123456',
//             budget: 0,
//             expenses: 0,
//             balance: 0,
//             joined: new Date(),
//             actionDate: new Date()
//         }, {
//             id: '2',
//             firstName: 'Sherihan',
//             lastName: 'Samir',
//             email: 'shery@gmail.com',
//             password: '123456',
//             budget: 0,
//             expenses: 0,
//             balance: 0,
//             joined: new Date(),
//             actionDate: new Date()
//         }
//     ]
// }

//home route
app.get('/', (req, res) => {
    res.send('Home route is working');
})

//home route getting hardcoded database
// app.get('/', (req, res) => {
//     res.json(database.users);
// })


app.post('/signin', (req, res) => {
//new code
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
               return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong Credentials please check your login email or password')
            }
        })
        .catch(err => res.status(400).json('Wrong Credentials for login'))
    //old code
    // if (req.body.email === database.users[0].email && 
    //     req.body.password === database.users[0].password) {
    //         res.json('Success')
    // } else {
    //     res.status(400).json('error logging in')
    // }
})

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    //new code to connect database and push in PGSQL database with bcrypt and trx
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    firstname: firstName,
                    lastname: lastName,
                    email: loginEmail[0],
                    lastaction: new Date(),
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0])
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register please check your entered data'))
    })
    
        //second code to add in PGSQL database 
        // return db('users')
        //     .returning('*')
        //     .insert({
        //         firstname: firstName,
        //         lastname: lastName,
        //         email: email,
        //         lastaction: new Date(),
        //         joined: new Date()
        //     })
        //     .then(user => {
        //         res.json(user[0])
        //     })
        //     .catch(err => res.status(400).json('Unable to register please check your entered data'))
    
    //Old Code to push in the hard coded database
    // database.users.push({
    //     id: '3',
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     password: password,
    //     budget: 0,
    //     expenses: 0,
    //     balance: 0,
    //     joined: new Date(),
    //     actionDate: new Date()
    // })
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
        db.select('*').from('users').where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('User profile not found')
            }
            
        })
    //old code
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // })
    // if (!found) {
    //     res.status(400).json('user not found')
    // }
})

app.put('/budget', (req, res) => {
    const {id, balance, budget, expenses} = req.body;
    db('users').where('id', '=', id)
        .update({
            balance: balance,
            budget: budget,
            expenses: expenses,
            lastaction: new Date()
        })
        .returning('*')
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(400).json('Can\'t update user profile with the new data'))

    // TO DO: creat button to store in frontEnd, and Create another to update the summary from database

    //old code
    // let found = false;
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.balance = balance;
    //         user.budget = budget;
    //         user.expenses = expenses;
    //         user.actionDate = new Date()
    //         return res.json(user);
    //     }
    // })
    // if (!found) {
    //     res.status(400).json('user not found')
    // }
})

app.listen(3000, ()=> {
    console.log('app is running :)')
})