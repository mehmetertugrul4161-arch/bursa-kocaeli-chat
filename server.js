const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statik dosyaları sunmak için
app.use(express.static(__dirname));

// Ana sayfa isteği (GET /) için index.html dosyasını gönder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io bağlantı ve sinyalleşme yönetimi
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı: ' + socket.id);

    // Gelen sohbet mesajını diğer kullanıcılara ilet
    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('chat-message', {
            sender: 'Kuzen',
            message: msg
        });
    });

    // WebRTC Sinyalleşme olayları (Görüntülü ve sesli arama için)
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı: ' + socket.id);
    });
});

// Render'ın vereceği port veya yerel test için 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
