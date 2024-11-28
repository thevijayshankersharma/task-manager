const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, due_date, status } = req.body;
    db.run(
        `INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)`,
        [title, description, due_date, status || 'Pending'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, ...req.body });
        }
    );
});

// Get all tasks
app.get('/tasks', (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Task not found' });
        res.json(row);
    });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, status } = req.body;
    db.run(
        `UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ?`,
        [title, description, due_date, status, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Toggle task status
app.patch('/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run(
        `UPDATE tasks SET status = ? WHERE id = ?`,
        [status, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
