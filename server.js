// Importing core & third-party modules
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import OS from 'os';
import fs from 'fs';

// Importing constants
import { PORT } from './common/constants.js';
import { dbConnection } from './database/db.js';
import client from './database/redis.js';
import router from './routes/index.routes.js';

// Initialize express app
const app = express();
dbConnection();

let _path;

(() => {
  try {
    const userName = OS.userInfo().username;
    if (userName == "root") _path = "/" + userName + "/uploads";
    else {
      if (OS.platform() == "win32") _path = "C:/Users/" + userName + "/uploads";
      else _path = "/home/" + userName + "/uploads";
    }
    global.uploadURL = _path;

    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path);
    }
  } catch (error) {
    console.log("error ", error);
  }
})();

// Apply middleware to enhance app security and functionality
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.text());

// Health check route to test if server is running
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is up and running 🚀' });
});

// Routes
app.use('/',router);

// Create HTTP server and listen on defined port
let httpServer = http.createServer(app);
httpServer.listen({ port: PORT}, () => {
    console.log(`Server running at PORT:${PORT}`)
});