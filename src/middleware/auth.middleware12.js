const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You don't have permission to access this resource",
      });
    }

    req.user = decoded; //attach the verified JWT payload to the request so downstream middleware and controllers can access the authenticated user's details (e.g., id and role) through req.user.

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role != "user" && decoded.role != "artist") {
      return res.status(403).json({
        messgage: "you dont have the access",
      });
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized ",
    });
  }
}
module.exports = { authArtist, authUser };
