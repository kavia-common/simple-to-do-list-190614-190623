# To-do Frontend (React)

This frontend provides a simple UI for managing tasks and connects to the FastAPI backend on port 3001.

## Run

1. Ensure the backend is running on http://localhost:3001 (with CORS enabled).
2. Copy .env.example to .env and adjust if needed:
   REACT_APP_API_BASE_URL=http://localhost:3001
3. Install and start:
   - npm install
   - npm start
4. Open http://localhost:3000

## Features

- List tasks with pagination and search (title/description)
- Add new tasks
- Edit existing tasks
- Delete tasks
- Toggle status pending/completed
- Basic loading and error handling

## Configuration

- API base URL: REACT_APP_API_BASE_URL
- Default fallback if not set: http://localhost:3001

The app uses a small API client at src/api/client.js to interact with the backend.

## Notes

- This project uses Create React App and plain CSS (no UI framework).
- Styling adheres to the provided light theme colors.

