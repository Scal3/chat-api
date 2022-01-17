const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
  })

const { PORT = 9999 } = process.env

const rooms = new Map([

])


app.get('/rooms', (req, res) => {
    res.json('sasi')
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