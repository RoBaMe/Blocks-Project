# Blocks Project

A full-stack application with React frontend and NestJS backend, featuring user authentication and AI-powered chat with math tools.

## Project Structure

```
Blocks-Project/
├── UI/                 # React frontend (Vite + TypeScript)
├── server/            # NestJS backend (TypeScript)
└── package.json       # Root package.json with dev scripts
```

## Prerequisites

- **Node.js** (v20.19.0 or >=22.12.0 recommended)
- **npm** (comes with Node.js)
- **OpenAI API Key** (for AI chat functionality)

## Installation

### 1. Install Root Dependencies

From the root directory, install the root dependencies (for running both projects simultaneously):

```bash
npm install
```

### 2. Install Server Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
cd ..
```

### 3. Install UI Dependencies

Navigate to the UI directory and install dependencies:

```bash
cd UI
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Projects Simultaneously (Recommended)

From the root directory, run both the server and UI together:

```bash
npm run dev
```

This will start:
- **Server** on `http://localhost:3000`
- **UI** on `http://localhost:5173`

The output will be color-coded:
- Cyan for server logs
- Magenta for UI logs

### Option 2: Run Projects Individually

#### Start the Server

```bash
# From root directory
npm run start-dev-server

# Or from server directory
cd server
npm run start:dev
```

The server will be available at `http://localhost:3000`

#### Start the UI

```bash
# From root directory
npm run start-dev-ui

# Or from UI directory
cd UI
npm run dev
```

The UI will be available at `http://localhost:5173`

## Available Scripts

### Root Scripts

- `npm run dev` - Run both server and UI simultaneously
- `npm run start-dev-server` - Start only the server
- `npm run start-dev-ui` - Start only the UI

### Server Scripts (from `server/` directory)

- `npm run start` - Start the server
- `npm run start:dev` - Start in watch mode
- `npm run start:debug` - Start in debug mode with watch
- `npm run build` - Build for production
- `npm run start:prod` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### UI Scripts (from `UI/` directory)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)
- `POST /auth/logout` - Logout user (protected)

### Chat

- `POST /chat/message` - Send a message and get streaming bot response (protected)
- `GET /chat/history` - Get chat history for current user (protected)

### API Documentation

Swagger documentation is available at:
- `http://localhost:3000/api`

## Features

- ✅ User authentication with JWT (HTTP-only cookies)
- ✅ Protected routes
- ✅ AI chat interface with streaming responses
- ✅ Math tools (sum and max functions)
- ✅ Chat history per user

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- React Hot Toast
- Zod (validation)

### Backend
- NestJS
- TypeScript
- JWT Authentication
- OpenAI API
- LowDB (JSON database)
- Zod (validation)
- Swagger/OpenAPI

## Development

### Code Formatting

The project uses Prettier with 4-space indentation and semicolons enabled.

Format all files:
```bash
# Server
cd server
npm run format

# UI
cd UI
npx prettier --write "**/*.{ts,tsx,js,jsx,json,css}" --config .prettierrc
```

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use, you can:

1. Change the server port in `server/.env`:
   ```env
   PORT=3001
   ```

2. Change the UI port by modifying `UI/vite.config.ts` or using:
   ```bash
   cd UI
   npm run dev -- --port 5174
   ```

### OpenAI API Errors

Make sure you have:
1. A valid OpenAI API key in `server/.env`
2. Sufficient API credits
3. The correct model name (default: `gpt-4`)

### Database Files

The application uses JSON files for data storage:
- `server/data/db.json` - User data
- `server/data/chat.json` - Chat messages

These files are automatically created on first run and are ignored by git.

## License

ISC
