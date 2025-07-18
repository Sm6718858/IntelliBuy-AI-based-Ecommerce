import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { CatagoryController, deleteCategory, getCategories, SingleCategory, UpdateCatagory } from '../controller/CatagoryController.js';

const router = express.Router();

router.post('/create-category',requireSignIn,isAdmin,CatagoryController);
router.put('/update-category/:id',requireSignIn,isAdmin,UpdateCatagory);
router.get('/get-category',getCategories);
router.get('/single-category/:slug', SingleCategory);
router.delete('/delete-category/:id', requireSignIn, isAdmin,deleteCategory);



export default router;