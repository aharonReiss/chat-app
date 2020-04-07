const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMasseges,generateLocationMessages } = require('./utils/masseges')
const { addUser,removeUser,getUserById,getUsersInRoom } = require('./utils/users')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

const io = socketio(server)
//let count = 0

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('new web socket connection')

    socket.on('join', ( { username , room },callback ) => {
        
        const {error, user} = addUser( {id: socket.id, username, room} )

        if(error) {
            return callback(error)
        }

        socket.join(room)

        socket.emit('massege' , generateMasseges('admin','welcome'))
        socket.broadcast.to(room).emit('massege' , generateMasseges('admin',`${username} connendet!`))
        callback()

    })

    socket.on('sendMassege' , (msg, callback) => {
        
        const user = getUserById(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Profanity is not allowed!!')
        }
        
        io.to(user.room).emit('massege' , generateMasseges(user.username, msg))
        callback('deliverd')
    })

    socket.on('sharePosition' , (lat, lot, callback) => {
        const user = getUserById(socket.id)
        io.to(user.room).emit('locationMessage' , generateLocationMessages(`https://google.com/maps?q=${lat},${lot}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('massege' , generateMasseges('admin','disconnect'))
    })

    // socket.emit('countUpdated' , count)

    // socket.on('plus1' , () => {
    //     count++
    //     io.emit('countUpdated' , count)
    // })
})


server.listen(port, ()=> {
    console.log(`server is up on port ${port}`)
})