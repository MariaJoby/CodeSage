const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
      console.log("AUTH HEADER:", req.headers.authorization);
  
      let token;
  
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
  
        console.log("TOKEN:", token);
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        console.log("DECODED:", decoded);
  
        req.user = await User.findById(decoded.id).select("-password");
  
        console.log("USER:", req.user);
  
        next();
      } else {
        return res.status(401).json({ message: "No token provided" });
      }
    } catch (error) {
      console.log("ERROR:", error.message);
      return res.status(401).json({ message: "Not authorized" });
    }
  };

module.exports = { protect };