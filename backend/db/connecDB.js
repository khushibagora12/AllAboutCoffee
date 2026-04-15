import mongoose from 'mongoose';

export default async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
    }
    catch(e){
        console.log("error connecting with db: ", e);
    }
}