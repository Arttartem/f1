const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());

app.use(express.json());


app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync('./messages.json', 'utf8');
        res.json(JSON.parse(data)); 
    } catch (error) {
        res.status(500).json({ error: "Ошибка чтения базы данных" });
    }
});


app.post('/api/message', (req, res) => {
    const newMessage = req.body.text; 
    
    if (!newMessage) {
        return res.status(400).json({ success: false, error: "Пустой текст" });
    }

    try {
       
        const data = fs.readFileSync('./messages.json', 'utf8');
        const messages = JSON.parse(data);
        
       
        messages.push({ id: Date.now(), text: newMessage });
     
        fs.writeFileSync('./messages.json', JSON.stringify(messages, null, 2));
        
    
        res.json({ success: true, message: "Сообщение сохранено!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Ошибка записи" });
    }
});


app.listen(PORT, () => {
    console.log(`Бэкенд запущен на http://localhost:${PORT}`);
});
