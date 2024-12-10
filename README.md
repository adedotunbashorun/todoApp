## Todo App
This is a full-stack Todo application designed for managing tasks efficiently. It includes both a backend API for handling the application logic and a frontend UI built with Next.js for an interactive user interface.

## Project Structure
## Backend:

Located in the backend folder.
Provides the REST API endpoints for the application.
Includes authentication, task management, and other functionalities.
## Frontend:

Located in the frontend folder.
Built with Next.js for a modern, fast, and SEO-friendly user interface.
Connects to the backend to display and manage tasks.

## API Endpoints:

User authentication (login and registration).
CRUD operations for todos (create, read, update, delete).
Middleware for logging, error handling, and security.
Documentation:

## Security:

Includes protections against XSS and CSRF attacks.
Secure headers and cookie management.
Frontend
User-friendly UI for managing todos.
Responsive design for seamless experience on any device.
Integration with backend APIs for real-time task updates.

## Getting Started

## Prerequisites
Node.js (v18+)
Docker and Docker Compose (for containerized development)
A modern browser for accessing the app

## Installation

```bash
git clone <repository-url>
cd todo-app
Install dependencies:

npm install
```

## Running the Application

Using Docker Compose:

Run the following command to start the app:

```bash
docker-compose up
```

Accessing the Application
Web Application: http://localhost:3000
API Documentation: http://localhost:3000/api/v1/docs
