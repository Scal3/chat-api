const indexRouter = require('express').Router()
const roomsRouter = require('./roomsRouter');

indexRouter.use('/rooms', roomsRouter)

module.exports = indexRouter