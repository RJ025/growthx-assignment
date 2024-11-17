import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

declare module "express" {
    interface Request {
        userId ?: string;
        adminId ?: string
    }
}

interface tokenInterface {
    userId ?: string;
    adminId ?: string
}

export const AuthMiddleware = (req : Request , res: Response , next : NextFunction) => {
    const authHeader : string = req.headers.authorization || "";


    if(!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({
            message : 'unauthorized path'
        })
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token , process.env.SECRET!) as tokenInterface
        
        if(decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else if(decoded.adminId) {
            req.adminId = decoded.adminId;
            next();

        }  else {
            res.status(403).json({
                message : 'unauthorized path'
            })

            return;
        }
        
    } catch(err) {
        res.status(403).json({
            message : 'Unauthorized access: Token verification failed'
        })

        return;
    }
}