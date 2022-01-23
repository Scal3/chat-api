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

const chatData = new Map()


app.get('/rooms', (req, res) => {
    res.status(200).send({ chatData })
})

app.post('/rooms', (req, res) => {
    const { room, userName } = req.body
    if(!chatData.has(room)) {
        chatData.set(
            room, 
            new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.status(201).send([...chatData.values()])
})

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({ room, userName }) => {
        socket.join(room)
        chatData.get(room).get('users').set(socket.id, userName)
        const users = [...chatData.get(room).get('users').values()]
        // socket.to(room).broadcast.emit('ROOM:JOINED', users)
        socket.to(room).emit('ROOM:JOINED', users)
    })

    console.log('user connected', socket.id)
})

server.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`App listening on port ${PORT}`)
}) 