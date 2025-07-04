// Import jsonwebtoken library for token verification
const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes by verifying JWT.
 * Checks for a Bearer token in the Authorization header.
 * Verifies the token and attaches user information (id and email) to the request object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const protect = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Extract the token from the "Bearer <token>" string
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user information (ID and email) to the request object
    req.user = {
      id: decoded.userId,
      email: decoded.email, // Ensure email is included from the token payload
    };
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, respond with an unauthorized error
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Export the protect middleware
module.exports = protect;
