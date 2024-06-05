import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB☺️")
    }
    catch (err) {
        console.error(`ERROR:${err.message}`)
    }

}

export default connectDB;