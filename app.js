import express from 'express';
import { connectToDatabase } from './config/DatabaseConfig.js';
import taskRouter from './controllers/taskController.js';
import userRouter from './controllers/authController.js';
import fileUploadRouter from './controllers/fileUploadController.js';
import cors from 'cors'

connectToDatabase();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// home api to check if backend is live or not!
app.get('/', (req, res) => {
    res.send(`Hi! Current time is ${new Date().toLocaleTimeString()}`);
});

app.use(taskRouter);
app.use(userRouter);
app.use(fileUploadRouter);

app.listen(port, () => {
 console.log(`Listening on port: ${port}`)
})
