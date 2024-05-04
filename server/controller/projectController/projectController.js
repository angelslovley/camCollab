
const { default: axios } = require('axios')
const Achievement = require('../../model/achievement')
const Project = require('../../model/projects')
const Grades = require('../../model/gradesSummary')
const User = require('../../model/userModel')

const getAllProjects = async (req, res) => {
  try {
    const user = req.user
    const filter = req.query.filter

    // getCoursesWithPrivilege func populates users
    const courses = await Project.getCoursesWithPrivilege(user._id)

    let result = courses
    if (filter) result = courses.filter((course) => course.status === filter)

    return res.json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const getOneProject = async (req, res) => {
  try {
    const { courseId } = req.params

    const result = await Project.findOne({ _id: courseId })

    return res.json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const createProject = async (req, res) => {
  if (!req.body.projectName)
    return res.status(400).json({ error: 'missing projectName' })

  const user = req.user

  try {
    let course = new Project({
      name: req.body.projectName,
      description:
        req.body.description === undefined ? '' : req.body.description,
      createdBy: user._id,
      image: req.body.image === undefined ? undefined : req.body.image
    })

    course.enroll(user._id, user.role)
    course = await course.save()

    user.enrollments.push(course._id)
    await user.save()

    const result = await Project.getCoursesWithPrivilege(user._id)

    return res.status(201).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const updateProject = async (req, res) => {
  const courseId = req.params.courseId
  const { name, description, image, status, backgroundColor } = req.body

  try {
    const course = {
      name: name,
      description: description,
      image: image,
      status: status,
      backgroundColor: backgroundColor
    }

    const result = await Project.findByIdAndUpdate(courseId, course, {
      new: true,
      omitUndefined: true
    }).orFail()

    // Option 1: Use findById() followed by populate()
    const populatedResult = await Project.findById(result._id)
      .populate('enrollments.user createdBy', '_id name username email code photo')

    // Option 2: Use lean() option with findByIdAndUpdate()
    // const result = await Course.findByIdAndUpdate(courseId, course, {
    //   new: true,
    //   omitUndefined: true,
    //   lean: true
    // }).orFail()

    // Note: Choose either Option 1 or Option 2, not both

    return res.status(200).json(populatedResult || result) // Use populatedResult if using Option 1, otherwise use result
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const enroll = async (req, res) => {
  const courseId = req.params.courseId
  const userId = req.body.userId

  try {
    const user = await User.findById(userId).orFail()
    let course = await Project.findById(courseId).orFail()
    course = course.enroll(user._id, user.role)

    // const result = await course.save()
    await course.save()
    user.enrollments.push(courseId)
    await user.save()

    //send to machine learning api

    const result = await Project.getCoursesWithPrivilege(userId)

    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const unEnroll = async (req, res) => {
  const courseId = req.params.courseId
  const userId = req.body.userId

  try {
    const user = await User.findById(userId).orFail()
    let course = await Project.findById(courseId).orFail()
    course = course.unEnroll(user._id)

    // const result = await course.save()
    await course.save()
    user.enrollments = user.enrollments.filter((e) => e.toString() !== courseId)
    await user.save()

    //send to machine learning api

    const result = await Project.getCoursesWithPrivilege(userId)

    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const getEnrollments = async (req, res) => {
  try {
    const courseId = req.params.courseId

    const course = await Project.findById(courseId)
      .populate('enrollments.user')
      .exec()

    return res.status(200).json(course.enrollments)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const updateEnrollment = async (req, res) => {
  try {
    const courseId = req.params.courseId
    const enrollmentId = req.body.enrollmentId

    const course = await Project.findById(courseId)
      .populate('enrollments.user')
      .exec()

    const enrollmentToUpdate = course.enrollments.id(enrollmentId)

    enrollmentToUpdate.enrolledAs = req.body.enrolledAs
    const result = await course.save()

    return res.status(200).json(result.enrollments)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}


const deleteProject = async (req, res) => {
  const courseId = req.params.courseId

  try {


    let course = await Project.findById(courseId).orFail()
    for (const enrollment of course.enrollments) {
      const user = await User.findById(enrollment.user.toString()).orFail()

      user.enrollments = user.enrollments.filter(
        (e) => e.toString() !== courseId
      )
      await user.save()
    }

    // Find the course by ID and delete it
    await Project.deleteOne({ _id: courseId })

    return res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}


const endCourse = async (req, res) => {
  const courseId = req.params.courseId

  try {
    const gradeRecords = await Grades.getGradesByUser(courseId)

    for (const studentGrade of gradeRecords) {
      const data = JSON.stringify({
        Student: studentGrade.studentName,
        Course: studentGrade.courseName,
        Grade: studentGrade.grade
      })

      const certificateUrl = axios
        .post('', {
          Student: studentGrade.studentName,
          Course: studentGrade.courseName,
          Grade: studentGrade.gradeLetter
        })
        .then((res) => {
          const newAchievement = new Achievement({
            ...studentGrade,
            certificate: res.data
          })
          newAchievement.save()
        })
        .catch((err) => console.log(err))
    }

    await Project.findByIdAndUpdate(
      courseId,
      { status: 'archived' },
      { omitUndefined: true }
    )

    return res.status(204).end()
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const getDeadLines = async (req, res) => {
  try {
    const user = req.user

    let result = []
    for (const courseId of user.enrollments) {
      const courseDeadlines = await Project.getDeadLines(courseId)
      result = result.concat(courseDeadlines)
    }

    return res.json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const getDeadLinesCalendar = async (req, res) => {
  try {
    const user = req.user

    let result = []
    for (const courseId of user.enrollments) {
      const courseDeadlines = await Project.getDeadLines(courseId)
      result = result.concat(courseDeadlines)
    }

    result = Project.formatCalendar(result)

    return res.json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getOneProject,
  enroll,
  unEnroll,
  deleteProject,
  updateProject,
  getEnrollments,
  updateEnrollment,
  getDeadLines,
  getDeadLinesCalendar,
  endCourse
}
