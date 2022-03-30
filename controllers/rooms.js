const chatData = require('../chatData/chatData');

const getRoomData = (req, res) => {
  const room = req.params.id
  const roomData = {
      users: [...chatData.get(room).get('users').values()],
      messages: [...chatData.get(room).get('messages').values()]
  }
  res.status(200).send({ roomData })
}

const createRoom = (req, res) => {
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
}


module.exports = {
  getRoomData,
  createRoom
}