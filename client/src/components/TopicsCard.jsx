import React from 'react'

import { Button, Card, Menu } from 'antd'

const CourseImage = ({ image, backgroundColor }) => {
  if (!image)
    return (
      <div style={{ backgroundColor: `${backgroundColor}`, height: 256 }}></div>
    )

  return (
    <img
      style={{
        maxHeight: 256,
        objectFit: 'cover',
        objectPosition: 'top'
      }}
      alt="topics img"
      src={image}
    />
  )
}

const TopicsCard = (props) => {
  const {
    course,
    onClick,
     } = props
 
  return (
    <Card
      hoverable
      bordered={false}
      cover={
        <CourseImage
          image={course.image}
          backgroundColor={course.backgroundColor}
        />
      }
      onClick={onClick}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {course.name}
          </div>
        }
       
      />
    </Card>
  )
}

export default TopicsCard
