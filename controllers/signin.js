const handleSignin = (db, bcrypt) => (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    return res.status(400).json({msg: 'Fileds cannot be empty'});
  }
  db.select('hash').from('users')
  .where('username', '=', username)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      db.select('id', 'username').from('users')
      .where('username', '=', username)
      .then(response => {
        const user = response[0]
        return db.select('*').from('qoqtails')
        .where('user_id', '=', user.id)
        .then(qoqtails => {
          user.qoqtails = qoqtails;
          res.json(user)
        })
      })
      .catch(() => res.status(400).json({msg: 'Server error'}))
    } else {
      res.status(400).json({msg: 'Username or password are incorrect'})
    }
  })
  .catch(() => res.status(400).json({msg: 'Username or password are incorrect'}))
}

const handleRegister = (db, bcrypt) => (req, res) => {
  const { username, password } = req.body;
  if (!username || !password){
    return res.status(400).json({msg: 'Fileds cannot be empty'});
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      username: username,
    })
    .into('users')
    .returning('*')
    .then(user => {
      res.json(user[0])
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(() => res.status(400).json({msg: `Username ${username} is taken`}));
}

module.exports = {
  handleSignin,
  handleRegister
}