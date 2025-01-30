// Inicjalizacja - załaduj zadania z Local Storage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.addEventListener('click', handleOutsideClick);
});

// Funkcja dodawania nowego zadania
function addTask() {
    const taskInput = document.getElementById('newTaskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    // Walidacja zadania
    if (taskText.length < 3 || taskText.length > 255) {
        alert("Zadanie musi mieć od 3 do 255 znaków.");
        return;
    }

    if (dueDate && new Date(dueDate) <= new Date()) {
        alert("Data musi być w przyszłości lub pusta.");
        return;
    }

    // Dodanie nowego zadania do listy
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, dueDate: dueDate, completed: false });
    saveTasksToLocalStorage(tasks);

    // Wyczyść pola i odśwież listę
    taskInput.value = '';
    dueDateInput.value = '';
    loadTasks();
}

// Funkcja usuwania zadania
function deleteTask(index) {
    const tasks = getTasksFromLocalStorage();
    tasks.splice(index, 1);
    saveTasksToLocalStorage(tasks);
    loadTasks();
}

// Funkcja wyszukiwania zadań
function searchTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.length < 2) {
        loadTasks();
        return;
    }

    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));

    renderTasks(filteredTasks, searchTerm);
}

// Wyróżnienie wyszukiwanej frazy w zadaniu
function highlightTerm(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Funkcja wyświetlania i edycji listy zadań
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    renderTasks(tasks);
}

// Renderowanie zadań
function renderTasks(tasks, searchTerm = '') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        // Wyświetl checkbox, tekst zadania z możliwością edycji oraz pole daty
        li.innerHTML = `
            <input type="checkbox" class="taskCheckbox" data-index="${index}" ${task.completed ? 'checked' : ''} onclick="toggleTaskCompletion(${index})">
            <span class="taskText" contenteditable="true" data-index="${index}" onblur="saveTask(${index})">${searchTerm ? highlightTerm(task.text, searchTerm) : task.text}</span>
            <input type="date" class="dueDateInput" data-index="${index}" value="${task.dueDate || ''}" onblur="saveTask(${index})" />
            <button class="deleteBtn" onclick="deleteTask(${index})">🗑️</button>
        `;

        taskList.appendChild(li);
    });
}

// Funkcja edytowania i zapisywania zadania po kliknięciu poza zadaniem
function saveTask(index) {
    const taskText = document.querySelector(`.taskText[data-index="${index}"]`).textContent.trim();
    const dueDateInput = document.querySelector(`.dueDateInput[data-index="${index}"]`);

    if (taskText.length < 3 || taskText.length > 255) {
        alert("Zadanie musi mieć od 3 do 255 znaków.");
        return;
    }

    const tasks = getTasksFromLocalStorage();
    tasks[index].text = taskText;
    tasks[index].dueDate = dueDateInput.value || null; // Jeśli brak daty, ustaw na null
    saveTasksToLocalStorage(tasks);
    loadTasks();
}

// Funkcja zmiany stanu zadania (ukończone/nieukończone)
function toggleTaskCompletion(index) {
    const tasks = getTasksFromLocalStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToLocalStorage(tasks);
    loadTasks();
}

// Zewnętrzny klik - jeśli użytkownik kliknie poza polem edycji, zapisz zmiany
function handleOutsideClick(event) {
    const activeTask = document.querySelector('.taskText[contenteditable="true"]:focus');
    if (activeTask && !activeTask.contains(event.target)) {
        const index = activeTask.getAttribute('data-index');
        saveTask(index);
    }
}

// Pobieranie zadań z Local Storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Zapis zadań do Local Storage
function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
