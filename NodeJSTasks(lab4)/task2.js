const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const filePath = 'G:/Список дел/NodeJSTasks/rabota.txt'; 

app.use(express.text()); 


app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Ошибка при чтении файла');
      return;
    }
    res.send(data);
  });
});


app.post('/', (req, res) => {
  const dataToAdd = req.body;
  fs.appendFile(filePath, dataToAdd, (err) => {
    if (err) {
      res.status(500).send('Ошибка при записи в файл');
      return;
    }
    res.send('Данные добавлены в файл');
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});