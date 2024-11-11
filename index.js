const { createServer } = require('node:http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');

const app = express();
const server = createServer(app);

app.use(cors({
  origin: 'https://codeshare-frontend.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: "https://codeshare-frontend.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    transports: ['websocket', 'polling']
  }
});

app.get('/', (req, res) => {
  res.send("Hello");
});

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('joinRoom', (url) => {
    socket.join(url);
    console.log(`User ${socket.id} joined room: ${url}`);
  });

  socket.on('chat message', (msg, url) => {
    console.log('message: ', msg, url);
    io.to(url).emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
