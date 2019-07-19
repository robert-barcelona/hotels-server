const express = require('express')
const logic = require('./logic')
const app = express()
app.use(express.urlencoded())

const port = 4000


app.get('/availibility', async (req, res) => {
  const {body: {adults, children, start, finish,promo_code}} = req
  let discount = 0
  const regex = /THN[0-9][0-9]/
  if (!(adults && children && start && finish)) res.status(400).send('Missing parameters in GET call')
  if (promo_code && promo_code.match(regex)) {
      discount = parseInt(promo_code.slice(3),10)
  }

  try {
    results = await logic.searchAvailability(parseInt(adults,10), parseInt(children,10), start, finish,discount)
    res.json(results)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
