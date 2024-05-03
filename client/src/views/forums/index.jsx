import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PlusOutlined, CaretRightOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Collapse,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Row,
  Typography
} from 'antd'
import { FlexSectionHeader } from '../style'

import { STUDENT } from '../../constants/userRoles'

import {
  createTopic,
  getAllTopics,
  deleteTopic,
} from '../../reducers/forumReducer'
import Spinner from '../../components/Spinner'
import TopicsCard from '../../components/TopicsCard'
import { useHistory } from 'react-router'

const { Title } = Typography

const DiscussionForums = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.auth.user)
  const topics = useSelector((state) =>
  state?.topics?.data
)

  useEffect(() => {
    dispatch(getAllTopics())
  }, [dispatch])


  const loading = useSelector((state) => state?.topics?.loading)
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  const enrolledTopics = topics

  const handleCancel = () => {
    setModalVisible(false)
  }

  const addCourse = (topic) => {
    dispatch(createTopic(topic))
  }


  const handleCourseCardClick = (topicId) => {
    history.push(`/app/topics/${topicId}/discussions`)
  }

  if (loading) return <Spinner size="large" />

  return (
    <>
      <FlexSectionHeader>
        <Title level={3}>Discussion Forum For common topics</Title>
        {user && user.role !== STUDENT && (
          <Button
            onClick={() => setModalVisible(true)}
            type="dashed"
            shape="round"
            icon={<PlusOutlined />}
          >
            Add Topic
          </Button>
        )}
      </FlexSectionHeader>

      <Modal
        title="Add New Topic"
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
          name="add topic"
          form={form}
          onFinish={addCourse}
          requiredMark={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="topicName"
            label="Topic Name"
            rules={[
              {
                required: true,
                message: 'Please enter the topic name'
              }
            ]}
          >
            <Input placeholder="Topic Name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="(Optional)" allowClear />
          </Form.Item>

          <Form.Item name="image" label="Cover Image">
            <Input placeholder="(Optional) Image Url, defaults to random colour" />
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={19}>
          {/* might refactor this in it's own component */}
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
                    column: 2,
                    xs: 1,
                    sm: 2,
                    xxl: 4
                  }}
                  dataSource={enrolledTopics}
                  renderItem={(course) => (
                    <List.Item>
                      <TopicsCard
                        course={course}
                        onClick={() => handleCourseCardClick(course.id)}
                      />
                    </List.Item>
                  )}
                />
            </Collapse>
          </div>
        </Col>

      </Row>
    </>
  )
}



export default DiscussionForums
