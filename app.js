import express from "express";
import morgan from 'morgan'
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())
app.use(morgan("dev"))

export default app