const express = require('express')
const auth = require('../middleware/auth')
const projectRouter = express.Router()

const {
    createProject,
    getAllProjects,
    getOneProject,
    enroll,
    unEnroll,
    deleteProject,
    updateProject,
    endCourse
} = require('../controller/projectController/projectController')

projectRouter.post('/', createProject)
projectRouter.get('/:courseId', auth, getOneProject)
projectRouter.get('/:filter?', auth, getAllProjects)
projectRouter.put('/:courseId', auth, updateProject)
projectRouter.delete('/:courseId', auth, deleteProject)
projectRouter.post('/:courseId/end-course', auth, endCourse)
projectRouter.post('/:courseId/enroll', auth, enroll)
projectRouter.post('/:courseId/un-enroll', auth, unEnroll)

module.exports = projectRouter
