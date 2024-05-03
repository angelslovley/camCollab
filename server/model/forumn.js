const { DateTime } = require('luxon')
const mongoose = require('mongoose')
const courseModule = require('./courseModule')

const randomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}


const forumnSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1 },
  description: String,
  createdAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
  createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  files: [String],
  image: String,
  backgroundColor: { type: String, default: randomHexColor },
  modules: [courseModule.schema],
  status: {
    type: String,
    enum: ['published', 'archived'],
    default: 'published'
  },
})

forumnSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


forumnSchema.methods.getInstructors = function () {
  return this.enrollments.filter(
    (enrollment) => enrollment.enrolledAs === 'instructor'
  )
}

forumnSchema.statics.formatCalendar = function (deadlines) {
  const result = {}

  const nestedAssign = (obj, keyPath, value) => {
    lastKeyIndex = keyPath.length - 1
    for (var i = 0; i < lastKeyIndex; ++i) {
      key = keyPath[i]
      if (!(key in obj)) {
        obj[key] = {}
      }
      obj = obj[key]
    }
    obj[keyPath[lastKeyIndex]] = obj[keyPath[lastKeyIndex]]
      ? obj[keyPath[lastKeyIndex]].concat(value)
      : [].concat(value)
  }

  deadlines.forEach((item) => {
    const date = DateTime.fromJSDate(item.deadline)
    const year = date.year
    const month = date.month
    const day = date.day

    nestedAssign(result, [`${year}`, `${month}`, `${day}`], [{ ...item }])
  })

  return result
}

const Forumn = mongoose.model('Forumn', forumnSchema)

module.exports = Forumn
