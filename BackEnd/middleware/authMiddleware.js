import JWT from 'jsonwebtoken';
import Ecom_User from '../models/userModel.js';
import User from '../models/userModel.js';


export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token or malformed token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Invalid or expired token", err });
  }
};


//admin = 1
export const isAdmin = async (req, res, next) => {
    try {
        const user = await Ecom_User.findById(req.user._id);
        if (user.role !== 1) {
            return res.json({ message: "You are not admin Baby...." });
        } else {
            next();
        }
    } catch (err) {
        res.json({ message: "Error from authmiddleware isAdmin", err });
    }
}

