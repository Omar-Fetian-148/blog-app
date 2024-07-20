import { generateError } from "./helpers.js";
const { TOKEN_EXPIRATION, TOKEN_SECRET } = process.env;
import jwt from "jsonwebtoken";

export default async function serverCleanupAuth(req) {
  let token = req.connectionParams.Authorization;
  let language = req.connectionParams.language;
  if (req.connectionParams.Authorization) token = token.split(" ").pop().trim();

  // if no token, return request object as is
  if (!token) return req;

  // if there is a token, try to decode and attach user data to the request object
  try {
    const { data } = jwt.verify(token, TOKEN_SECRET, {
      maxAge: TOKEN_EXPIRATION,
    });

    req.user = data;
    req.headers = {
      language: language,
      authorization: token,
    };

    // adds data payload to request object as "user"
    return req;
  } catch {
    generateError("redirectToLogin");
  }
}
