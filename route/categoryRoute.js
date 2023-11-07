
import express from 'express'
// import { Router } from 'express';
import {isAdmin,requireSignIn} from './../middlewares/authMiddleware.js'
import { categoryControlller, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js'

const router = express.Router();

router.post(
    "/create-category",
    requireSignIn,
    isAdmin,
    createCategoryController
)

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

// get all category

router.get('/get-category',categoryControlller)

// get single category
router.get('/single-category',singleCategoryController)

// delete category 
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)
export default router;