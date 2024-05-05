const express = require("express");
const chatRouter = express.Router()

const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controller/chatController/chatControllers");
const auth = require('../middleware/auth')

chatRouter.post('/', auth, accessChat)
chatRouter.get('/', auth, fetchChats)
chatRouter.post('/group', auth, createGroupChat)
chatRouter.put('/rename', auth, renameGroup)
chatRouter.put('/groupremove', auth, removeFromGroup)
chatRouter.put('/groupadd', auth, addToGroup)

module.exports = chatRouter

