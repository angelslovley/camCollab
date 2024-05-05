const express = require("express");
const dbConfig = require("./config/dbConfig");
const path = require('path')
const mongoose = require('mongoose')
const app = express();

const cors = require('cors')

require("dotenv").config();
app.use(express.json());


const user = require('./routes/user')
const assignment = require('./routes/Assignment')
const article = require('./routes/article')
const course = require('./routes/course')
const projects = require('./routes/projects')
const courseModule = require('./routes/courseModule')
const courseModuleItem = require('./routes/courseModuleItem')
const discussionsRouter = require('./routes/Discussions')
const cheatingDetection = require('./routes/cheatingDetection')
const notification = require('./routes/notification')
const lectureRouter = require('./routes/lecture')
const AnnouncementsRouter = require('./routes/announcement')
const assessmentRouter = require('./routes/assessment')
const SubmissionRouter = require('./routes/submissions')
const gradeBookRouter = require('./routes/gradeBook')
const enrollmentRouter = require('./routes/enrollment')
const deadlineRouter = require('./routes/deadlines')
const achievementsRouter = require('./routes/achievementsRouter')
const forumn = require('./routes/forumnRouter')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')


const auth = require('./middleware/auth')


const fileUpload = require('express-fileupload')

app.use(
  fileUpload({
    debug: true,
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 4
  })
)

mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const publicDirectoryPath = path.join(__dirname, './view')

app.use(express.static(publicDirectoryPath))

app.use('/course-file', express.static('course-file'))

app.use(cors())
app.use('/users', user)
app.use('/discussions', discussionsRouter)
app.use('/announcements', AnnouncementsRouter)
app.use('/courses', course)
app.use('/projects', projects)
app.use('/assignment', assignment)
app.use('/cheatingDetection', cheatingDetection)
app.use('/article', article)
app.use('/notification', notification)
app.use('/deadlines', deadlineRouter)
app.use('/:courseId/', gradeBookRouter)
app.use('/:courseId/assessments', assessmentRouter)
app.use('/:courseId/enrollments', enrollmentRouter)
app.use('/:courseId/assessments/:assessmentId/submissions', SubmissionRouter)
app.use('/courses/:courseId/modules', courseModule)
app.use('/courses/:courseId/modules/:moduleId/module-item', courseModuleItem)
app.use('/courses/:courseId/lectures', lectureRouter)
app.use('/achievements', achievementsRouter)
app.use('/topics', forumn)
app.use("/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.port || 9000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:4500",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
