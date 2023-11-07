import express, { Router } from 'express';
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import router from './route/authRoute.js';
import categoryRoute from './route/categoryRoute.js'
import productRoutes from './route/productRoutes.js'
import cors from 'cors'; 
import connectdb from './config/db.js';
import path from "path";
import {fileURLToPath} from 'url';


//configure env

dotenv.config();


// database config

connectdb(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// rest object
const app = express();


// middlewares
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')))


// rest api


app.use('/api/v1/auth', router);
  // Route mounting
  app.use('/api/v1/category',categoryRoute)
  app.use('/api/v1/product',productRoutes)
  app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
  });
  
const PORT = process.env.PORT||8080;



app.listen(PORT,()=>{
    
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgMagenta.black)
}
)
