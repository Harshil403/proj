require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;

// ROUTE 1: Public route
app.get("/", (req, res) => {
  res.send("Hello, world with CI/CD!");
});

// Basic Auth Middleware
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Secret Area"');
    return res.status(401).send("Authentication required");
  }

  // Decode Base64 credentials
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (
    username === process.env.USERNAME &&
    password === process.env.PASSWORD
  ) {
    next();
  } else {
    res.status(403).send("Invalid username or password");
  }
}

// ROUTE 2: Protected route
app.get("/secret", basicAuth, (req, res) => {
  res.send(process.env.SECRET_MESSAGE);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

