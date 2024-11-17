import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from "./config/db";
import router from "./controllers/route";
import { ErrorHandler } from "./middlewares/errorHandler";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT

dbConnect()



app.use('/api/v1' , router)

app.use(ErrorHandler)




app.listen(port , () => {
    console.log(`server is running at port ${port}`)
})