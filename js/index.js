const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../index.html');
});

let players = [];

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (name) => {
    players.push({ id: socket.id, name: name });
    socket.emit('player', { id: socket.id, name: name });
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    players = players.filter(player => player.id !== socket.id);
    io.emit('players', players);
  });
});

http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
