import slugify from "slugify";
import Product from "../models/ProductModel.js";
import fs from "fs";
import Category from "../models/CategoryModel.js";
import redisClient from "../config/redis.js";

export const createProduct = async (req, res) => {
  try {
    const {name,description,price,quantity,category,shipping,image,sizes} = req.body;

    if (!name || !description || !price || !quantity || !category || !image){
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const product = new Product({
      name,
      slug: slugify(name, { lower: true }) + "-" + Date.now(),
      description,
      price: Number(price),
      quantity: Number(quantity),
      category,
      shipping: Boolean(shipping),
      image,
      sizes
    });

    await product.save();
    await redisClient.del("products");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  const start = Date.now();

  const cachedProducts = await redisClient.get("products");

  if (cachedProducts) {
    console.log("Redis HIT");
    console.log("⏱getProduct (Redis):", Date.now() - start, "ms");

    return res.json({
      success: true,
      source: "redis",
      products: JSON.parse(cachedProducts),
    });
  }

  console.log("Redis MISS → MongoDB");

  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 });

  await redisClient.setEx(
    "products",
    60,
    JSON.stringify(products)
  );

  console.log("⏱getProduct (MongoDB):", Date.now() - start, "ms");

  res.json({
    success: true,
    source: "mongodb",
    products,
  });
};

export const singleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .select()
      .populate("category")
      .populate("reviews.user", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Single product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching single product", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
    });
  }
};

// export const productPhoto = async (req, res) => {
//   try {
//     const pid = req.params.pid;
//     const product = await Product.findById(pid).select("photo");
//     if (product.photo.data) {
//       res.set("Content-type", product.photo.contentType);
//       return res.status(200).send(product.photo.data);
//     }
//   } catch (error) {
//     console.log("error from product Photo api");
//     res.status(500).json({
//       success: false,
//       message: "error from product Photo api",
//       error: error.message
//     });
//   }
// }

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findByIdAndDelete(pid).select("-photo");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    await redisClient.del("products");
    res.status(200).json({
      success: true,
      message: "Product Deleted successfully",
    });

  } catch (error) {
    console.log("error from product delete api");
    res.status(500).json({
      success: false,
      message: "error from product delete api",
      error: error.message
    });
  }
}
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      quantity,
      shipping,
      image,
      sizes
    } = req.body;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name;
    product.slug = slugify(name);
    product.price = price;
    product.description = description;
    product.category = category;
    product.quantity = quantity;
    product.shipping = shipping;
    product.sizes = sizes;

    if (image) {
      product.image = image;
    }

    await product.save();
    await redisClient.del("products");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
    
  } catch (error) {
    console.log("Error from product update API", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
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

export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product
      .find({})
      .select()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await Product
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};


export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select()
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

export const reviewProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        message: "Product already reviewed by you" 
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.averageRating = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      product.reviews.length;

    await product.save();

    res.status(201).json({ 
      success: true,
      message: "Review added successfully",
      product 
    });
  } catch (error) {
    console.error("Error in review submission:", error);
    res.status(500).json({ 
      success: false,
      message: "Error in review submission",
      error: error.message 
    });
  }
};
