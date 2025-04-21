import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

import authRouter from './router.js/authRoute.js'
import connectDB from './dataBase/DB.config.js'
import accountRouter from './router.js/accountRoute.js'

const app = express()

const PORT = process.env.PORT || 3000
const Backend_URL = chalk.underline(`http://localhost:${PORT}`)

app.use(express.json())
app.use(cors({
  credentials: true,
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"] // allow both
}));

app.use(cookieParser())

app.get('/',(req,res)=>{
  res.status(200).send('Paytm Backend Running Fine')
})

app.use('/api/v1/',authRouter)
app.use('/api/v1/account', accountRouter)


connectDB().then(()=>{
  app.listen(PORT,()=>{
    console.log(`Backend is running on ${Backend_URL} `)
  })
}).catch((err)=> {
  console.error("Failed to connect to Database", err)
})