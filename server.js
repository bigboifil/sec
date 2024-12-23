const http = require('http');

// Хранилище для уникальных IP-адресов
const savedIPs = new Set();

// Создаём сервер
const server = http.createServer((req, res) => {
    // Получение локального IP
    const ipAddresses = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const localIP = ipAddresses.split(',').pop().trim();

    // Если IP уже существует в хранилище, ничего не делаем
    if (savedIPs.has(localIP)) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Данные уже сохранены.');
        return;
    }

    // Добавляем IP в хранилище
    savedIPs.add(localIP);

    // Формируем данные пользователя
    const userData = {
        ip: localIP,
        userAgent: req.headers['user-agent'],
        time: new Date().toISOString(),
    };

    // Логируем данные только для новых IP
    console.log('Новый пользователь:', userData);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Сервер работает, данные записаны!');
});

// Порт, который выбирает Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
