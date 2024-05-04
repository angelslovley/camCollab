import axios from 'axios'
import { getAuthHeader } from './config'

export const baseURL = 'http://localhost:9000/projects'

const getAllprojects = async () => {
  const response = await axios.get(`${baseURL}`, {
    ...getAuthHeader()
    // params: { filter: 'published' }
  })
  return response.data
}

const getOneProject = async (courseId) => {
  const response = await axios.get(`${baseURL}/${courseId}`, getAuthHeader())
  return response.data
}

const updateProject = async (courseId, course) => {
  const response = await axios.put(
    `${baseURL}/${courseId}`,
    course,
    getAuthHeader()
  )
  return response.data
}

const endProject = async (courseId) => {
  const response = await axios.post(
    `${baseURL}/${courseId}/end-course`,
    null,
    getAuthHeader()
  )
  return response.data
}

const createProject = async (course) => {
  const response = await axios.post(`${baseURL}`, course, getAuthHeader())
  return response.data
}

const deleteProject = async (courseId) => {
  const response = await axios.delete(`${baseURL}/${courseId}`, getAuthHeader())
  return response.data
}

const enrollProject = async (courseId, userId) => {
  const response = await axios.post(
    `${baseURL}/${courseId}/enroll`,
    { userId },
    getAuthHeader()
  )
  return response.data
}

const UnenrollProject = async (courseId, userId) => {
  const response = await axios.post(
    `${baseURL}/${courseId}/un-enroll`,
    { userId },
    getAuthHeader()
  )
  return response.data
}

const projectService = {
  getAllprojects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
  enrollProject,
  UnenrollProject,
  endProject
}
export default projectService
