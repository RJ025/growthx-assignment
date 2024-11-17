import express, { NextFunction, Request, Response } from 'express';
import { signupSchema } from '../schemas/signUpSchema';
import { AppError } from '../utils/appError';
import Admin from '../models/adminSchema';
import bcrypt from'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userSchema';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import Assignment from '../models/assignmentSchema';
import { adminCheckMiddleware } from '../middlewares/adminCheckMiddleware';
const adminRouter = express.Router();


adminRouter.post('/register' , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const {success , data} = signupSchema.safeParse(req.body);
        if(!success) {
            throw new AppError('invalid inputs' , 403)
        }

        const {username , password} = data;

        const user = await User.findOne({username});
        if(user) {
            throw new AppError('no admin access' , 403)
        }

        const existingAdmin = await Admin.findOne({username});

        if(existingAdmin) {
            throw new AppError('admin already exists',  411)
        }

        const hashedPassword = await bcrypt.hash(password , 10)

        const newAdmin = new Admin({
            username,
            password : hashedPassword
        })
        
        await newAdmin.save();

        const adminId = newAdmin._id;

        const token = jwt.sign({
            adminId 
        } , process.env.SECRET!)

        res.status(200).json({
            token,
            message : 'admin created successfully',
            newAdmin
        })

    } catch(error) {
        next(error)
    }
})


adminRouter.post('/login' , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const {success , data} = signupSchema.safeParse(req.body);

        if(!success) {
            throw new AppError('invalid Inputs' , 411)
        }

        const {username , password} = data;

        const admin = await Admin.findOne({username});
        if(!admin) {
            throw new AppError('admin not found' , 411)
        }

        const hashedPassword = admin.password;

        const isPasswordCorrect = await bcrypt.compare(password , hashedPassword)

        if(!isPasswordCorrect) {
            throw new AppError('incorrect password' , 403)
        }

        const token = jwt.sign({
            adminId : admin._id
        } , process.env.SECRET!)

        res.status(200).json({
            token,
            message : `welcome ${username}`,
            admin
        })

    } catch(error) {
        next(error)
    }
})

adminRouter.get('/assignments' , AuthMiddleware , adminCheckMiddleware , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const admin = await Admin.findById(req.adminId)
        if(!admin) {
            throw new AppError('no admin exists' , 403)
        }
        const username = admin.username;
        const assignments = await Assignment.find({admin : username});

        res.status(200).json({
            assignments
        })

    } catch(error) {
        next(error)
    }
})


adminRouter.post('/assignments/:id/accept' , AuthMiddleware , adminCheckMiddleware , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const assignmentId = req.params.id;
        
        const admin = await Admin.findById(req.adminId)
        const assignment = await Assignment.findById(assignmentId);

        if(assignment?.admin !== admin?.username) {
            throw new AppError('This assignment does not belong to you' , 403)
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId , {
                status : 'Accepted'
            } , {new : true}
        )

        if(!updatedAssignment) {
            throw new AppError('invalid assignment id' , 404)
        }

        res.status(200).json({
            message : 'Assignment accepted successfully',
            assignment : updatedAssignment
        })
    } catch(error) {
        next(error)
    }
    
})

adminRouter.post('/assignments/:id/reject' , AuthMiddleware , adminCheckMiddleware , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const assignmentId = req.params.id;
        
        const admin = await Admin.findById(req.adminId)
        const assignment = await Assignment.findById(assignmentId);

        if(assignment?.admin !== admin?.username) {
            throw new AppError('This assignment does not belong to you' , 403)
        }

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            assignmentId , {
                status : 'Rejected'
            } , {new : true}
        )

        if(!updatedAssignment) {
            throw new AppError('invalid assignment id' , 404)
        }

        res.status(200).json({
            message : 'Assignment accepted successfully',
            assignment : updatedAssignment
        })
    } catch(error) {
        next(error)
    }
    
})

export default adminRouter