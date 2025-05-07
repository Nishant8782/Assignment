import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

import dotenv from 'dotenv'

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token, "tokernnnnnnn")

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;
