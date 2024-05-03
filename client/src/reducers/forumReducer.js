import forumService from '../services/forum'
import {
  LOAD_TOPICS,
  CREATE_TOPIC,
  GET_ALL_TOPICS,
  DELETE_TOPIC,
  UPDATE_TOPIC
} from '../actions/forum'

import { notification } from 'antd'

const forumReducer = (state = { data: [], loading: false }, action) => {
  switch (action.type) {
    case LOAD_TOPICS:
      return { data: state.data, loading: true }
    case GET_ALL_TOPICS:
      return { data: action.data, loading: false }
    case UPDATE_TOPIC:
      return {
        data: state.data.map((topic) => {
          if (topic.id === action.topicId)
            return {
              ...action.data,
              enrolled: topic.enrolled,
              privilege: topic.privilege
            }
          else return topic
        }),
        loading: false
      }
    case CREATE_TOPIC:
      return { data: action.data, loading: false }
    case DELETE_TOPIC:
      return {
        data: state.data.filter((topic) => topic.id !== action.topicId),
        loading: false
      }
    default:
      return state
  }
}

export const getAllTopics = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOAD_TOPICS })
      const response = await forumService.getAllTopics()
      dispatch({ type: GET_ALL_TOPICS, data: response })
    } catch (error) {
      console.log(error)
      notification.error({
        message: `Couldn't load topics`
      })
    }
  }
}

export const createTopic = (topic) => {
  return async (dispatch) => {
    try {
      const response = await forumService.createTopic(topic)
      dispatch({ type: CREATE_TOPIC, data: response })
      notification.success({
        message: 'Added topic successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't add topic"
      })
    }
  }
}

export const deleteTopic = (topicId) => {
  return async (dispatch) => {
    try {
      await forumService.deleteTopic(topicId)
      dispatch({ type: DELETE_TOPIC, topicId })
      notification.success({
        message: 'deleted topic successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't delete topic"
      })
    }
  }
}

export default forumReducer
