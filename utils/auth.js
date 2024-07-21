import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from "../models/index.js";
import { generateError } from "../utils/helpers.js";
dotenv.config()

export function generateJWT(user) {

  const options = { expiresIn: process.env.TOKEN_EXPIRATION, };

  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role
  };

  // returns jwt token
  return jwt.sign({ data: payload }, process.env.TOKEN_SECRET, options);
}


export function verifyJWT(token) {
  if (token) {
    token = token.split(' ').pop().trim();
    const { data } = jwt.verify(token, process.env.TOKEN_SECRET, { maxAge: process.env.TOKEN_EXPIRATION });
    return data;
  }
}

export async function authMiddleware(req) {
  try {

    const language = req.headers.language || 'en'
    let token = req.body.token || req.query.token || req.headers.authorization || '';
    if (!token) return req;

    const decodedToken = await verifyJWT(token);

    req.user = decodedToken;
    req.authorization = token;
    req.language = language;
    return req
  } catch (err) {
    console.error('Authentication error:', err);
  }
}

