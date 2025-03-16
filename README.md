# Student Management System

A full-stack web application for managing students and organizing them into groups.

## Project Overview

This application allows users to:

- Add, edit, and delete students
- View a list of all students
- Assign students to groups
- View students by group

## Available Scripts

In the client directory, you can run:

### `npm install`

Installs all dependencies for the client.

### `npm run build`

Builds the app for production to the server/public folder.

### `npm run start`

Runs the app in development mode and opens it in the browser.

In the server directory, you can run:

### `npm install`

Installs all dependencies for the server.

### `node app.js`

Starts the Express server.

## The application will be available at:

- http://localhost:8888 (webpack dev server), open automatically with npm run start
- http://localhost:5000 (Express server)

## API Documentation

### Student Endpoints

| Method | URL                    | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/api/students/all`    | Retrieve all students  |
| POST   | `/api/students/create` | Create a new student   |
| PUT    | `/api/students/:id`    | Update a student by ID |
| DELETE | `/api/students/:id`    | Delete a student by ID |

#### Sample Requests

##### Create Student

```http
POST /api/students/create
Content-Type: application/json

{
  "studentNumber": "12345",
  "lastName": "DUPONT",
  "firstNames": "Jean, Marc"
}

```

### Group Endpoints

| Method | URL               | Description                    |
| ------ | ----------------- | ------------------------------ |
| GET    | `/api/groups/all` | Retrieve all group assignments |
| POST   | `/api/groups/add` | Assign student to a group      |
| DELETE | `/api/groups/:id` | Remove group assignment        |

#### Sample Requests

##### Assign Student to Group

```http
POST /api/groups/add
Content-Type: application/json

{
  "studentId": "60d21b4967d0d8992e610c85",
  "groupNumber": "2"
}

```
