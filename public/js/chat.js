//CLIENT

const socket = io()

// server (emit) -> client (receive) --acknowledgement --> server

// client (emit) -> server (receive) --acknowledgement --> client
//const {generateMessage,generateLocationMessage}=require('./utils/messages')
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton  = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplate2 = document.querySelector('#message-template2').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options

const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('locationMessage',(message2)=>{

  const html2 = Mustache.render(messageTemplate2,{
    username:message2.username,
    url: message2.url,
    createdAt:moment(message2.createdAt).format('h:mm a') //message.createdAt
  })

  console.log("locationMessage url(chat.js): "+message2.url)

  $messages.insertAdjacentHTML('beforeend',html2)
  autoscroll()

  })

  socket.on('roomData',({room,users})=>{
  //  console.log(room)
  //  console.log(users)
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
  })

const autoscroll = ()=>{
  // New message elements
  const $newMessage = $messages.lastElementChild

  // height of the new message
  const newMessageStyles =  getComputedStyle($newMessage)
  const newMessageMargin= parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight+ newMessageMargin

  //console.log(newMessageMargin)

  // visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight=  $messages.scrollHeight

  // How far have I scrolled
  const scrollOffset= $messages.scrollTop + visibleHeight

  if(containerHeight - newMessageHeight <= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight
  }

}

socket.on('message',(message)=>{
  console.log("message url(chat.js): "+message.text)
  //socket.emit('countUpdated',count)
  const html = Mustache.render(messageTemplate,{
    username:message.username,
    message: message.text,
    createdAt:moment(message.createdAt).format('h:mm a') //message.createdAt
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
//  socket.emit('message',message)


})



$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()

  $messageFormButton.setAttribute('disabled','disabled')
  //disable button
//  const message = document.querySelector('input').value  // select by tag name
  const message = e.target.elements.inputmessage.value    // select by name
  socket.emit('sendMessage',message,(error)=>{
      $messageFormButton.removeAttribute('disabled')
      $messageFormInput.value=''
      $messageFormInput.focus()
    //enable button
    if(error){
      return console.log(error)
    }
    console.log('The message was delivered!(chat.js)',msg)
  })
})
$locationButton.addEventListener('click',()=>{
  $locationButton.setAttribute('disabled','disabled')
  if(!navigator.geolocation){
    return alert('Gelocation is not supported by your browser(chat.js)')
  }
  navigator.geolocation.getCurrentPosition((position)=>{
  //  console.log(position)
    const latitude=position.coords.latitude
    const longitude=position.coords.longitude
    const coord={
      lat:latitude,
      long:longitude
    }
    socket.emit('sendLocation',coord,()=>{
      $locationButton.removeAttribute('disabled')
    console.log('1The location was shared and delivered!(chat.js)')

    })
console.log('2The location was shared and delivered!(chat.js)')
  })
})

socket.emit('join', {username, room},(error)=>{
  if(error){
    alert(error)
    location.href='/'
  }
})
