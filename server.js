const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
        {   
            id: '1',
            firstName: 'Nour',
            lastName: 'Ebid',
            email: 'nour@gmail.com',
            password: '123456',
            budget: 0,
            expenses: 0,
            balance: 0,
            joined: new Date(),
            actionDate: new Date()
        }, {
            id: '2',
            firstName: 'Sherihan',
            lastName: 'Samir',
            email: 'shery@gmail.com',
            password: '123456',
            budget: 0,
            expenses: 0,
            balance: 0,
            joined: new Date(),
            actionDate: new Date()
        }
    ]
    
}

//home route
// app.get('/', (req, res) => {
//     res.send('Home route is working');
// })
app.get('/', (req, res) => {
    res.json(database.users);
})


app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('Success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    database.users.push({
        id: '3',
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        budget: 0,
        expenses: 0,
        balance: 0,
        joined: new Date(),
        actionDate: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

app.put('/budget', (req, res) => {
    const {id, balance, budget, expenses} = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.balance = balance;
            user.budget = budget;
            user.expenses = expenses;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

app.listen(3000, ()=> {
    console.log('app is running :)')
})

/*

/res --> Home route is working

/signin --> POST = Sucess or Fail

/register --> POST = user

/profile/:userId --> GET = user

/budget/:userId --> PUT = user(new data)

*/