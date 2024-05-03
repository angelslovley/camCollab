import axios from 'axios'
import { getAuthHeader } from './config'

export const baseURL = 'http://localhost:9000/topics'

const getAllTopics = async () => {
  const response = await axios.get(`${baseURL}`, {
    ...getAuthHeader()
  })

  return response.data
}

const getOneTopic = async (topicId) => {
  const response = await axios.get(`${baseURL}/${topicId}`, getAuthHeader())
  return response.data
}

const updateTopic = async (topicId, topic) => {
  const response = await axios.put(
    `${baseURL}/${topicId}`,
    topic,
    getAuthHeader()
  )
  return response.data
}


const createTopic = async (topic) => {
  const response = await axios.post(`${baseURL}`, topic, getAuthHeader())
  return response.data
}

const deleteTopic = async (topicId) => {
  const response = await axios.delete(`${baseURL}/${topicId}`, getAuthHeader())
  return response.data
}


const forumService = {
  getAllTopics,
  getOneTopic,
  createTopic,
  updateTopic,
  deleteTopic,

}
export default forumService
