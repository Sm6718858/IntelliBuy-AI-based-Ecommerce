import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhoto,
  realtedProductController,
  reviewProduct,
  searchProductController,
  singleProduct,
  updateProduct
} from '../controller/ProductController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, ExpressFormidable(), createProduct);
router.get('/get-products', getProduct);
router.get('/single-product/:slug', singleProduct);
router.get('/product-photo/:pid', productPhoto);
router.delete('/delete-product/:pid', deleteProduct);
router.put('/update-product/:pid', requireSignIn, isAdmin, ExpressFormidable(), updateProduct);
router.post('/product-filters', productFiltersController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);
router.get("/related-product/:pid/:cid", realtedProductController);
router.get("/product-category/:slug", productCategoryController);

router.post("/review/:productId", requireSignIn, reviewProduct);
export default router;