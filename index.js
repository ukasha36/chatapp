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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io code
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (msg) => {
    // Broadcast the message to all clients except the sender
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
