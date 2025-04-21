import express from "express";
import { signup, resendOtp, login, verifyOtp, logout, getUserDetails, getUsers } from "../controllers/authController.js";
import { otpLimiter, rateLimiter } from '../utils/rateLimiter.js';
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const authRouter = express.Router()

authRouter.post('/signup',rateLimiter,signup)
authRouter.post('/resend-verification-otp',otpLimiter,resendOtp)
authRouter.post('/verify-verification-otp',verifyOtp)
authRouter.post('/login', rateLimiter, login)
authRouter.post('/logout',logout)

authRouter.get('/user',isAuthenticated,getUserDetails)
authRouter.get('/users',isAuthenticated,getUsers)

export default authRouter;