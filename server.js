const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Ajuste para 'https://app-n1qv.onrender.com' em produção
        methods: ['GET', 'POST'],
    },
});


app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        console.log('Mensagem recebida:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;

console.log(`Server running on port ${PORT}`);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});