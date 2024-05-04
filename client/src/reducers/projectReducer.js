import courseService from '../services/projects'
import {
  LOAD_PROJECTS,
  CREATE_PROJECTS,
  GET_ALL_PROJECTS,
  DELETE_PROJECTS,
  LOAD_ENROLLMENT,
  ENROLL_PROJECTS,
  UN_ENROLL_PROJECTS,
  UPDATE_PROJECTS
} from '../actions/project'

import { notification } from 'antd'

const projectReducer = (state = { data: [], loading: false }, action) => {
  switch (action.type) {
    case LOAD_PROJECTS:
      return { data: state.data, loading: true }
    case GET_ALL_PROJECTS:
      return { data: action.data, loading: false }
    case UPDATE_PROJECTS:
      return {
        data: state.data.map((course) => {
          if (course.id === action.courseId)
            return {
              ...action.data,
              enrolled: course.enrolled,
              privilege: course.privilege
            }
          else return course
        }),
        loading: false
      }
    case CREATE_PROJECTS:
      return { data: action.data, loading: false }
    case DELETE_PROJECTS:
      return {
        data: state.data.filter((course) => course.id !== action.courseId),
        loading: false
      }
    case ENROLL_PROJECTS:
      return { data: action.data, loading: false }
    case UN_ENROLL_PROJECTS:
      return { data: action.data, loading: false }
    case LOAD_ENROLLMENT:
      return {
        data: state.data.map((course) => {
          if (course.id === action.courseId)
            return { ...course, loadingEnroll: true }
          else return course
        }),
        loading: false
      }
    default:
      return state
  }
}

export const getAllProjects = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOAD_PROJECTS })
      const response = await courseService.getAllprojects()
      dispatch({ type: GET_ALL_PROJECTS, data: response })
    } catch (error) {
      console.log(error)
      notification.error({
        message: `Couldn't load Courses`
      })
    }
  }
}

export const createProject = (course) => {
  return async (dispatch) => {
    try {
      const response = await courseService.createProject(course)
      dispatch({ type: CREATE_PROJECTS, data: response })
      notification.success({
        message: 'Added project successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't add project"
      })
    }
  }
}

export const deleteProject = (courseId) => {
  return async (dispatch) => {
    try {
      await courseService.deleteProject(courseId)
      dispatch({ type: DELETE_PROJECTS, courseId })
      notification.success({
        message: 'deleted project successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't delete project"
      })
    }
  }
}

export const enroll = (courseId, userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOAD_ENROLLMENT, courseId })
      const response = await courseService.enrollProject(courseId, userId)
      dispatch({ type: ENROLL_PROJECTS, data: response })
      notification.success({
        message: 'enrolled successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't enroll in project"
      })
    }
  }
}

export const unEnroll = (courseId, userId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOAD_ENROLLMENT, courseId })
      const response = await courseService.UnenrollProject(courseId, userId)
      dispatch({ type: UN_ENROLL_PROJECTS, data: response })
      notification.success({
        message: 'Unenrolled successfully'
      })
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Couldn't Unenroll"
      })
    }
  }
}

export default projectReducer
