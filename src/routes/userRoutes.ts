import express, { NextFunction, Request, Response } from 'express';
import { signupSchema } from '../schemas/signUpSchema';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userSchema';
import Assignment from '../models/assignmentSchema';
import { AppError } from '../utils/appError';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { assignmentSchema } from '../schemas/assignmentSchema';
import Admin from '../models/adminSchema';
const userRouter = express.Router();


userRouter.post('/register' , async (req : Request , res : Response , next : NextFunction) : Promise<void> => {
    try {
        const {success , data} = signupSchema.safeParse(req.body);
        if(!success) {
            throw new AppError('invalid input' , 400)
        }

        const {username ,  password} = data;

        const existingUser = await User.findOne({
            username
        })

        if(existingUser) {
            throw new AppError('user already exists' , 400) 
        }

        const hashPassword = await bcrypt.hash(password , 10)

        const newUser = await User.create({
            username ,
            password : hashPassword
        })

        const userId = newUser._id;

        const token = jwt.sign({
            userId
        } , process.env.SECRET!)


        res.status(200).json({
            message : 'user signed up successfully',
            token
        })
    } catch(error) {
        next(error)
    }
})


userRouter.post('/login' , async (req : Request , res : Response , next : NextFunction) => {
    try {
        const {success , data} = signupSchema.safeParse(req.body);
        if(!success) {
            throw new AppError('invalid inputs' , 400)
        }

        const {username , password}  = data;

        const user = await User.findOne({
            username
        })

        if(!user) {
            throw new AppError('user not found' , 411)
        }

        const hashedPassword = user.password;
        const isPasswordCorrect = await bcrypt.compare(password , hashedPassword);

        if(!isPasswordCorrect) {
            throw new AppError('incorrect password' , 411);
        }

        const token = jwt.sign({
            userId : user._id
        } , process.env.SECRET!)

        res.status(200).json({
            token,
            message : `welcome ${username}`,
            userId : user._id
        })
    } catch(error) {
        next(error)
    }
})

userRouter.post('/upload' , AuthMiddleware , async(req : Request , res: Response , next : NextFunction) => {
    try {
        const {success , data } = assignmentSchema.safeParse(req.body);
        if(!success) {
            throw new AppError('invalid inputs' , 411);
        }

        const user = await User.findById(req.userId)
        if (!user) {
            throw new AppError('User not found', 404);
        }

        const {task , admin} = data;

        const validAdmin = await Admin.findOne({username : admin});

        if(!validAdmin) {
            throw new AppError('admin does not exist' , 411)
        }

        const newAssignment = new Assignment({userId : user.username , task , admin})

        await newAssignment.save();

        await User.findByIdAndUpdate(
            req.userId,
            {
                $push : {
                    assignments : newAssignment._id
                }
            }
        )

        res.status(200).json({
            message : 'assignment submitted',
            newAssignment
        })


    } catch(error) {
        next(error)
    }
})

type UserAssignment = {
    _id: string;
    task: string;
    admin: string;
    createdAt: Date;
};

userRouter.get('/assignments' , AuthMiddleware , async (req : Request , res : Response , next : NextFunction) => {
    try {

        const user = await User.findById(req.userId).populate('assignments')
        res.status(200).json({
            assignments : user?.assignments
        })
    } catch(error) {
        next(error)
    }
})


userRouter.get('/admins' , AuthMiddleware , async(req : Request , res : Response , next : NextFunction) => {
    try {
        const admins = await Admin.find({}).select({
            "username" : true,
            "_id" : false
        });

        res.status(200).json({
            admins
        })

    } catch(error) {
        next(error);
    }
})

export default userRouter