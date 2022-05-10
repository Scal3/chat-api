const express = require('express')
const socketSettings = require('./utils/socketSettings')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, socketSettings)

const chatData = require('./chatData/chatData');
const indexRouter = require('./routers/index');


const { PORT = 9999 } = process.env

app.use(express.json())

app.use(indexRouter)

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


app.get('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found =(' })
    next()
})


server.listen(PORT, (err) => {
    if(err) {
        throw new Error(err)
    }
    console.log(`App listening on port ${PORT}`)
})