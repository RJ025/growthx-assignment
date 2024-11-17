import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const ErrorHandler = (err : AppError , req : Request , res : Response , next : NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message : err.message
    })
}