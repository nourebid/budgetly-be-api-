const handleBudget = (req, res, db) => {
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
}

module.exports = {
    handleBudget: handleBudget
}