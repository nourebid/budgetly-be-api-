const express = require('express');

const app = express();


//home route
app.get('/', (req, res) => {
    res.send('Home route is working');
})



app.listen(3000, ()=> {
    console.log('app is running :)')
})