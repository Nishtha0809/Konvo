// import jwt from "jsonwebtoken"
// import User from "../models/user.model.js"

// export const protectRoute = async(req,res, next) =>{
//     try{
//         console.log("JWT from cookie:", req.cookies.jwt);
//         const token= req.cookies.jwt

//         if(!token){
//             return res.status(401).json({message: "unauthorized- no token provided"})
//         }
//         const decoded = jwt.verify(token,process.env.JWT_SECRET)
//         console.log("Decoded Token:", decoded);

//         if(!decoded){
//              return res.status(401).json({message: "unauthorized- no token provided"})
//         }
//         const user = await User.findById(decoded.userId).select("-password");

//         if(!user){
//              return res.status(404).json({message: "user not found"})
//         }

//         req.user = user;
//         next()
//     }
//     catch(error){
//         console.log("error in protectRoute middleware: ", error.message);
//         return res.status(500).json({message: "internal server error"});
//     }
// }
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    console.log("🍪 JWT from cookie:", token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);

    if (!decoded?.userId) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to req object
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in protectRoute middleware:", error.message);

    // Specific token error messages
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
