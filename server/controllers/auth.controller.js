import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

// SIGN IN
const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: "Email and password don't match."
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("t", token, {
      expire: new Date() + 9999
    });

    
return res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});


  } catch (err) {
    return res.status(401).json({
      error: "Could not sign in"
    });
  }
};

// SIGN OUT
const signout = (req, res) => {
  res.clearCookie("t");

  return res.status(200).json({
    message: "signed out"
  });
};

// AUTHENTICATION CHECK
const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth"
});

// AUTHORIZATION CHECK
const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    req.profile._id == req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }

  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
};