## Team Task Manager

Team Task Manager is a full-stack web application built to help teams manage projects and tasks in an organized way.
The application allows users to create projects, assign tasks, track progress, and manage team collaboration with role-based authentication.

This project was developed using React.js for the frontend and Node.js + Express.js for the backend, with PostgreSQL as the database.

---

## Live Demo

Frontend
https://successful-mindfulness-production-5da6.up.railway.app

Backend API
https://team-task-manager-production-c80b.up.railway.app

GitHub Repository
https://github.com/Amanvads/Team-Task-Manager

---

## Features

* User Signup and Login
* JWT Authentication
* Role-Based Access (Admin & Member)
* Create and Manage Projects
* Create, Assign, and Update Tasks
* Task Status Tracking

  * TODO
  * IN PROGRESS
  * DONE
* Dashboard with Task Analytics
* Protected Routes
* Responsive User Interface
* PostgreSQL Database Integration
* Railway Deployment

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Prisma ORM
* JWT Authentication
* bcryptjs

### Database

* PostgreSQL

### Deployment

* Railway

---

## Project Structure

Team-Task-Manager

Client

* components
* pages
* api.jsx
* App.jsx
* main.jsx

Server

* prisma
* middleware
* routes
* index.js
* prisma.js

---

## Installation

### Clone Repository

git clone https://github.com/Amanvads/Team-Task-Manager.git

---

### Install Frontend Dependencies

cd Client
npm install

---

### Install Backend Dependencies

cd ../Server
npm install

---

### Setup Environment Variables

Create a `.env` file inside the Server folder.

Example:

DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

---

### Run Prisma Migration

npx prisma migrate dev

---

### Start Backend

npm run dev

---

### Start Frontend

cd ../Client

npm run dev

---

## Dashboard

The dashboard provides an overview of:

* Total Projects
* Total Tasks
* Pending Tasks
* Tasks In Progress
* Completed Tasks
* Overdue Tasks

---

## Authentication

The project uses JWT-based authentication to protect routes and APIs.

---

## Deployment

The project is deployed using Railway.

Frontend and backend are hosted separately and connected through REST APIs.

---

## Author

Aman Kuamr

GitHub:
https://github.com/Amanvads

---

This project was built as a practice and learning project to improve full-stack development skills using modern web technologies.
