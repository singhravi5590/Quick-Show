import mongoose from "mongoose";

async function connectDb() {
    try {
        await mongoose.connect(process.env.MOONGOSE_URI);    
    } 
    catch (error) {
        console.log(error)
    }
}


export default connectDb;