// imports
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const fs = require('fs');

// app state
let currentFile;
let clientCount = 0;
const currentConnectedClients = [];

// let me us know server is running
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// send html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// socket.io listener
io.on('connection', (socket) => {
  const id = clientCount;
  addClient(currentConnectedClients, id)

  // if there is already a model being shared, new connected clients will get it
  if(currentFile){
    socket.emit('file uploaded', currentFile);
  }

  // when a new model is shared, send to all other connected clients
  socket.on('file uploaded', (fileData) => {
    currentFile = fileData;
    socket.broadcast.emit('file uploaded', fileData);
  });

  // when a user leaves, remove them from the list
  socket.on('disconnect', () => {
    removeClient(currentConnectedClients, id);

    // if there are no users left, reset the file to null
    if(currentConnectedClients.length === 0){
      currentFile = null;
    }
  });
});

// helper functions
const addClient = (clientList, id) => {
  clientCount = clientCount + 1;
  clientList.push(id);
}

const removeClient = (clientList, clientId) => {
  const indexOfClient = clientList.indexOf(clientId);
  return clientList.splice(indexOfClient, 1)
}

