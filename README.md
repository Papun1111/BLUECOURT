
# Project Blue Court

Blue-Court is a modern social media platform built with a Node.js/Express backend and a React/Vite frontend. It leverages technologies like MongoDB, JWT for authentication, and Cloudinary for image uploads, alongside a fast, responsive frontend built with React and Tailwind CSS.

## Installation

Follow these steps to install and set up Blue-Court:

1. **Clone the Repository**

   Begin by cloning the repository and navigating into the project directory:

   ```bash
   git clone https://github.com/yourusername/blue-court.git
   cd blue-court
    ```
2. **Install Backend Dependencies**
From the root of the project, install the backend dependencies by running:

    ```bash
    npm install
    ```
3. **Install Frontend Dependencies**
    ```bash
    npm run install-frontend
    ```
4. **Set Up Environment Variables**
   

# Optional: specify a port for the backend server
PORT=3000

5. **Verify Installation**
Once all dependencies are installed and environment variables are set up, you can verify the installation by running the development servers:# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# JWT secret key
JWT_SECRET=your_jwt_secret

# Cloudinary configuration (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: specify a port for the backend server
PORT=3000

## 2. Build the Frontend

To deploy this project run

```bash
  npm run build
```
This command will:

Navigate to the frontend directory,
Install any missing dependencies (with --force if needed),
Build the frontend assets

## 3. Serve the Application
a. Backend
To start the production server, run:
```bash
  npm start
```
This command launches your Express server (using backend/server.js), which should be configured to serve your frontend's static assets.

In your server file (e.g., backend/server.js), include middleware to serve static files. For example:
```bash
import express from 'express';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve the static files from the frontend build
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Handle any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
## 4. Deploying to Cloud Platforms
When deploying to platforms such as Heroku, DigitalOcean, or AWS:

Environment Variables: Configure them using the platform's dashboard or CLI.
Port Configuration: Ensure your backend listens on the port provided by the environment (usually available in process.env.PORT).
Build Process: For platforms like Heroku, you may need to add a postinstall script in your root package.json to run the frontend build automatically after dependencies are installed.

Example postinstall script in package.json:
```bash
  "scripts": {
  "postinstall": "npm run build"
}
```
## Summary
. Build the Frontend: Run npm run build to create a production-ready version.

. Start the Server: Use npm start to launch your Express server that serves both the API and frontend.

. Use a Process Manager: Optionally, deploy with PM2 for better reliability.

. Cloud Deployment: Ensure proper configuration of environment variables and ports for your cloud platform.
