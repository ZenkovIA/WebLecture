const fs = require('fs');
const path = 'G:/Список дел/NodeJSTasks/rabota.txt'; 

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const reversedData = data.split('').reverse().join('');
  fs.writeFile(path, reversedData, (err) => {
    if (err) {
      console.error(err);
    }
  });
});