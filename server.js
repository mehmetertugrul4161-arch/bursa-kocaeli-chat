const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Statik dosyaları sunmak için public klasörünü açıyoruz
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });

    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});

const path = require('path');

// Ana sayfaya (GET /) gelen istekler için index.html dosyasını gönder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
