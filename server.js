const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Эндпоинт для получения данных пользователя
app.post('/api/save-user-data', (req, res) => {
    const userData = req.body;

    // Извлекаем первый IP-адрес из списка (если несколько)
    const ip = userData.ip.split(',')[0].trim();

    // Путь для сохранения данных
    const userDir = path.join(__dirname, 'data', ip);

    // Проверяем, существует ли папка для этого IP, если нет — создаем
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    // Создаем файл для хранения данных с именем по текущему времени
    const fileName = `${new Date().toISOString()}.json`;
    const filePath = path.join(userDir, fileName);

    // Записываем данные в файл
    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка записи данных' });
        }
        res.status(200).json({ message: 'Данные успешно сохранены' });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
