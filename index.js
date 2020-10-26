const app = require('express')()

const http = require('http').createServer(app)

const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html')
})

const connectedClients = {

}

io.on('connection', socket => {
    console.log('New user Connected')
    socket.on('disconnect', () => {
        console.log(' user disconnected')
        io.emit('bye bye', connectedClients[socket.id])
        delete connectedClients[socket.id]
    })
    socket.on('message', (e) => {
        console.log('new msg : , ', e)
        socket.broadcast.emit('knock knock', e)
    })

    socket.on('typing', (e) => {
        console.log('typing : ', e)
        socket.broadcast.emit('someone is typing', e)
    })

    socket.on('i have a name', (e) => {
        console.log("name :", e, socket.id)
        connectedClients[socket.id] = e
        io.emit('welcome', e)
        console.log(connectedClients)
    })
})

http.listen(1000, () => console.log('Server Running'))