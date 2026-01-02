# API Endpoints List

**Base URL:** `http://localhost:3000`

---

## 🔐 AUTHENTICATION ENDPOINTS

### Register User (Create User)
- **Method:** `POST`
- **Endpoint:** `http://localhost:3000/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
- **Method:** `POST`
- **Endpoint:** `http://localhost:3000/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/auth/me`
- **Headers:**
  - `x-user-id: USER_ID` (required)
  - `x-user-email: USER_EMAIL` (required)
  - `x-user-role: admin|user` (optional — set to `admin` for admin-only endpoints)

---

## 🏢 WORKSPACE ENDPOINTS

### Get All Workspaces
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/workspaces`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`

### Get Workspace by ID
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/workspaces/{workspaceId}`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
- **Example:** `http://localhost:3000/workspaces/123e4567-e89b-12d3-a456-426614174000`

### Create Workspace (Admin Only)
- **Method:** `POST`
- **Endpoint:** `http://localhost:3000/workspaces`
- **Headers:** 
  - `x-user-id: ADMIN_USER_ID`
  - `x-user-email: ADMIN_USER_EMAIL`
  - `x-user-role: admin`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "My Workspace",
  "description": "Workspace description"
}
```

### Update Workspace (Admin Only)
- **Method:** `PUT`
- **Endpoint:** `http://localhost:3000/workspaces/{workspaceId}`
- **Headers:** 
  - `x-user-id: ADMIN_USER_ID`
  - `x-user-email: ADMIN_USER_EMAIL`
  - `x-user-role: admin`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Workspace (Admin Only)
- **Method:** `DELETE`
- **Endpoint:** `http://localhost:3000/workspaces/{workspaceId}`
- **Headers:**
  - `x-user-id: ADMIN_USER_ID`
  - `x-user-email: ADMIN_USER_EMAIL`
  - `x-user-role: admin`

---

## ✅ TASK ENDPOINTS

### Get All Tasks in Workspace
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/tasks/workspace/{workspaceId}`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
- **Example:** `http://localhost:3000/tasks/workspace/123e4567-e89b-12d3-a456-426614174000`

### Get Tasks by Status
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/tasks/workspace/{workspaceId}/status/{status}`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
- **Status values:** `todo`, `in_progress`, `done`
- **Example:** `http://localhost:3000/tasks/workspace/123e4567-e89b-12d3-a456-426614174000/status/todo`

### Get Task by ID
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/tasks/{taskId}`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
- **Example:** `http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000`

### Create Task
- **Method:** `POST`
- **Endpoint:** `http://localhost:3000/tasks`
- **Headers:** 
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the backend",
  "status": "todo",
  "workspaceId": "workspace-uuid-here",
  "assignedTo": "user-uuid-here"
}
```

### Update Task
- **Method:** `PUT`
- **Endpoint:** `http://localhost:3000/tasks/{taskId}`
- **Headers:** 
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "assignedTo": "user-uuid-here"
}
```

### Delete Task
- **Method:** `DELETE`
- **Endpoint:** `http://localhost:3000/tasks/{taskId}`
- **Headers:**
  - `x-user-id: USER_ID`
  - `x-user-email: USER_EMAIL`

---

## 🏥 HEALTH CHECK

### Health Check
- **Method:** `GET`
- **Endpoint:** `http://localhost:3000/health`
- **Headers:** None

---

## 📝 NOTES

- Instead of JWT tokens, this development setup uses request headers to identify the user.
  After registering or logging in, use the returned `user.id`, `user.email`, and `user.role` values.
  Send them as headers:
  - `x-user-id: <user.id>`
  - `x-user-email: <user.email>`
  - `x-user-role: admin|user` (set to `admin` when calling admin-only endpoints)
