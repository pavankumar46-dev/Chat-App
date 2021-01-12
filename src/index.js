const express = require('express')
const http = require('http')
const path = require('path')
const Socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
// Socket.io expects the raw http request but express will do those stuffs behind the secens
const server = http.createServer(app)
const io = Socketio(server)

const port = process.env.PORT || 3003

const static_file_path = path.join(__dirname,'../public')

app.use(express.static(static_file_path))

// connection is inbuilt name (connection event name)
// Server side connection
io.on('connection',(socket)=>{
    console.log("New Socket Connection")

    socket.broadcast.emit('message', 'New Connection Established')
    socket.on('sending',(val,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(val)){
            return callback('This sort of input is not allowable')
        }

        io.emit('sending',val)
        callback('Delivered Successfully')
    })
    socket.on('disconnect',()=>{
        io.emit('message','User left !')
    })
    socket.on('location',(latitude,longitude,callback)=>{
        console.log(latitude,longitude)
        io.emit('message',`https://google.com/maps?q=${latitude},${longitude}`)
        callback('Successfully Shared the location')

    })
})  


server.listen(port, ()=>{
    console.log(`Application started on port ${port}`)
})

