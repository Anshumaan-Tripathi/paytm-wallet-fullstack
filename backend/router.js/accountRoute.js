import express from 'express'
import { transferFunds } from '../controllers/accountController.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
const accountRouter = express.Router()

accountRouter.post('/send-money',isAuthenticated,transferFunds)

export default accountRouter