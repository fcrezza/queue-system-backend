import express from "express";
import "express-async-errors";
import http from "http";
import {v2 as cloudinary} from "cloudinary";
// import socketIO from 'socket.io'

// import {updateProfessorStatus} from './model/professor'
// import {
//   getQueueByProfessorID,
//   requestQueue,
//   updateQueueStatusByStudentID,
//   cancelQueue,
// } from './model/common'
import routes from "./routes";
import morgan from "./utils/morgan";
import cors from "./utils/cors";
import session from "./utils/session";
import passport from "./utils/passport";
import errorMiddleware from "./middlewares/errormiddleware";

const app = express();
const server = http.createServer(app);
// const io = socketIO(server)
cloudinary.config({
  cloud_name: "ds1qv6d0u",
  api_key: "157869936114419",
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors);
app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session);
// io.use((socket, next) => {
//   session(socket.request, socket.request.res || {}, next)
// })
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);
app.use(errorMiddleware);
// io.on('connection', (socket) => {
//   socket.on('getQueue', async (id) => {
//     const antrian = await getQueueByProfessorID(id)
//     socket.emit('newData', antrian, id)
//   })

//   socket.on('requestQueue', async ({id, professorID: profID}) => {
//     await requestQueue(id, profID)
//     const antrian = await getQueueByProfessorID(profID)
//     socket.emit('newData', antrian, profID)
//     socket.broadcast.emit('newData', antrian, profID)
//   })

//   socket.on('outFromQueue', async ({time, id, professorID: profID}) => {
//     await cancelQueue(time, id, profID)
//     const antrian = await getQueueByProfessorID(profID)
//     socket.emit('newData', antrian, profID)
//     socket.broadcast.emit('newData', antrian, profID)
//   })

//   socket.on('makeMeOnline', async () => {
//     const {passport: passportSession} = socket.request.session
//     await updateProfessorStatus(1, passportSession.user.id)
//     socket.broadcast.emit('professorStatus', {
//       id: passportSession.user.id,
//       status: 1,
//     })
//   })

//   socket.on('nextQueue', async (previousActiveUser, nextUser) => {
//     const {passport: passportSession} = socket.request.session

//     if (previousActiveUser) {
//       const {id, time} = previousActiveUser
//       await updateQueueStatusByStudentID(id, time, 'completed')
//     }

//     if (nextUser) {
//       const {id, time} = nextUser
//       await updateQueueStatusByStudentID(id, time, 'active')
//     }

//     const antrian = await getQueueByProfessorID(passportSession.user.id)
//     socket.emit('newData', antrian, passportSession.user.id)
//     socket.broadcast.emit('newData', antrian, passportSession.user.id)
//   })

//   socket.on('disconnect', async () => {
//     const {passport: passportSession} = socket.request.session
//     const isProfessor = passportSession.user.role === 'professor'
//     if (isProfessor) {
//       await updateProfessorStatus(0, passportSession.user.id)
//       socket.broadcast.emit('professorStatus', {
//         id: passportSession.user.id,
//         status: 0,
//       })
//     }
//   })
// })

const port = process.env.PORT || 4000;
// eslint-disable-next-line
server.listen(port, () => console.log(`server listen on port ${port}`));
