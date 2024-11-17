import mongoose, { Document, Schema } from "mongoose";


export interface Assignment extends Document {
    userId : string;
    task : string;
    admin : string;
    status : string;
    createdAt : Date
}

enum TaskStatus {
    Pending ,
    Accepted ,
    Rejected
}

const assignmentSchema : Schema<Assignment> = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    } ,
    task : {
        type : String,
        required : true
    } ,
    admin : {
        type : String,
        required : true
    } ,
    status : {
        type : String,
        enum : TaskStatus,
        default : 'Pending'
    } ,
    createdAt : {
        type : Date,
        default : Date.now
    }
})


const Assignment = mongoose.model<Assignment>('Assignment' , assignmentSchema);

export default Assignment