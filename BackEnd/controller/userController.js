import Ecom_User from '../models/userModel.js'
import { hashPassword, comparePassword } from '../helper/authHelper.js';
import JWT from 'jsonwebtoken';
import Payment from '../models/OrderModel.js';

export const userRegister = async (req, res) => {
  const { name, phone, email, role, password,answer } = req.body;

  try {
    const userExist = await Ecom_User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await Ecom_User.create({
      name,
      phone,
      email,
      role,
      password: hashedPassword,
      answer
    });

    return res.status(201).json({
      success: true,
      message: "User Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error("userRegister error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
      error: err.message
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Ecom_User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please register first.",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Password not matched. Try again.",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
         _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in login API",
      error: err.message,
    });
  }
};

export const Forgot_Password = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: 'email is required' });
    }
    if (!answer) {
      res.status(400).send({ message: 'answer is required' });
    }
    if (!newPassword) {
      res.status(400).send({ message: ' new pass is required' });
    }
    const user = await Ecom_User.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'wrong email or answer',
      })
    }
    const hashedPassword = await hashPassword(newPassword);
    await Ecom_User.findByIdAndUpdate(user._id,{ password: hashedPassword });
    res.status(200).send({
      success: true,
      message: 'password reset successfully',
    })

  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Forgot Passwordd API",
      error: err.message,
    });
  }
}


export const userVerfy = async (req, res) => {
  res.json({ message: "Ok verified" });
}

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await  Ecom_User.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await  Ecom_User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};


export const getOrdersController = async (req, res) => {
    try {
        const orders = await Payment.find({ userId: req.user._id })
            .sort({ createdAt: -1 }); 

        res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("Error in getOrdersController:", error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error: error.message
        });
    }
};


export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await Payment.find({})
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.status(200).send({
            success: true,
            message: "All orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("Error in getAllOrdersController:", error);
        res.status(500).send({
            success: false,
            message: "Error while getting all orders",
            error: error.message
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).send({
                success: false,
                message: "Order ID and status are required"
            });
        }

        const validStatuses = ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({
                success: false,
                message: "Invalid status value"
            });
        }

        const updatedOrder = await Payment.findByIdAndUpdate(
            orderId,
            {
                orderStatus: status,
                statusUpdatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error("Error in updateOrderStatusController:", error);
        res.status(500).send({
            success: false,
            message: "Error while updating order status",
            error: error.message
        });
    }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await Ecom_User.find().select("-password -answer");
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users
    });
  } catch (error) {
    console.error("Error in getAllUsersController:", error);
    res.status(500).json({
      success: false,
      message: "Error while getting all users",
      error: error.message
    });
  }
};


