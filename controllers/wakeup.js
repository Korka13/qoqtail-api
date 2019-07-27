const wakeUp = () => (req, res) => {
  console.log(`${req.connection.remoteAddress} is knocking...`)
  res.json("I woke up... -Server-")
}

module.exports = wakeUp;