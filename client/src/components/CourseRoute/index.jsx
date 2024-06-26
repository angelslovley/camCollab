import { Button, Result } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Route, useRouteMatch } from 'react-router-dom'

const CourseRoute = ({ ...routeProps }) => {
  const courses = useSelector((state) => state?.courses?.data)
  let specficCourse;
  const { params } = useRouteMatch('/app/course/:courseId')

  if(courses){
    const { courseId } = params || { courseId: false }
     specficCourse = courses?.find((course) => course.id === courseId)

  }else{
    const courseId = 1
     specficCourse = courses?.find((course) => course.id === courseId)
  }


  if (!specficCourse?.enrolled) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to="/">Back Home</Link>
          </Button>
        }
      />
    )
  }

  return <Route {...routeProps} />
}

export default CourseRoute
