/* Import modules. */
import express from 'express'

const app = express()

/* Set constants. */
const HOST = '127.0.0.1'
const PORT = process.env.PORT || 3000

/* Initialize default path. */
app.get('/', (req, res) => {
    res.send('NexID Application Server Demo')
})

/* Start listening for requests. */
app.listen(PORT, HOST, () => {
    console.log(`App is listening on port ${PORT}`)
})
