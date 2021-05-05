import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const SECRET_KEY = "some-secret-key";

export const encode = async (req, res, next) => {
  try {
    //get userId from request parameters
    const { userId } = req.params;
    //get user info from model
    const user = await UserModel.getUserById(userId);
    //create payload
    const payload = {
      userId: user._id,
      userType: user.type,
    };
    //sign payload to JWT
    const authToken = jwt.sign(payload, SECRET_KEY);
    console.log("Auth", authToken);
    req.authToken = authToken;
    //forward this info
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
};

export const decode = (req, res, next) => {
  //is authorization header present?
  if (!req.headers["authorization"]) {
    return res
      .status(400)
      .json({ success: false, message: "No access token provided" });
  }
  const accessToken = req.headers.authorization.split("")[1];
  //lets try to decode our token
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    req.userType = decoded.type;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
