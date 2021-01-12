//Client Side Coding and view results in browser results

//connection intializes
const socket = io()

const messages = document.getElementById("messages")
const messageTemplate = document.getElementById("message-template").innerHTML

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(document.getElementById("message-template").innerHTML)
    console.log(html)
    document.getElementById("messages").insertAdjacentElement('beforeend',html)
})
//Submit eventlistener function will work only with Form Id
document.getElementById("Sending").addEventListener('submit',(e)=>{   
    e.preventDefault() 
    var val = document.getElementById('input').value
    //Not working
    document.getElementById('button').setAttribute('disabled','disabled')
    console.log(val)
    socket.emit('sending',val,(ack)=>{
        //make sure to have a separate id for this 
        document.getElementById('button').removeAttribute('disabled')
        document.getElementById('input').value = ''
        document.getElementById('input').focus()
        console.log(ack)
    })
})

document.querySelector("#send-location").addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser is old, kindly use some modern browser to utilize this feature')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        var latitude = position.coords.latitude
        var longitude = position.coords.longitude
        document.getElementById('send-location').setAttribute('disabled','disabled')
        socket.emit('location',latitude,longitude,(ack)=>{
            document.getElementById('send-location').removeAttribute('disabled')
            console.log(ack)
        })
    })
})
