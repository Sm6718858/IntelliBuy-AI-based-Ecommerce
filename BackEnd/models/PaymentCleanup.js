import Payment from "./OrderModel.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const cleanupAbandonedPayments = async () => {
    try {
        const now = new Date();
        const result = await Payment.updateMany(
            { 
                payStatus: "created",
                timeoutAt: { $lte: now }, 
                $or: [
                    { paymentId: 'pending' },
                    { paymentId: { $exists: false } }
                ]
            },
            { 
                payStatus: "failed",
                failureReason: "Payment timeout (5 minutes)",
                failedAt: now,
                statusUpdatedAt: now
            }
        );
        
        if (result.modifiedCount > 0) {
            console.log(`[${now.toISOString()}] Marked ${result.modifiedCount} abandoned payments as failed`);
        }
    } catch (error) {
        console.error("Error cleaning up abandoned payments:", error);
    }
};

const initializePaymentCleanup = () => {
    setInterval(cleanupAbandonedPayments, 60 * 1000);
    cleanupAbandonedPayments();
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to MongoDB for payment cleanup"))
            .catch(err => console.error("MongoDB connection error:", err));
    }
    return cleanupAbandonedPayments;
};

export default initializePaymentCleanup;
