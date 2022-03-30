const roomsRouter = require('express').Router()

const { getRoomData, createRoom } = require('../controllers/rooms')


roomsRouter.get('/:id', getRoomData)
roomsRouter.post('/', createRoom)


module.exports = roomsRouter