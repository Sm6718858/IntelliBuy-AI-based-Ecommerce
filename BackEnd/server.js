import express from 'express';
import dotenv from 'dotenv';
import { mongoDB } from './config/db.js';
import authRouter from './routes/authRoute.js'
import  CatagoryRoute from './routes/CatagoryRoute.js';
import productRoute from './routes/ProductRoute.js';
import chatRoutes from "./routes/chatRoutes.js";
import paymentRountes from './routes/PaymentRoute.js'
import initializePaymentCleanup from './models/PaymentCleanup.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoDB();

app.use(cors());
app.use(express.json());
app.use('/api',authRouter);
app.use('/api', CatagoryRoute);
app.use('/api',productRoute);
app.use("/api", chatRoutes);
app.use('/api',paymentRountes);


app.get('/', (req, res) => {
  res.send("Hello ji, server is created");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initializePaymentCleanup();