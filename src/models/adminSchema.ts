import mongoose, { Document, Schema } from "mongoose";

export interface Admin extends Document {
    username : string;
    password : string;
    role : string
}


const adminSchema : Schema<Admin> = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    } ,
    password : {
        type : String,
        required : true,
    } ,
    role : {
        type : String,
        default : 'Admin'
    }
})

const Admin = mongoose.model<Admin>('Admin' , adminSchema)

export default Admin