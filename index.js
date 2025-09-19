import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './route/authRoute.js'
import connectDb from './config/connectDB.js';
import cors from "cors"
import userRouter from './route/userRoute.js';

dotenv.config()

const port = process.env.PORT   
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port`);
    connectDb()
})
