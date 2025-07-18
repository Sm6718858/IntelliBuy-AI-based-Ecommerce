import express from 'express';
import { Forgot_Password, getAllOrdersController, getAllUsersController, getOrdersController, updateOrderStatusController, updateProfileController, userLogin, userRegister,userVerfy } from '../controller/userController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',userRegister);
router.post('/login',userLogin)
router.post('/forgot_password',Forgot_Password)
router.get('/verify',requireSignIn,isAdmin,userVerfy);

router.get('/user-auth-protected', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true,
        message: "Protected route accessed successfully",
    });
});

router.get('/admin-auth-protected', requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({
        ok: true,
        message: "Protected route accessed successfully",
    });
});

router.get('/all-users',requireSignIn,isAdmin,getAllUsersController);
router.put("/profile", requireSignIn, updateProfileController);
router.get('/orders', requireSignIn, getOrdersController);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);
router.put('/order-status/:orderId', requireSignIn, isAdmin, updateOrderStatusController);
export default router;