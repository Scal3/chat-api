const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})

const { PORT = 9999 } = process.env

app.use(express.json())

const chatData = new Map([

])


app.get('/rooms', (req, res) => {
    res.status(200).send({ chatData })
})

app.post('/rooms', (req, res) => {
    console.log(req.body)
    res.status(201).send({ status: 'created!' })
})

io.on('connection', socket => {
    console.log('user connected', socket.id)
})

server.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`App listening on port ${PORT}`)
}) 