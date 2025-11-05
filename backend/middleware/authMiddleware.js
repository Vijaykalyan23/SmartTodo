import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Dev bypass: when running locally you can set DEV_BYPASS=true and DEMO_USER_ID to a valid ObjectId
  if (!req.headers.authorization && process.env.DEV_BYPASS === 'true') {
    req.user = { _id: process.env.DEMO_USER_ID || '64cafebe0000000000000001' };
    return next();
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user to request (minus password)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
