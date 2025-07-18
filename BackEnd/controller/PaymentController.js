import Payment from "../models/OrderModel.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

export const checkout = async (req, res) => {
    try {
        const { amount, cartItems, userShipping, userId } = req.body;
        
        if (!amount || !cartItems || !userShipping || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const FiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        await Payment.updateMany(
            { 
                userId,
                payStatus: "created", 
                createdAt: { $lt: FiveMinutesAgo } 
            },
            { 
                payStatus: "failed",
                failureReason: "Payment abandoned",
                failedAt: new Date()
            }
        );

        const initialPayment = new Payment({
            orderId: `temp_${Date.now()}`,
            paymentId: 'pending',
            userId: userId,
            cartItems: cartItems,
            userShipping: userShipping,
            payStatus: "created",
            amount: amount
        });

        const savedPayment = await initialPayment.save();

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${savedPayment._id}`,
            notes: {
                paymentRecordId: savedPayment._id.toString()
            }
        };
        const order = await razorpay.orders.create(options);
        await Payment.findByIdAndUpdate(savedPayment._id, {
            orderId: order.id
        });
        res.json({
            success: true,
            orderId: order.id,
            amount: amount,
            paymentRecordId: savedPayment._id,
            cartItems,
            userShipping,
            userId
        });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const verify = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
            userShipping,
            userId,
            paymentRecordId
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || 
            !cartItems || !userShipping || !userId || !paymentRecordId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        const updateData = {
            paymentId: razorpay_payment_id,
            razorpay_signature: razorpay_signature,
            verifiedAt: new Date()
        };

        if (isAuthentic) {
            updateData.payStatus = "paid";
        } else {
            updateData.payStatus = "failed";
            updateData.failureReason = "Invalid signature";
        }

        await Payment.findByIdAndUpdate(paymentRecordId, updateData);

        return res.status(200).json({ 
            success: isAuthentic,
            message: isAuthentic ? "Payment verified and order saved" : "Payment verification failed",
            orderId: razorpay_order_id,
            paymentStatus: updateData.payStatus
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        if (req.body.paymentRecordId) {
            await Payment.findByIdAndUpdate(req.body.paymentRecordId, {
                payStatus: "failed",
                failureReason: error.message
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Server error during payment verification",
            error: error.message
        });
    }
};
export const paymentFailed = async (req, res) => {
    try {
        const { order_id, payment_id, paymentRecordId, error } = req.body;

        if (!paymentRecordId) {
            return res.status(400).json({ success: false, message: "Missing payment record ID" });
        }

        await Payment.findByIdAndUpdate(paymentRecordId, {
            payStatus: "failed",
            paymentId: payment_id || 'unknown',
            failureReason: error?.description || "Payment failed",
            failedAt: new Date()
        });

        return res.status(200).json({ 
            success: true,
            message: "Payment failure recorded"
        });
    } catch (error) {
        console.error("Payment failure recording error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to record payment failure",
            error: error.message
        });
    }
};