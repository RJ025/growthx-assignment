import mongoose, { Document, Schema } from "mongoose";


export interface User extends Document {
    username : string;
    password : string;
    role : string
    assignments : mongoose.Types.ObjectId
}


const userSchema : Schema<User> = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    } ,
    password : {
        type : String,
        required : true
    } ,
    role : {
        type : String ,
        default : 'User'
    } ,
    assignments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Assignment'
        }   
    ]
}) 

const User = mongoose.model<User>('User' , userSchema);

export default User;