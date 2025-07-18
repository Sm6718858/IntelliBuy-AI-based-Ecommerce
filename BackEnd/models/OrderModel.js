import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    payStatus: { 
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    },
    orderStatus: {
        type: String,
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"],
        default: "Not Process"
    },
    orderId: { 
        type: String, 
        required: true 
    },
    paymentId: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    },
    userShipping: { 
        type: String,
        required: true 
    },
    cartItems: { 
        type: Array,
        required: true 
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_signature: {
        type: String
    },
    failureReason: {
        type: String
    },
    verifiedAt: {
        type: Date
    },
    failedAt: {
        type: Date
    },
    statusUpdatedAt: {
        type: Date,
        default: Date.now
    },
    timeoutAt: {  
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000) 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ payStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: 1 });
orderSchema.index({ timeoutAt: 1 }); 

const Payment = mongoose.model("Payment", orderSchema);
export default Payment;