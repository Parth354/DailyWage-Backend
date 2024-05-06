import express from 'express';
import router from './routes/routes.js';

const app = express();

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))

//defining the routes
app.use("/api/v1",router)
export{ app }