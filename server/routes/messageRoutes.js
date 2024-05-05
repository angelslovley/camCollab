const express = require("express");
const messageRouter = express.Router()

const {
  allMessages,
  sendMessage,
} = require("../controller/messageController/messageControllers");
const auth = require('../middleware/auth')


messageRouter.post('/', auth, sendMessage)
messageRouter.get('/:chatId', auth, allMessages)


module.exports = messageRouter

