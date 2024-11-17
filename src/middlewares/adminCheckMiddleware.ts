import { NextFunction, Request, Response } from "express";
import Admin from "../models/adminSchema";
import { AppError } from "../utils/appError";

export const adminCheckMiddleware = async(req : Request , res : Response , next : NextFunction) => {
    try {
        const adminId = req.adminId
        const admin = await Admin.findById(adminId);

        if(!admin || admin.role !== 'Admin'){
            throw new AppError('Access denied. Admins only.', 403)
        }
        next();
    } catch (error) {
        next(error);
    }
}