import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
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


export function verifyJWT(req) {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if (token) {
    token = token.split(' ').pop().trim();
    const { data } = jwt.verify(token, process.env.TOKEN_SECRET, { maxAge: process.env.TOKEN_EXPIRATION });
    return data;
  }
}

