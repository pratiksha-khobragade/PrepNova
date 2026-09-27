require("dotenv").config();

const connectDB = require("../../../config/db");
const MCQQuestion = require("../models/MCQQuestion");
const mcqQuestions = require("./mcqQuestions");

const seedMCQs = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB.");

    // Remove existing MCQ questions
    await MCQQuestion.deleteMany({});

    console.log("Existing MCQs cleared.");

    // Insert the initial 20 MCQs
    const insertedQuestions =
      await MCQQuestion.insertMany(
        mcqQuestions
      );

    console.log(
      `${insertedQuestions.length} MCQs inserted successfully.`
    );

    console.log(
      "========================================"
    );
    console.log(
      "MCQ database seeding completed successfully."
    );
    console.log(
      "========================================"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "MCQ Seed Error:",
      error
    );

    process.exit(1);
  }
};

seedMCQs();