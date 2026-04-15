import mongoose from "mongoose";
const schema = mongoose.Schema;
const objectId = schema.ObjectId;

const userSchema = new schema({
    username : String,
    email : String,
    password : String
});
const userChats = new schema({
    userId : objectId,
    users : [{
        id : String,
        chats : [{
            message : String,
            self : Boolean
        }]
    }]
});
export const User = mongoose.model('User', userSchema);
export const Chats = mongoose.model('Chats', userChats);
