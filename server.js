const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/message', (req, res) => {
    const newMessage = req.body.text;
    if (!newMessage) {
        return res.status(400).json({ success: false });
    }

    const data = fs.readFileSync('./messages.json', 'utf8');
    const messages = JSON.parse(data);
    
    messages.push({ id: Date.now(), text: newMessage });
    fs.writeFileSync('./messages.json', JSON.stringify(messages, null, 2));
    
    res.json({ success: true, message: "Сохранено" });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});