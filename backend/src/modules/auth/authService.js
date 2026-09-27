// =====================================================
// PrepNova - Authentication Service
// =====================================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("./userModel");

// =====================================================
// Google OAuth Client
// =====================================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// =====================================================
// Create JWT Token
// =====================================================

const createToken = (userId) => {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// Signup
// =====================================================

const signupUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  // Clean the values received from the frontend
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Check whether email already exists
  const existingUser = await User.findOne({
    email: cleanEmail,
  });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create the user
  const user = await User.create({
    firstName: cleanFirstName,
    lastName: cleanLastName,
    email: cleanEmail,
    password: hashedPassword,
  });

  // Create login token
  const token = createToken(
    user._id.toString()
  );

  // Return user information without password
  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

// =====================================================
// Login
// =====================================================

const loginUser = async ({
  email,
  password,
}) => {
  // Clean email
  const cleanEmail = email.trim().toLowerCase();

  // Find user by email
  const user = await User.findOne({
    email: cleanEmail,
  });

  // Don't reveal whether the email exists
  if (!user) {
    throw new Error(
      "Invalid email or password."
    );
  }

  // Compare entered password with hashed password
  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "Invalid email or password."
    );
  }

  // Create login token
  const token = createToken(
    user._id.toString()
  );

  // Return user information without password
  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

// =====================================================
// Google Login
// =====================================================

const googleLoginUser = async (
  credential
) => {
  if (!credential) {
    throw new Error(
      "Google credential is required."
    );
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google Client ID is not configured on the server."
    );
  }

  // Verify Google credential
  const ticket =
    await googleClient.verifyIdToken({
      idToken: credential,
      audience:
        process.env.GOOGLE_CLIENT_ID,
    });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error(
      "Invalid Google credential."
    );
  }

  const {
    sub: googleId,
    email,
    email_verified: emailVerified,
    given_name: givenName,
    family_name: familyName,
  } = payload;

  // Make sure Google has verified the email
  if (!email || !emailVerified) {
    throw new Error(
      "Google email could not be verified."
    );
  }

  const cleanEmail =
    email.trim().toLowerCase();

  // Find existing user by email
  let user = await User.findOne({
    email: cleanEmail,
  });

  // ===================================================
  // Existing User
  // ===================================================

  if (user) {
    // Connect Google account if not already connected
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    } else if (
      user.googleId !== googleId
    ) {
      throw new Error(
        "This email is already connected to another Google account."
      );
    }
  }

  // ===================================================
  // New User
  // ===================================================

  else {
    // Generate a random password because Google
    // users authenticate through Google.
    const randomPassword =
      `${googleId}-${Date.now()}-${Math.random()}`;

    const hashedPassword =
      await bcrypt.hash(
        randomPassword,
        12
      );

    user = await User.create({
      firstName:
        givenName || "PrepNova",
      lastName:
        familyName || "User",
      email: cleanEmail,
      password: hashedPassword,
      googleId,
    });
  }

  // ===================================================
  // Create PrepNova JWT
  // ===================================================

  const token = createToken(
    user._id.toString()
  );

  // Return user information without password
  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};

// =====================================================
// Export
// =====================================================

module.exports = {
  signupUser,
  loginUser,
  googleLoginUser,
};