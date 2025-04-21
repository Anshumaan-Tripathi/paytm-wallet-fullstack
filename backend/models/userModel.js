import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength:3, maxlength:50 },
  phone: { type: String, required: true, unique:true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength:8 },
  verified: { type: Boolean, default: false },
  emailVerificationOtp: { type: String, default: null },
  emailVerificationOtpExpireAt: { type: Date },
  phoneVerificationOtp: { type: String, default: null },
  phoneVerificationOtpExpireAt: { type: Date },
  resetPasswordOtp: { type: String, default: null },
  resetPasswordOtpExpireAt: { type: Date },
},{
  timestamps: true,
})

const User = mongoose.models.User || mongoose.model('User',userSchema)

export default User