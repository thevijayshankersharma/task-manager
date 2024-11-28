const API_URL = 'http://localhost:3000/tasks';

let currentEditTask = null; // Keep track of the task being edited

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentFilter = 'all';

    async function loadTasks() {
        try {
            const res = await fetch(API_URL);
            const tasks = await res.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            taskList.innerHTML = '<p>Error loading tasks. Please try again later.</p>';
        }
    }

    function renderTasks(tasks) {
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            return task.status.toLowerCase() === currentFilter;
        });

        taskList.innerHTML = filteredTasks
            .map(
                (task) => `
            <div class="task">
                <div class="task-info">
                    <h3>${task.title}</h3>
                    <p>${task.description || ''}</p>
                    <p><strong>Due Date:</strong> ${task.due_date || 'Not set'}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                </div>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleStatus(${task.id}, '${task.status}')">
                        <i class="fas fa-check"></i> ${task.status === 'Pending' ? 'Complete' : 'Undo'}
                    </button>
                    <button class="edit-btn" onclick="startEditingTask(${task.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
            )
            .join('');
    }

    async function addTask(task) {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            loadTasks();
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        }
    }

    async function updateTask(id, task) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task),
            });
            currentEditTask = null; // Clear edit mode
            loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        }
    }

    window.toggleStatus = async function(id, currentStatus) {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
            await fetch(`${API_URL}/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            loadTasks();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update task status. Please try again.');
        }
    }

    window.deleteTask = async function(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                loadTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            }
        }
    }

    window.startEditingTask = async function(id) {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) {
                throw new Error('Task not found');
            }
            const task = await res.json();
            currentEditTask = task;

            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('due_date').value = task.due_date;

            document.getElementById('form-heading').innerText = 'Edit Task';
            document.getElementById('submit-button').innerHTML = '<i class="fas fa-save"></i> Update Task';
        } catch (error) {
            console.error('Error starting edit:', error);
            alert('Failed to load task for editing. Please try again.');
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const task = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            due_date: document.getElementById('due_date').value,
        };

        if (currentEditTask) {
            // Update the task
            await updateTask(currentEditTask.id, task);
        } else {
            // Add a new task
            await addTask(task);
        }

        // Reset the form and state
        taskForm.reset();
        document.getElementById('form-heading').innerText = 'Add New Task';
        document.getElementById('submit-button').innerHTML = '<i class="fas fa-plus"></i> Add Task';
    }

    taskForm.addEventListener('submit', handleFormSubmit);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            loadTasks();
        });
    });

    // Initial task loading
    loadTasks();
});

