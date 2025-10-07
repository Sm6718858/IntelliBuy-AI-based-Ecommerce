import slugify from "slugify";
import Product from "../models/ProductModel.js";
import fs from "fs";
import Category from "../models/CategoryModel.js";
import dotenv from "dotenv";

dotenv.config();

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(400).json({ success: false, message: "Name is required" });
      case !description:
        return res.status(400).json({ success: false, message: "Description is required" });
      case !price:
        return res.status(400).json({ success: false, message: "Price is required" });
      case !category:
        return res.status(400).json({ success: false, message: "Category is required" });
      case !quantity:
        return res.status(400).json({ success: false, message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).json({ success: false, message: "Photo size should be less than 1MB" });
    }
    const products = new Product({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      products
    });
  } catch (error) {
    console.log("error from create product api");
    res.status(500).json({
      success: false,
      message: "error from create product api",
      error: error.message
    });
  }
}

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).select("-photo").populate("category").limit(12).sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    console.log("error from get-product api");
    res.status(500).json({
      success: false,
      message: "error from get-product api",
      error: error.message
    });
  }
}
export const singleProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .select("-photo")
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

export const productPhoto = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log("error from product Photo api");
    res.status(500).json({
      success: false,
      message: "error from product Photo api",
      error: error.message
    });
  }
}

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
    const { name, price, description, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).json({ success: false, message: "Name is required" });
      case !description:
        return res.status(400).json({ success: false, message: "Description is required" });
      case !price:
        return res.status(400).json({ success: false, message: "Price is required" });
      case !category:
        return res.status(400).json({ success: false, message: "Category is required" });
      case !quantity:
        return res.status(400).json({ success: false, message: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).json({ success: false, message: "Photo should be less than 1MB" });
    }
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    product.name = name;
    product.slug = slugify(name);
    product.price = price;
    product.description = description;
    product.category = category;
    product.quantity = quantity;
    product.shipping = shipping;

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log("Error from product update API", error);
    res.status(500).json({
      success: false,
      message: "Error from product update API",
      error: error.message,
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
      .select("-photo")
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
      .select("-photo")
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
