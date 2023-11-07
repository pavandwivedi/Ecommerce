import express from 'express'
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'
import {
    createProductController, getProductController,
    getSingleProduct,
    productPhotoController,
    deleteProductController,
    productFiltersController,productCountController,
    updateProductController,getProductListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    brainTreePaymentController,
    braintreeTokenController
} from '../controllers/productController.js'
import formidable from 'express-formidable' // used for upload files(photos videos)
import { updateCategoryController } from '../controllers/categoryController.js';
import braintree from 'braintree';



const router = express.Router();

// routes 
router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController
  );

  // get all products

  router.get('/get-product',getProductController)
  
  // get single product
  router.get("/single-product/:slug",getSingleProduct);

  //get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid",requireSignIn,isAdmin,formidable(), deleteProductController);

// routes
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController)

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

router.get('/product-list/:page', getProductListController);

// search Product
router.get("/search/:keyword",searchProductController);

router.get('/related-product/:pid/:cid',relatedProductController)

// get category wise products
router.get("/product-category/:slug",productCategoryController)


// payments routes
// token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


export default router;