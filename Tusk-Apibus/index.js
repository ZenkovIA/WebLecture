const puppeteer = require('puppeteer');
const readline = require('readline');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    // Задаем значения выбранных параметров
    var route = "023"; // Маршрут
    var type = "1"; // Тип транспорта
    var direction = "A"; // Направление
    var scheduleType = "23"; // Тип расписания
    const stop = "603|18"; // Остановка
    const scheduleTypeview = "0";  // Вид расписания

    // Создаем URL с заданными параметрами
    var url = "https://nskgortrans.ru/components/com_planrasp/helpers/grasp.php?" +
    "tv=mr" + // tv=mr - обязательный параметр
    "&m=" + route +
    "&t=" + type +
    "&r=" + direction +
    "&sch=" + scheduleType +
    "&s=" + stop +
    "&v=" + scheduleTypeview;

    await page.goto(url);

    // Ждем, пока страница загрузится
    await page.waitForSelector(scheduleTypeview === 1 ? '.tbl_plan_rasp_int' : '.tbl_plan_rasp');


    // Извлекаем данные из таблицы
    const scheduleData = await page.evaluate(() => {
    const scheduleRows = Array.from(document.querySelectorAll('.tbl_plan_rasp tbody tr'));
    const schedule = [];

    scheduleRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const rowData = cells.map(cell => cell.textContent.trim());
        schedule.push(rowData);
    });

    return schedule;
    });

    // Выводим расписание в консоль
    const formattedSchedule = formatScheduleData(scheduleData, scheduleTypeview);
    console.log(formattedSchedule);

    // Добавляем задержку в 5 секунд перед закрытием браузера
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
})();

function formatScheduleData(scheduleData, isFullSchedule) {
    const formattedSchedule = [];
  
    // Проходим по каждой строке расписания
    for (const row of scheduleData) {
      const formattedRow = [];
  
      // Если это полное расписание
      if (!isFullSchedule) {
        // Проходим по каждой паре час:минута в строке
        for (let i = 0; i < row.length; i += 2) {
          const hour = row[i];
          const minutes = row[i + 1];
  
          // Если минуты указаны, добавляем их к часу
          if (minutes) {
            const minuteArray = minutes.split('\n');
            const formattedMinutes = minuteArray.map(minute => `${hour}:${minute}`).join(', ');
            formattedRow.push(formattedMinutes);
          } else {
            // Если минуты не указаны, автобус не ходит в это время
            formattedRow.push(`Нет автобуса в ${hour}:00`);
          }
        }
      }

      // Добавляем отформатированную строку в расписание
      formattedSchedule.push(formattedRow.join('; '));
    }
  
    return formattedSchedule;
}
