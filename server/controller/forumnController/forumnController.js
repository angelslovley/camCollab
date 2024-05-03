const { default: axios } = require('axios')
const Forumn = require('../../model/forumn')
const User = require('../../model/userModel')

const getAllTopics = async (req, res) => {
  try {
    const topics = await Forumn.find();
    return res.json(topics);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const getOneTopic = async (req, res) => {
  try {
  
    // return res.json(result)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const createTopic = async (req, res) => {
  const user = req.user

  try {
    let form = new Forumn({
      name: req.body.topicName,
      description:
        req.body.description === undefined ? '' : req.body.description,
      createdBy: user._id,
      image: req.body.image === undefined ? undefined : req.body.image
    })

    form = await form.save()

    return res.status(201).json("Created successfully")
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}

const updateTopic = async (req, res) => {
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

    const result = await Course.findByIdAndUpdate(courseId, course, {
      new: true,
      omitUndefined: true
    }).orFail()

    // Option 1: Use findById() followed by populate()
    const populatedResult = await Course.findById(result._id)
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

const deleteTopic = async (req, res) => {
  const courseId = req.params.courseId

  try {


    let course = await Course.findById(courseId).orFail()
    for (const enrollment of course.enrollments) {
      const user = await User.findById(enrollment.user.toString()).orFail()

      user.enrollments = user.enrollments.filter(
        (e) => e.toString() !== courseId
      )
      await user.save()
    }

    // Find the course by ID and delete it
    await Course.deleteOne({ _id: courseId })

    return res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message || err.toString() })
  }
}


module.exports = {
  createTopic,
  getAllTopics,
  getOneTopic,
  deleteTopic,
  updateTopic,
}
