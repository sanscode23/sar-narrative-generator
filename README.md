# SAR Narrative Generator

A robust MERN-stack web application designed to facilitate the creation of Suspicious Activity Report (SAR) narratives. It features user authentication, mock case management, narrative generation, and a comprehensive Audit Trail to track system activities securely and efficiently.

## Features

- **SAR Narrative Generation**: Easily create and manage SAR workflows.
- **Audit Logging**: A robust audit trail to log core activities within the app.
- **Secure Authentication**: Built-in authentication using JSON Web Tokens (JWT) and bcrypt password hashing.
- **RESTful API**: A fully-featured Express backend exposing robust endpoints.
- **Modern Frontend**: A snappy, interactive UI built using React and Vite.

## Tech Stack

### Frontend
- **Framework**: React.js 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Utilities**: JWT for authentication, bcrypt for password hashing, CORS, and dotenv.

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your local machine.
- [MongoDB](https://www.mongodb.com/) installed or a MongoDB Atlas URI.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Backend Setup
Navigate into the `backend` directory, install dependencies, and run the development server.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root directory and add the necessary environment variables, for example:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
# or npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the Vite development server.

```bash
cd frontend
npm install
```

Start the frontend application:
```bash
npm run dev
```

## Usage
Once both servers are running, the frontend will typically be accessible at `http://localhost:5173` while the backend runs on `http://localhost:5000` (or whatever port is specified in your `.env`).

## License
ISC
