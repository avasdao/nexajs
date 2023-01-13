/* Import modules. */
import express from 'express'

// TODO: Add ascii art.
console.log(`
  Starting Nexa Server...`)

/* Initialize Express server. */
const app = express()

/* Set port. */
const port = 3000

/* Initialize root endpoint. */
app.get('/', (req, res) => {
    res.send('Hello Nexa!')
})

/* Start listening for incoming connections. */
app.listen(port, () => {
    console.log(`\n  Your app is now running here --> http://127.0.0.1:${port}`)
})
