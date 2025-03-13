const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../services/mailer");
const executeDBQuery = require("../services/database");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "SELECT first_name, last_name, id, email_address, password from users WHERE email_address = ? and email_verified_at IS NOT NULL and deleted_at IS NULL",
      [req.body.email_address]
    );
    if (query_one[0].length == 1) {
      bcrypt.compare(
        req.body.password,
        query_one[0][0].password,
        (err, result) => {
          try {
            if (err) throw new Error("Invalid Credentials");
            if (result == true) {
              const token = jwt.sign(
                { user: query_one[0][0].id },
                process.env.JSON_SECRET_KEY,
                { expiresIn: "1h" }
              );
              if (token) {
                res.cookie("token", token, { httpOnly: true });
                return res.json({
                  message: "You have been logged in successfully",
                  user_first_name: query_one[0][0].first_name,
                  user_last_name: query_one[0][0].last_name,
                  user_email_address: query_one[0][0].email_address,
                  token: token,
                });
              } else {
                throw new Error("Error authenticating user");
              }
            } else {
              throw new Error("Invalid Credentials");
            }
          } catch (ex1) {
            return res.json({ error: ex1.message });
          }
        }
      );
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logout successful" });
};

const register = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "SELECT * FROM users WHERE email_address = ?",
      [req.body.email_address]
    );
    if (query_one[0].length == 0) {
      bcrypt.hash(req.body.password, 10, async (error, hash) => {
        const query_two = await executeDBQuery(
          "INSERT INTO users(first_name, last_name, email_address, password, created_at) values(?,?,?,?,?)",
          [
            req.body.first_name,
            req.body.last_name,
            req.body.email_address,
            hash,
            new Date(),
          ]
        );
        if (query_two[0].affectedRows > 0) {
          const token = jwt.sign(
            { user: req.body.email_address },
            process.env.JSON_SECRET_KEY,
            {
              expiresIn: "0.5h",
            }
          );
          sendMail({
            to_address: req.body.email_address,
            subject: "Verification Email for Movies",
            html: `
                  <h2>Email Verification</h2>
                  <p>Please use the link below to verify your email.</p>
                  <p><a href="${process.env.HOST_ADDRESS}/auth/verify/email/${token}">Click me<a></p>
              `,
          });
          return res.json({
            message:
              "Verification email has been sent. Please verify to continue",
          });
        } else {
          throw new Error("Error creating your account");
        }
      });
    } else {
      throw new Error("This email has already been used");
    }
  } catch (ex1) {
    return res.json({ error: ex1.message });
  }
};

//try send message
const verifyEmail = (req, res) => {
  try {
    jwt.verify(
      req.params.token,
      process.env.JSON_SECRET_KEY,
      async (err, decoded) => {
        try {
          if (err) {
            throw new Error("Invalid Verification Request");
          } else {
            const query_one = await executeDBQuery(
              "SELECT * FROM users where email_address = ?",
              [decoded.user]
            );
            if (query_one[0].length > 0) {
              if (query_one[0][0].email_verified_at == null) {
                const query_two = await executeDBQuery(
                  "UPDATE users SET email_verified_at = ? WHERE email_address = ?",
                  [new Date(), decoded.user]
                );
                if (query_two[0].affectedRows > 0) {
                  return res.redirect(process.env.FRONTEND_ADDRESS + "/login");
                  // return res.json({
                  //   message: "You hav been verified successfully",
                  // });
                } else {
                  throw new Error("Error verifying email");
                }
              } else {
                throw new Error("This email has already been verified");
              }
            } else {
              throw new Error("Error verifying email");
            }
          }
        } catch (ex1) {
          return res.json({ error: ex1.message });
        }
      }
    );
  } catch (ex2) {
    return res.json({ error: ex2.message });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
};
