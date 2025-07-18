import slugify from "slugify";
import Category from "../models/CategoryModel.js";

export const CatagoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }
        const existingCategory = await Category.findOne({ name: name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }   
        const category = await new Category({
            name: name,
            slug: slugify(name),
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error from create catagory api",
            error: error.message
        });
    }
}

export const UpdateCatagory = async (req,res) =>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id, {name: name, slug: slugify(name)}, {new: true});
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log("error from catagory update api");
        res.status(500).json({
            success:false,
            message:"error from update catagory api",
            error:error.message
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        console.log("error from get catagory api");
        res.status(500).json({
            success: false,
            message: "error from get catagory api",
            error: error.message
        });
    }
}

export const SingleCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug: slug });
        if (!category) {    
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }   
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        }); 
    } catch (error) {
        console.log("error from single catagory api");  
        res.status(500).json({
            success: false,
            message: "error from single catagory api",
            error: error.message
        }); 
    }
}

export const deleteCategory = async (req, res) => { 
    try {
        const {id} = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Category Deleted successfully",
        }); 
    } catch (error) {
        console.log("error from delete catagory api");  
        res.status(500).json({
            success: false,
            message: "error from delete catagory api",
            error: error.message
        }); 
    }
}