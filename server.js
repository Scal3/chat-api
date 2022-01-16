const express = require('express')

const { PORT = 3000 } = process.env;
const app = express()

const rooms = new Map([
    
])

app.get('/', (req, res) => {
    res.json(rooms)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
}) 