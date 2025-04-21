import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  window: 15 * 60 * 1000,
  max: 100,
  message: 'Too many request, please try again later'
})

export const otpLimiter = rateLimit({
  window: 5 * 60 * 1000,
  max: 3,
  message: "Too many otp requests, please try again later"
})