import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Typography, Modal, Input, List, Collapse, Button , Form } from 'antd'
import {
  CaretRightOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { FlexSectionHeader } from '../style'
import CourseCard from '../../components/CourseCard'

import Spinner from '../../components/Spinner'

import {
  getAllProjects,
  deleteProject,
  enroll,
  unEnroll,
  createProject
} from '../../reducers/projectReducer'

import { useHistory } from 'react-router-dom'
import { STUDENT } from '../../constants/userRoles'


const { Title, Text } = Typography
const { confirm } = Modal

const Projects = () => {
  console.log("enetred here")
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllProjects())
  }, [dispatch])

  const user = useSelector((state) => state.auth.user)
  const courses = useSelector((state) =>
    state?.projects?.data.filter((course) => course.status !== 'archived')
  )
  const loading = useSelector((state) => state.projects.loading)
  const history = useHistory()

  const [filter, setFilter] = useState('')
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)


  const filteredCourses = courses?.filter((course) => {
    return course.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
  })

  const removeCourse = (courseId) => {
    dispatch(deleteProject(courseId))
  }

  const handleEnroll = (courseId, userId) => {
    dispatch(enroll(courseId, userId))
  }

  const handleUnenroll = (courseId, userId) => {
    dispatch(unEnroll(courseId, userId))
  }

  const handleSearch = (value) => {
    setFilter(value)
  }

  const confirmEnrolled = function (courseId, userId) {
    confirm({
      title: 'Do you Want to enroll in this course?',
      icon: <ExclamationCircleOutlined />,
      content: 'You have to enroll in the course to view its content',
      onOk() {
        handleEnroll(courseId, userId)
      },
      onCancel() {
        return
      }
    })
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const addCourse = (course) => {
    dispatch(createProject(course))
  }
  const handleCourseCardClick = (courseId, userId, userEnrolled) => {
    if (userEnrolled) history.push(`/app/course/${courseId}/modules`)
    else confirmEnrolled(courseId, userId)
  }

  if (loading) return <Spinner size="large" />

  return (
    <React.Fragment>
      <FlexSectionHeader>
        <Title level={3}>All Projects</Title>
        {user && user.role !== STUDENT && (
          <Button
            onClick={() => setModalVisible(true)}
            type="dashed"
            shape="round"
            icon={<PlusOutlined />}
          >
            Add Projects
          </Button>
        )}
      
      </FlexSectionHeader>


      <Modal
        title="Add New Project"
        visible={modalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Submit
          </Button>
        ]}
      >
        <Form
          name="add Project"
          form={form}
          onFinish={addCourse}
          requiredMark={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[
              {
                required: true,
                message: 'Please enter the project name'
              }
            ]}
          >
            <Input placeholder="Project Name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="(Optional)" allowClear />
          </Form.Item>

          <Form.Item name="image" label="Cover Image">
            <Input placeholder="(Optional) Image Url, defaults to random colour" />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginTop: '8px' }}>
        <Collapse
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          defaultActiveKey={['1']}
          ghost
        >
            <List
              grid={{
                gutter: 24,
                column: 3,
                xs: 1,
                sm: 2,
                xxl: 5
              }}
              dataSource={filteredCourses}
              renderItem={(course) => (
                <List.Item>
                  <CourseCard
                    course={course}
                    removeCourse={() => removeCourse(course.id)}
                    handleEnroll={() => handleEnroll(course.id, user._id)}
                    handleUnenroll={() => handleUnenroll(course.id, user._id)}
                    onClick={() =>
                      handleCourseCardClick(
                        course.id,
                        user._id,
                        course.enrolled
                      )
                    }
                  />
                </List.Item>
              )}
            />
        </Collapse>
      </div>
    </React.Fragment>
  )
}

export default Projects
