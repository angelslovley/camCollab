import axios from 'axios'
import { getAuthHeader } from './config'

export const baseURL = 'http://localhost:9000'

const getAll = async (courseId, assessmentId) => {
  const response = await axios.get(
    `${baseURL}/${courseId}/assessments/${assessmentId}/submissions/`,
    getAuthHeader()
  )
  return response.data
}

const getOrCreateSumbission = async (courseId, assessmentId, studentId) => {
  const response = await axios.get(
    `${baseURL}/${courseId}/assessments/${assessmentId}/submissions/${studentId}`,
    getAuthHeader()
  )
  return response.data
}

const updateSubmission = async (
  courseId,
  assessmentId,
  studentId,
  submission
) => {
  const response = await axios.put(
    `${baseURL}/${courseId}/assessments/${assessmentId}/submissions/${studentId}`,
    submission,
    getAuthHeader()
  )
  return response.data
}

const checkPlagiarism = async (courseId, assessmentId) => {
  const response = await axios.get(
    `${baseURL}/${courseId}/assessments/${assessmentId}/check-plagiarism`,
    getAuthHeader()
  )
  return response.data
}

const autoGrade = async (courseId, assessmentId) => {
  const response = await axios.get(
    `${baseURL}/${courseId}/assessments/${assessmentId}/auto-grade`,
    getAuthHeader()
  )
  return response.data
}

const gradeSubmission = async (
  courseId,
  assessmentId,
  studentId,
  submission
) => {
  const response = await axios.put(
    `${baseURL}/${courseId}/assessments/${assessmentId}/submissions/${studentId}/grade`,
    submission,
    getAuthHeader()
  )
  return response.data
}

const submissionService = {
  getAll,
  getOrCreateSumbission,
  updateSubmission,
  gradeSubmission,
  checkPlagiarism,
  autoGrade
}

export default submissionService
