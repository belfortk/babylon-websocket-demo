const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const fs = require('fs');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('file uploaded', function(fileData){
    console.log(fileData);
    // const newFile = Buffer.from(fileData.data);
    // const fileData = {
    //   name: file.name,
    //   data: newFile
    // }
    socket.broadcast.emit('file uploaded', fileData);
    // fs.writeFile(fileData.name, newFile, (err) => {
    //   if(err) {
    //     console.log(err);
    //   }  else {
    //     console.log(`file: ${fileData.name} written successfully`);
    //     fs.readFile(fileData.name, (err, data) => {
    //       if (err) throw err;
    //       console.log(data);
    //       socket.broadcast.emit('file uploaded', data);
    //     });
    //   }
    // });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

