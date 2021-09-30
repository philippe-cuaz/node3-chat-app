//const at=require('array.prototype.at')
const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id,username,room})=>{
  // Clean the data
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()

  // validate the data
  if(!username || !room){
    return {
      error: 'Username and room are required'
    }
  }

  // Check for existing users
  const existingUser = users.find((user)=>{
    return user.room === room && user.username === username
  })

// Validate Username
if(existingUser){
return {
  error: 'Username is in use!'
}
}

// Store users
const user = {id, username,room}
users.push(user)
return{user}
}


const removeUser = (id)=>{
  const index = users.findIndex((user)=>{
    return user.id===id
  })
  if(index !== -1){
    return users.splice(index,1)[0]
  }
}


addUser({
  id:22,
  username:'Philippe',
  room:'South Philly'
})
addUser({
  id:42,
  username:'Mike',
  room:'South Philly'
})
addUser({
  id:32,
  username:'Philippe',
  room:'Center City'
})
//console.log(users)

const getUser = (id)=>{
  const index = users.findIndex((user)=>{
    const res=user.id===id
    return res
  })
  if(index !== -1){
    return users[index]
  }
  else {
    return 'undefined'
  }
}

const getUsersInRoom = room=> users.filter(user=>user.room === room.toLowerCase())
/*
const res = addUser({
  id:33,
  username:'philippe',
  room:'south philly'
})

console.log(res)
*/
/*
const removedUser = removeUser(22)

console.log(removedUser)
console.log(users)
*/
/*
const getTheUser1=getUser(42)
console.log(getTheUser1)
const getTheUser2=getUser(41)
console.log(getTheUser2)
const getTheUsersInRoom1=getUsersInRoom('South Philly')
console.log(getTheUsersInRoom1)
const getTheUsersInRoom2=getUsersInRoom('Center City')
console.log(getTheUsersInRoom2)
*/
//const userList = getUsersInRoom('')

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
