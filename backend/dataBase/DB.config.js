import mongoose from "mongoose";

const connectDB = async() => {
  try{
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/paytm`)
    console.log(`Database has been connected ${conn.connection.host}`)
  }catch(error){
    console.error('Error in connecting Database:', error.message )
    process.exit(1)
  }
}

export default connectDB