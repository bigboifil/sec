const http = require('http');
const axios = require('axios');
const userAgent = require('useragent');

// Хранилище для уникальных IP-адресов
const savedIPs = new Set();

const server = http.createServer(async (req, res) => {
    const ipAddresses = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const localIP = ipAddresses.split(',')[0].trim(); // Берём первый IP

    if (savedIPs.has(localIP)) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hi again!');
        return;
    }

    savedIPs.add(localIP);

    // Основная информация о пользователе
    const userData = {
        ip: localIP,
        userAgent: req.headers['user-agent'],
        time: new Date().toISOString(),
        language: req.headers['accept-language'] || 'unknown',
        referrer: req.headers['referer'] || 'direct',
        connection: req.headers['connection'] || 'unknown',
    };

    // Расширенный анализ user-agent
    const agent = userAgent.parse(req.headers['user-agent']);
    userData.browser = agent.toAgent();
    userData.os = agent.os.toString();
    userData.device = agent.device.toString();

    // Геолокация по IP
    try {
        const response = await axios.get(`http://ip-api.com/json/${localIP}`);
        userData.geo = {
            country: response.data.country,
            region: response.data.regionName,
            city: response.data.city,
            isp: response.data.isp,
        };
    } catch (error) {
        console.error('Ошибка получения геолокации:', error.message);
        userData.geo = 'не удалось определить';
    }

    console.log('Новый пользователь:', userData);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Have a good day!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
