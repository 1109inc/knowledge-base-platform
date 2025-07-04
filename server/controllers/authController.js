// Import necessary modules
const crypto = require("crypto"); // For generating random tokens
const nodemailer = require("nodemailer"); // For sending emails
const User = require("../models/User"); // User model
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JSON Web Tokens

/**
 * Registers a new user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const registerUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const passwordHash = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user instance
    const user = await User.create({ email, passwordHash });

    // Generate a JWT for the new user
    const token = jwt.sign(
      {
        userId: user._id, // Include user ID in the token payload
        email: user.email, // Include email in the token payload
      },
      process.env.JWT_SECRET, // Use JWT secret from environment variables
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Send a success response with the token and user information
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logs in an existing user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if a user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT for the logged-in user
    const token = jwt.sign(
      {
        userId: user._id, // Include user ID in the token payload
        email: user.email, // Include email in the token payload
      },
      process.env.JWT_SECRET, // Use JWT secret from environment variables
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Send a success response with the token and user information
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Handles forgot password requests.
 * Generates a reset token and sends a password reset email to the user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body; // Extract email from request body

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Respond generically to avoid leaking information about user existence
      return res.status(200).json({ message: "If the email exists, a reset link has been sent" });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set the reset token and its expiration time (1 hour) on the user object
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds

    // Save the user with the reset token and expiration
    await user.save();

    // Construct the password reset URL
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Configure Nodemailer transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER, // Email user from environment variables
        pass: process.env.EMAIL_PASS, // Email password from environment variables
      },
    });

    // Define email options
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER, // Sender email address
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    };

    // Send the password reset email
    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Resets the user's password using a valid reset token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const resetPassword = async (req, res) => {
  const token = req.params.token; // Extract reset token from URL parameters
  const { newPassword } = req.body; // Extract new password from request body

  try {
    // Find the user by the reset token, ensuring the token is not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid (greater than current time)
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiration fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user object with the new password and cleared reset fields
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

// Export the controller functions
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
