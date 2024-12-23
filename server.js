const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// GitHub конфигурация
const GITHUB_TOKEN = 'твой_токен';
const REPO_OWNER = 'твой_логин'; // Логин пользователя или организация
const REPO_NAME = 'название_репозитория';
const BRANCH = 'main'; // Ветка, куда отправляются данные

app.use(express.json());

// Эндпоинт для получения данных пользователя
app.post('/api/save-user-data', async (req, res) => {
    const userData = req.body;

    // Создаем уникальное имя файла
    const ip = userData.ip.split(',')[0].trim();
    const fileName = `data/${ip}/${new Date().toISOString()}.json`;
    const fileContent = JSON.stringify(userData, null, 2);

    // Составляем запрос для GitHub API
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;
    const commitMessage = `Добавлены данные для IP ${ip}`;

    try {
        // Получаем SHA старого файла (если он существует)
        let sha = null;
        try {
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            });
            sha = data.sha;
        } catch (error) {
            if (error.response.status !== 404) {
                throw error;
            }
        }

        // Сохраняем новый файл
        await axios.put(
            url,
            {
                message: commitMessage,
                content: Buffer.from(fileContent).toString('base64'),
                branch: BRANCH,
                sha,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );

        res.status(200).json({ message: 'Данные успешно сохранены на GitHub' });
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error.message);
        res.status(500).json({ error: 'Ошибка при сохранении данных' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
