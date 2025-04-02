# API Documentation

This documentation provides detailed information about the API endpoints available in the Atomic Habits Tracker application.

## Authentication Endpoints

### POST /api/register
Register a new user in the system.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "email": "string",
  "streak": "number",
  "points": "number"
}
```

### POST /api/login
Log in an existing user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "email": "string",
  "streak": "number",
  "points": "number"
}
```

### POST /api/logout
Log out the current user.

**Response:**
- 200 OK

### GET /api/user
Get the currently authenticated user's information.

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "name": "string",
  "email": "string",
  "streak": "number",
  "points": "number"
}
```

## Habit Endpoints

### GET /api/habits
Get all habits for the current user.

**Response:**
```json
[
  {
    "id": "number",
    "userId": "number",
    "name": "string",
    "description": "string",
    "target": "number",
    "category": "string",
    "frequency": "string",
    "daysOfWeek": "number[]",
    "timeOfDay": "string",
    "reminder": "boolean",
    "cue": "string",
    "craving": "string",
    "response": "string",
    "reward": "string"
  }
]
```

### POST /api/habits
Create a new habit.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "target": "number",
  "category": "string",
  "frequency": "string",
  "daysOfWeek": "number[]",
  "timeOfDay": "string",
  "reminder": "boolean",
  "cue": "string",
  "craving": "string",
  "response": "string",
  "reward": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "userId": "number",
  "name": "string",
  "description": "string",
  "target": "number",
  "category": "string",
  "frequency": "string",
  "daysOfWeek": "number[]",
  "timeOfDay": "string",
  "reminder": "boolean",
  "cue": "string", 
  "craving": "string",
  "response": "string",
  "reward": "string"
}
```

### GET /api/habits/:id
Get a specific habit by ID.

**Response:**
```json
{
  "id": "number",
  "userId": "number",
  "name": "string",
  "description": "string",
  "target": "number",
  "category": "string",
  "frequency": "string",
  "daysOfWeek": "number[]",
  "timeOfDay": "string",
  "reminder": "boolean",
  "cue": "string",
  "craving": "string",
  "response": "string",
  "reward": "string"
}
```

### PATCH /api/habits/:id
Update a specific habit.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "target": "number",
  "category": "string",
  "frequency": "string",
  "daysOfWeek": "number[]",
  "timeOfDay": "string",
  "reminder": "boolean",
  "cue": "string",
  "craving": "string",
  "response": "string",
  "reward": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "userId": "number",
  "name": "string",
  "description": "string",
  "target": "number",
  "category": "string",
  "frequency": "string",
  "daysOfWeek": "number[]",
  "timeOfDay": "string",
  "reminder": "boolean",
  "cue": "string",
  "craving": "string",
  "response": "string",
  "reward": "string"
}
```

### DELETE /api/habits/:id
Delete a specific habit.

**Response:**
- 200 OK

### POST /api/habits/:id/complete
Mark a habit as complete for the current day.

**Request Body:**
```json
{
  "progress": "number",
  "date": "string" // Optional, defaults to current date
}
```

**Response:**
```json
{
  "id": "number",
  "habitId": "number",
  "date": "string",
  "progress": "number",
  "completed": "boolean"
}
```

## Analytics Endpoints

### GET /api/analytics/weekly
Get weekly analytics data for the current user.

**Response:**
```json
{
  "completionRate": "number",
  "totalCompletions": "number",
  "streakData": [
    {
      "date": "string",
      "completed": "number",
      "total": "number"
    }
  ]
}
```

## Community Endpoints

### GET /api/leaderboard
Get the community leaderboard.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "username": "string",
    "points": "number",
    "streak": "number",
    "rank": "number",
    "isCurrentUser": "boolean"
  }
]
```

## Achievement Endpoints

### GET /api/achievements
Get all achievements for the current user.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "criteria": "string",
    "icon": "string",
    "points": "number",
    "unlocked": "boolean"
  }
]
```