
import User from "../models/user.model.js";

const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.auth?._id;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required"
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default requireAdmin;
