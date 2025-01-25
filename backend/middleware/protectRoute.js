import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        const user = await userModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User Not Found" }); 
        }

        req.user = user;
        next();
    } catch (error) {
        // Generic error handling for jwt or database errors
        res.status(401).json({ error: "Unauthorized: " + error.message });
    }
};

export { protectRoute };
