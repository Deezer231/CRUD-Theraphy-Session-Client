Therapy Client Management App
Overview
A full-stack web app for managing therapists, clients, and therapy sessions. Users can register, login, and perform CRUD operations on therapists, clients, and sessions. Data is stored securely in a MySQL backend.

Figma Wireframe Link:
Wireframe Example
(Replace with your own wireframe if available)

Features
User registration and login (MySQL backend, passwords hashed with bcrypt)
CRUD operations for therapists, clients, and sessions
Protected dashboard for logged-in users
Responsive React frontend
Session scheduling and tracking
Animated background using Vanta.js Birds effect

How It Works
Users register and login to access the dashboard.
Therapists, clients, and sessions can be created, viewed, updated, and deleted.
All sensitive credentials are stored in a .env file.
Backend uses MySQL for data storage and Express for API endpoints.
Frontend uses React and Vanta.js for a modern UI.

Step-by-Step: What Happens When You Manage Data
User logs in or registers.
User navigates to dashboard to view therapists, clients, or sessions.
User can add, edit, or delete records.
Backend validates and processes requests, updating the MySQL database.
Frontend updates to reflect changes in real time.

Tech Stack
Frontend: React (Create React App), Vanta.js, Three.js
Backend: Node.js, Express
Database: MySQL (therapists, clients, sessions, users)
Authentication: bcrypt (password hashing)

Prerequisites
Node.js (v18+ recommended)
npm (v8+ recommended)
MySQL (local or remote, e.g., phpMyAdmin)
Vanta.js and Three.js (installed via npm in frontend)

Setup Instructions
1. Clone the repository
  git clone https://github.com/Deezer231/CRUD-Theraphy-Session-Client.git
  cd CRUD-Theraphy-Session-Client

3. Environment Variables
Create a .env file in backend (see .env.example):
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_mysql_db
PORT=5000

5. Install dependencies
Backend

cd backend
npm install

Frontend

cd frontend
npm install
npm install vanta three

7. Start the servers
Backend:

cd backend
node server.js

Frontend:

cd frontend
npm start

5. Usage
Visit http://localhost:3000 for the frontend.
Register/login to access the dashboard and manage therapists, clients, and sessions.

Folder Structure
CRUD-Theraphy-Session-Client/
├── backend/           # Express backend, MySQL, API logic
├── frontend/          # React frontend
├── .env.example       # Example environment variables
├── .gitignore
└── README.md
