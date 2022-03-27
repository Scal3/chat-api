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


app.get('/rooms/:id', (req, res) => {
    const room = req.params.id
    const roomData = {
        users: [...chatData.get(room).get('users').values()],
        messages: [...chatData.get(room).get('messages').values()]
    }
    res.status(200).send({ roomData })
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
        socket.to(room).emit('ROOM:SET_USERS', users)
    })

    socket.on('ROOM:NEW_MESSAGE', ({ room, userName, text, currentDate }) => {
        const messageObject = { userName, text, currentDate }
        console.log(messageObject)
        chatData.get(room).get('messages').push(messageObject)
        socket.broadcast.to(room).emit('ROOM:NEW_MESSAGE', messageObject)
    })

    socket.on('disconnect', () => {
        chatData.forEach((value, room) => {
            if(value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]
                socket.broadcast.to(room).emit('ROOM:SET_USERS', users)
            } else {
                console.log('err') // !!
            }
        })
    })

    console.log('user connected', socket.id)
})

server.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`App listening on port ${PORT}`)
}) 