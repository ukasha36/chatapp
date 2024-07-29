import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

// ES modules way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add your socket.io code here
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg)
})
});
