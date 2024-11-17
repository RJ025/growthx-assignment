import mongoose, { connect } from "mongoose";

export async function dbConnect () : Promise<void> {
    try {
        await mongoose.connect(process.env.MONGO_URI || " ")
        console.log('db connected')
    } catch(err) {
        console.error(err);
    }
    
}