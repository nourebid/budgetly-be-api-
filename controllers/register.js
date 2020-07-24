const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { firstName, lastName, email, password } = req.body;
    //new code to connect database and push in PGSQL database with bcrypt and trx
    if ( !firstName || !lastName || !email || !password ) {
        return res.status(400).json('Incorrect form submission')
    }
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
}

module.exports = {
    handleRegister: handleRegister
}