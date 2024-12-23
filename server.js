const http = require('http');

// Создаём сервер
const server = http.createServer((req, res) => {
    const userData = {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        time: new Date().toISOString()
    };

    // Логируем данные на сервере (для теста)
    console.log('Данные пользователя:', userData);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Сервер работает, данные записаны!');
});

// Порт, который выбирает Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
