const express = require('express')
const auth = require('../middleware/auth')
const forumnRouter = express.Router()

const {
  getAllTopics,
  getOneTopic,
  createTopic,
  deleteTopic,
  updateTopic,
} = require('../controller/forumnController/forumnController')

forumnRouter.post('/', auth, createTopic)
forumnRouter.get('/:courseId', auth, getOneTopic)
forumnRouter.get('/:filter?', getAllTopics)
forumnRouter.put('/:courseId', auth, updateTopic)
forumnRouter.delete('/:courseId', auth, deleteTopic)


module.exports = forumnRouter
