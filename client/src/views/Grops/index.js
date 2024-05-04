import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Typography, Modal, Input, List, Collapse } from 'antd'
import {
  CaretRightOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { FlexSectionHeader } from '../style'
import CourseCard from '../../components/CourseCard'

import Spinner from '../../components/Spinner'

import {
  getAllCourses,
  deleteCourse,
  enroll,
  unEnroll
} from '../../reducers/courseReducer'

import { useHistory } from 'react-router-dom'

const { Title, Text } = Typography
const { confirm } = Modal

const Groups = () => {
 

  return (
    <React.Fragment>
      
    </React.Fragment>
  )
}

export default Groups
