// Ждем, пока весь DOM загрузится, перед тем как начать выполнение скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Получаем необходимые элементы DOM
    const addTaskButton = document.getElementById("addTaskButton");
    const cleanAllButton = document.getElementById("cleanAllButton");
    const sortOptions = document.getElementById("sortOptions");
    const filterLinks = document.querySelectorAll('.filters .filter-link');

    // Добавляем обработчики событий для кнопок и ссылок фильтров
    addTaskButton.addEventListener('click', addTask);
    cleanAllButton.addEventListener('click', delAllTask);
    sortOptions.addEventListener('change', sortTasks);

    filterLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            filterTasks(this.getAttribute('data-filter'));
        });
    });

    // Загружаем сохраненные задачи при загрузке страницы
    loadTasks();
});

// Функция для добавления новой задачи
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    // Проверяем, что введенное значение не пустое
    if (taskInput.value.trim() !== "") {
        let task = document.createElement("li");

        // Создаем HTML для новой задачи
        task.innerHTML =
            `<div>
                <button class="complete"></button>
            </div>
            <div class="task-details">
                <div class="task-text">${taskInput.value}</div>
                <div class="task-date"><sub>от ${date_time()}</sub></div>
            </div>
            <div>
                <button class="delete"></button>
            </div>`;

        // Добавляем новую задачу в список
        taskList.appendChild(task);
        taskInput.value = "";

        // Сохраняем задачи в localStorage
        saveTasks();

        // Привязываем обработчики событий для кнопок вновь добавленной задачи
        task.querySelector('.complete').addEventListener('click', function() { toggleTask(task); });
        task.querySelector('.delete').addEventListener('click', function() { delCurTask(task); });
    }
}

// Функция для переключения состояния задачи (выполнена/не выполнена)
function toggleTask(taskElement) {
    taskElement.classList.toggle('completed-bg');
    let taskText = taskElement.querySelector('.task-text');
    taskText.classList.toggle('completed');
    saveTasks();
}

// Функция для удаления текущей задачи
function delCurTask(taskElement) {
    taskElement.remove();
    saveTasks();
}

// Функция для удаления всех задач
function delAllTask() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    saveTasks();
}

// Функция для фильтрации задач по категориям
function filterTasks(filter) {
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed-bg':
                if (task.classList.contains('completed-bg')) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (!task.classList.contains('completed-bg')) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
        }
    });
}

// Функция для сортировки задач
function sortTasks() {
    const taskList = document.getElementById("taskList");
    const tasks = Array.from(taskList.querySelectorAll("li"));
    const sortOption = document.getElementById("sortOptions").value;

    switch (sortOption) {
        case "newest":
            tasks.sort((a, b) => {
                const textB = b.querySelector(".task-date").innerText.toLowerCase();
                const textA = a.querySelector(".task-date").innerText.toLowerCase();
                return textB.localeCompare(textA);
            });
            break;
        case "oldest":
            tasks.sort((a, b) => {
                const textB = b.querySelector(".task-date").innerText.toLowerCase();
                const textA = a.querySelector(".task-date").innerText.toLowerCase();
                return textA.localeCompare(textB);
            });
            break;
        case "az":
            tasks.sort((a, b) => {
                const textA = a.querySelector(".task-text").innerText.toLowerCase();
                const textB = b.querySelector(".task-text").innerText.toLowerCase();
                return textA.localeCompare(textB);
            });
            break;
        case "za":
            tasks.sort((a, b) => {
                const textA = a.querySelector(".task-text").innerText.toLowerCase();
                const textB = b.querySelector(".task-text").innerText.toLowerCase();
                return textB.localeCompare(textA);
            });
            break;
    }

    tasks.forEach(task => task.remove());
    tasks.forEach(task => taskList.appendChild(task));
}

// Функция для сохранения задач в localStorage
function saveTasks() {
    const tasks = document.querySelectorAll("#taskList li");
    const tasksData = [];

    tasks.forEach(task => {
        const taskText = task.querySelector(".task-text").innerText;
        const taskDate = task.querySelector(".task-date").innerText;
        const taskCompleted = task.classList.contains("completed-bg");

        tasksData.push({
            text: taskText,
            date: taskDate,
            completed: taskCompleted
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// Функция для загрузки задач из localStorage
function loadTasks() {
    const tasksData = localStorage.getItem("tasks");

    if (tasksData) {
        const tasks = JSON.parse(tasksData);
        const taskList = document.getElementById("taskList");

        tasks.forEach(task => {
            const newTask = document.createElement("li");

            newTask.innerHTML = `
                <div>
                    <button class="complete"></button>
                </div>
                <div class="task-details">
                    <div class="task-text">${task.text}</div>
                    <div class="task-date"><sub>${task.date}</sub></div>
                </div>
                <div>
                    <button class="delete"></button>
                </div>`;

            if (task.completed) {
                newTask.classList.add('completed-bg');
                newTask.querySelector('.task-text').classList.add('completed');
            }

            taskList.appendChild(newTask);

            // Привязываем обработчики событий для кнопок вновь добавленной задачи
            newTask.querySelector('.complete').addEventListener('click', function() { toggleTask(newTask); });
            newTask.querySelector('.delete').addEventListener('click', function() { delCurTask(newTask); });
        });
    }
}

// Функция для добавления ведущих нулей к числу
function zero_first_format(value) {
    if (value < 10) {
        value = '0' + value;
    }
    return value;
}

// функция получения текущей даты и времени
function date_time() {
    var current_datetime = new Date();
    var day = zero_first_format(current_datetime.getDate());
    var month = zero_first_format(current_datetime.getMonth() + 1);
    var year = current_datetime.getFullYear();

    return day + "." + month + "." + year;
}
