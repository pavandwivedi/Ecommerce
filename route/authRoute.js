import express from "express";

import { testController ,registerController,loginController,forgotPasswordController,updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'


import {requireSignIn,isAdmin} from "../middlewares/authMiddleware.js"
// router object

const router = express.Router();

// routing 
// Register|| Post method

router.post('/register', registerController);

// LOGIN || POST
router.post('/login',loginController);

// Login || Post
router.post("/forgot-password",forgotPasswordController)
router.get('/test',requireSignIn,isAdmin,testController)  //requireSignIn ye token ko verify karega


// Protected route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})


// Protected route for admin
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

// update Profile 
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)

// all orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)

// order status 
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController)


export default router;