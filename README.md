# Blue Court

Blue-Court is a modern social media platform built with a Node.js/Express backend and a React/Vite frontend. It leverages technologies such as MongoDB, JWT for authentication, and Cloudinary for image uploads, alongside a fast, responsive frontend built with React and Tailwind CSS.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)
- [Build the Frontend](#build-the-frontend)
- [Serve the Application](#serve-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
- [Deploying to Cloud Platforms](#deploying-to-cloud-platforms)
- [Summary](#summary)

---

## Features

- **Backend:** Node.js/Express
- **Frontend:** React/Vite with Tailwind CSS
- **Database:** MongoDB
- **Authentication:** JWT
- **Image Uploads:** Cloudinary

---

## Installation

### 1. Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/yourusername/blue-court.git
cd blue-court
```

### 2. Install Dependencies

#### Backend Dependencies

From the root of the project, install the backend dependencies:

```bash
npm install
```

#### Frontend Dependencies

Install the frontend dependencies by running:

```bash
npm run install-frontend
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your configuration values. For example:

```dotenv
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# JWT secret key
JWT_SECRET=your_jwt_secret

# Cloudinary configuration (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: specify a port for the backend server
PORT=3000
```

---

## Build the Frontend

To create a production-ready version of the frontend, run:

```bash
npm run build
```

This command will:
- Navigate to the frontend directory
- Install any missing dependencies (with `--force` if needed)
- Build the frontend assets

---

## Serve the Application

### Starting the Backend Server

To start the production server, run:

```bash
npm start
```

This command launches your Express server (using `backend/server.js`), which should be configured to serve your frontend's static assets.

**Example of `backend/server.js`:**

```javascript
import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve the static files from the frontend build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle any requests that don't match the static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## Deploying to Cloud Platforms

When deploying to platforms such as Heroku, DigitalOcean, or AWS, keep the following in mind:

- **Environment Variables:** Configure them using the platform's dashboard or CLI.
- **Port Configuration:** Ensure your backend listens on the port provided by the environment (typically available as `process.env.PORT`).
- **Build Process:** For platforms like Heroku, you may need to add a `postinstall` script in your root `package.json` to run the frontend build automatically after dependencies are installed.

**Example `postinstall` script in `package.json`:**

```json
"scripts": {
  "postinstall": "npm run build"
}
```

---

## Summary

- **Build the Frontend:** Run `npm run build` to generate production-ready assets.
- **Start the Server:** Use `npm start` to launch your Express server, which serves both the API and the frontend.
- **Use a Process Manager:** Optionally, deploy with PM2 for improved reliability.
- **Cloud Deployment:** Ensure that environment variables and port configurations are properly set up on your cloud platform.

---

This structure provides a clear, step-by-step guide for setting up, building, and deploying Blue-Court. Enjoy building and deploying your project!
