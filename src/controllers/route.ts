import express from "express";
const router = express.Router();
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";


router.use('/user' , userRouter);
router.use('/admin' , adminRouter);


export default router