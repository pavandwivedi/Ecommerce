
import fs from 'fs';
import productModel from '../models/productModel.js';
import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js';
import braintree from 'braintree';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

 


// Payment gateway
try {
  var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    merchantId: process.env.BRAINTREE_MERCHANR_ID,
    privateKey: process.env.BRAINTERE_PRIVATE_KEY
  });
} catch (error) {
  console.error('Error initializing BraintreeGateway:', error.message);
}


export const createProductController = async (req, res) => {
    try {
      const { name, description, price, category, quantity, shipping } = req.fields;
      const { photo } = req.files;
  
      // Validation - Check if required fields are present
      if (!name || !description || !price || !category || !quantity || !photo) {
        return res.status(500).send({ error: "All fields are required." });
      }
  
      const slug = slugify(name); // Generate the slug based on the product name
  
      const products =   new productModel({
        name,
        slug,
        description,
        price,
        category,
        quantity,
        shipping,
      });
  
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
  
      await products.save();
  
      res.status(201).send({
        success: true,
        message: "Product created successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in product creation",
      });
    }
  };
  
  // get all products 

  export const getProductController = async(req,res)=>{
    try {
        const products = await productModel
        .find({})
        .populate("category")
        .select("-photo")
        .limit(12)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        countTotal: products.length,
        message: "All Products ",
        products,
      });
    } catch (error) {
       console.log(error);
       res.status(500).send({
        success:false,
        message: "Erorr in getting products",
        error: error.message,
       }) 
    }
  }

  // get single product 

  export const getSingleProduct = async(req,res)=>{

    try {
        const product = await productModel
        .findOne({ slug: req.params.slug })
        .select("-photo")
        .populate("category");
      res.status(200).send({
        success: true,
        message: "Single Product Fetched",
        product,
    })
        
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Eror while getitng single product",
        error,   })  
    }
  }


// get photo
import mongoose from 'mongoose';


export const productPhotoController = async (req, res) => {
  try {
    const productId = req.params.pid;

    // Check if the provided productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findById(productId).select("photo");

    // Check if the product exists
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};


  //delete controller
export const deleteProductController = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };
  
  export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};
  
  // filters
  export const productFiltersController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      const products = await productModel.find(args);
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error While Filtering Products",
        error,
      });
    }
  };
  
  // product count
  export const productCountController = async (req, res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
  

 export const getProductListController = async (req, res) => {
    // Extract the page number from the request parameters
    const page = req.params.page || 1;
  
    // Calculate the number of products to skip based on the page number and the number of products per page
    const productsPerPage = 2; 
    const skip = (page - 1) * productsPerPage;
  
    try {
      // Fetch products from the database using pagination
      const products = await productModel.find({}).skip(skip).limit(productsPerPage).sort({createdAt:-1});
  
      // Send the products as a response to the frontend
      // return res.status(200).json({ success: true, products });

      return res.status(200).send({success:true,products,})
    } catch (error) {
      // Handle any errors that may occur during the database query
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


export const  searchProductController  = async(req,res)=>{

  try {
    const {keyword} = req.params;
    const result = await productModel.find({
      $or:[
        {name:{$regex:keyword,$options:'i'}},
        {description:{$regex:keyword,$options:'i'}},
      ]
    }).select("-photo");
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"Error in Search Product API"
    })
  }
}



// semilar product controller 
export const relatedProductController = async(req,res)=>{

  try {
    
//     const {pid,cid} = req.params;
//     const products = await productModel.find({category:cid,_id:{$ne:pid}
//      }).select("-photo").limit(3).populate("category")

//      res.status(200).send({
//       success:true,
// products
//      })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"error while getting related product",
      error
    })
  }
}
  

// 
export const productCategoryController = async(req,res)=>{
  try {
   
    const category  = await categoryModel.findOne({slug:req.params.slug});
    const products = await productModel.find({category}).populate('category');
    res.status(200).send({
      success:true,
      category,
      products,
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error in getting the category"
    })
  }
}

// payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};








