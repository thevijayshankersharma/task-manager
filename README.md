# Task Management System

A simple Task Management System built using **Node.js** and **SQLite**. This application allows users to create, view, update, and delete tasks, with basic error handling and user interface. The goal of this project is to implement core **CRUD operations** (Create, Read, Update, Delete) and ensure ease of use and functionality.

## Features

- Create tasks with a title, description, due date, and status.
- View a list of all tasks.
- Update task details (edit title, description, due date, and status).
- Delete tasks with a confirmation prompt.
- Filter tasks by status (Pending, Completed).
- Basic form validation (prevents empty fields).

## Tech Stack

- **Backend:** Node.js (with Express)
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript
- **API:** RESTful APIs for CRUD operations

## Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js** installed on your machine.
- **npm** for package management.

### 1. Clone the repository

```bash
git clone https://github.com/thevijayshankersharma/task-manager.git
cd task-manager
```

### 2. Install dependencies

#### Backend (Node.js)

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

### 3. Run the Backend Server

Start the Node.js server:

```bash
npm start
```

The backend server will be running on [http://localhost:3001](http://localhost:3001).

### 4. Frontend Setup

#### Using React (Optional)

If you're using React for the frontend, navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

### 5. Run the Frontend

Open the ```index.html``` file in a web browser.


### 6. Database Setup

SQLite is used as the database. The database will be created automatically when the backend is started. It stores task data such as title, description, due date, and status.