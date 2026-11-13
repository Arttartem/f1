const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 100;

app.use(express.json({ limit: '10kb' }));


function prepareMessagesFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function readMessages() {
  prepareMessagesFile();
  const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
  const messages = JSON.parse(fileContent);

  if (!Array.isArray(messages)) {
    throw new Error('Файл отзывов должен содержать массив');
  }

  return messages;
}

function saveMessages(messages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
}


app.get('/api/messages', (req, res) => {
  try {
    const messages = readMessages();
    res.json(messages);
  } catch (error) {
    console.error('Не удалось прочитать отзывы:', error.message);
    res.status(500).json({ error: 'Не удалось загрузить отзывы' });
  }
});


app.post('/api/messages', (req, res) => {
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'Напишите текст отзыва' });
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Отзыв должен быть не длиннее ${MAX_MESSAGE_LENGTH} символов`
    });
  }

  try {
    const messages = readMessages();
    const newMessage = {
      id: Date.now(),
      text,
      date: new Date().toISOString()
    };

    messages.push(newMessage);

    
    const recentMessages = messages.slice(-MAX_MESSAGES);
    saveMessages(recentMessages);

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Не удалось сохранить отзыв:', error.message);
    res.status(500).json({ error: 'Не удалось сохранить отзыв' });
  }
});


app.use((req, res, next) => {
  if (req.path.startsWith('/node_modules') || /\.(json|txt)$/i.test(req.path) || req.path === '/server.js') {
    return res.sendStatus(404);
  }
  next();
});


app.use(express.static(__dirname));


app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Проверьте формат отправляемых данных' });
  }
  next(error);
});

app.listen(PORT, () => {
  console.log(`Сайт запущен: http://localhost:${PORT}`);
});
