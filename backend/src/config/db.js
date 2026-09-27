// =====================================================
// PrepNova - MongoDB Connection
// =====================================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is missing from .env"
      );
    }

    const connection =
      await mongoose.connect(mongoURI);

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;