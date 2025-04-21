import crypto from 'crypto'

export const generateVerificationOtp = () => {
  return crypto.randomInt(100000, 999999).toString()
}
