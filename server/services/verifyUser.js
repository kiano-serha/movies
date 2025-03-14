const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
  authorization = await req.headers.authorization;
  authorization ? (token = authorization.replace("Bearer ", "")) : (token = "");
  if (!token) {
    return res.json({ error: "User not authenticated" });
  } else {
    jwt.verify(token, process.env.JSON_SECRET_KEY, (err, decoded) => {
      if (err) return res.json({ error: "User not authenticated" });
      else {
        req.user_id = decoded.user;
        req.role_id = decoded.role_id;
        next();
      }
    });
  }
};

module.exports = verifyUser;
