  //SERVER

const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path=require('path')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const publicDirectoryPath = path.join(__dirname,'../public')  //__dirname = current directory
const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port=process.env.PORT
app.use(express.static(publicDirectoryPath))

let count = 0
//server (emit) -> client (receive) : countUpdated
//client (emit) -> server (receive) : increment
//const message='1Welcome!(index.js)'
io.on('connection',(socket)=>{
  console.log('New socket connection (index.js)')

//  socket.emit('message',generateMessage('Welcome! (index.js)'))
//socket.broadcast.emit('message',generateMessage('A new user has joined(index.js)'))

  socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})

    if(error){
      return callback(error)
    }
    socket.join(user.room)

    socket.emit('message',generateMessage(user.username,'Welcome! (index.js)'))
    socket.broadcast.to(user.room).emit('message',generateMessage(user.username,`${user.username} has joined(index.js)`))
io.to(user.room).emit('roomData',{
  room:user.room,
  users: getUsersInRoom(user.room)
})
    callback()
    //socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit    // for room
  })

  socket.on('sendMessage',(msg,callback)=>{
    const filter=new Filter()
    if(filter.isProfane(msg)){
      return callback('Profanity is not allowed!(index.js)')
    }
    const user = getUser(socket.id)
    io.to(user.room).emit('message',generateMessage(user.username,msg))
    callback('Delivered')
  })
//  socket.on('message',message)
  socket.on('sendLocation',(msg,callback)=>{
    const user = getUser(socket.id)
   io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${msg.lat},${msg.long}`))

  //console.log(`(index.js)https://google.com/maps?q=${msg.lat},${msg.long}`)
//  const loc=`https://google.com/maps?q=${msg.lat},${msg.long}`
    callback('Location Delivered(index.js)')
  })
  socket.on('disconnect',()=>{
    const user = removeUser(socket.id)

    if(user){
      io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left!(index.js)`))
      io.to(user.room).emit('roomData',{
        room:user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
})
/*
app.listen(port,()=>{
  console.log('Server is up on port(index.js) '+port)
})
*/
server.listen(port,()=>{
  console.log('Server is up on port(index.js) '+port)
})
