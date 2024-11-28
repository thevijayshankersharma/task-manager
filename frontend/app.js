const API_URL = 'http://localhost:3000/tasks';

async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = tasks
        .map(
            (task) => `
        <div class="task">
            <div>
                <h3>${task.title}</h3>
                <p>${task.description || ''}</p>
                <p>Due: ${task.due_date || 'Not set'}</p>
                <p>Status: ${task.status}</p>
            </div>
            <div>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `
        )
        .join('');
}

async function addTask(task) {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    loadTasks();
}

async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadTasks();
    }
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        due_date: document.getElementById('due_date').value,
    };
    await addTask(task);
    document.getElementById('task-form').reset();
});

loadTasks();
