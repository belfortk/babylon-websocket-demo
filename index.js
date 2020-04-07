const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let file;
io.on('connection', function(socket){
  console.log('a user connected');
  if(file){
    socket.emit('file uploaded', file);
  }
  socket.on('file uploaded', function(fileData){
    file = fileData;
    socket.broadcast.emit('file uploaded', fileData);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

