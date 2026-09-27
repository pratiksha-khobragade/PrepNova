const DSAProblem = require("../models/DSAProblem");
const Submission = require("../models/Submission");

// ============================================================
// GET DSA PROGRESS
// ============================================================

const getDsaProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    // ----------------------------------------------------------
    // Fetch all active DSA problems
    // ----------------------------------------------------------

    const problems = await DSAProblem.find({
      isActive: true,
    })
      .sort({ problemId: 1 })
      .lean();

    // ----------------------------------------------------------
    // Fetch current user's submissions
    // IMPORTANT:
    // Submission model uses "user", NOT "userId"
    // ----------------------------------------------------------

    const submissions = await Submission.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // ----------------------------------------------------------
    // Basic statistics
    // ----------------------------------------------------------

    const totalProblems = problems.length;

    // A problem is solved when the user has
    // at least one accepted submission.
    const solvedProblemIds = new Set();

    submissions.forEach((submission) => {
      if (
        submission.status === "accepted" &&
        submission.problemId !== undefined &&
        submission.problemId !== null
      ) {
        solvedProblemIds.add(
          String(submission.problemId)
        );
      }
    });

    const solvedProblems =
      solvedProblemIds.size;

    const remainingProblems = Math.max(
      totalProblems - solvedProblems,
      0
    );

    const solvedPercentage =
      totalProblems > 0
        ? Math.round(
            (solvedProblems / totalProblems) * 100
          )
        : 0;

    // ----------------------------------------------------------
    // Difficulty statistics
    // ----------------------------------------------------------

    const difficultyStats = {
      Easy: {
        total: 0,
        solved: 0,
      },
      Medium: {
        total: 0,
        solved: 0,
      },
      Hard: {
        total: 0,
        solved: 0,
      },
    };

    problems.forEach((problem) => {
      const difficulty = problem.difficulty;

      if (!difficultyStats[difficulty]) {
        return;
      }

      difficultyStats[difficulty].total += 1;

      if (
        solvedProblemIds.has(
          String(problem.problemId)
        )
      ) {
        difficultyStats[difficulty].solved += 1;
      }
    });

    // ----------------------------------------------------------
    // Submission statistics
    // ----------------------------------------------------------

    const totalSubmissions =
      submissions.length;

    const acceptedSubmissions =
      submissions.filter(
        (submission) =>
          submission.status === "accepted"
      ).length;

    const failedSubmissions =
      totalSubmissions -
      acceptedSubmissions;

    const accuracy =
      totalSubmissions > 0
        ? Math.round(
            (acceptedSubmissions /
              totalSubmissions) *
              100
          )
        : 0;

    // ----------------------------------------------------------
    // Submission dates
    // ----------------------------------------------------------

    const submissionDates = new Set();

    submissions.forEach((submission) => {
      if (!submission.createdAt) {
        return;
      }

      const date = new Date(
        submission.createdAt
      );

      const dateString =
        date.toISOString().split("T")[0];

      submissionDates.add(dateString);
    });

    // ----------------------------------------------------------
    // Current streak
    // ----------------------------------------------------------

    const sortedDates = Array.from(
      submissionDates
    )
      .sort()
      .reverse();

    let currentStreak = 0;

    if (sortedDates.length > 0) {
      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const latestDate = new Date(
        sortedDates[0]
      );

      latestDate.setHours(
        0,
        0,
        0,
        0
      );

      const differenceFromToday =
        Math.floor(
          (
            today.getTime() -
            latestDate.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        );

      if (differenceFromToday <= 1) {
        currentStreak = 1;

        for (
          let i = 1;
          i < sortedDates.length;
          i++
        ) {
          const previousDate =
            new Date(
              sortedDates[i - 1]
            );

          const currentDate =
            new Date(
              sortedDates[i]
            );

          previousDate.setHours(
            0,
            0,
            0,
            0
          );

          currentDate.setHours(
            0,
            0,
            0,
            0
          );

          const difference =
            Math.floor(
              (
                previousDate.getTime() -
                currentDate.getTime()
              ) /
                (1000 * 60 * 60 * 24)
            );

          if (difference === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // ----------------------------------------------------------
    // Longest streak
    // ----------------------------------------------------------

    let longestStreak = 0;

    if (sortedDates.length > 0) {
      const chronologicalDates =
        Array.from(
          submissionDates
        ).sort();

      let streak = 1;

      longestStreak = 1;

      for (
        let i = 1;
        i < chronologicalDates.length;
        i++
      ) {
        const previousDate =
          new Date(
            chronologicalDates[i - 1]
          );

        const currentDate =
          new Date(
            chronologicalDates[i]
          );

        previousDate.setHours(
          0,
          0,
          0,
          0
        );

        currentDate.setHours(
          0,
          0,
          0,
          0
        );

        const difference =
          Math.floor(
            (
              currentDate.getTime() -
              previousDate.getTime()
            ) /
              (1000 * 60 * 60 * 24)
          );

        if (difference === 1) {
          streak++;
        } else {
          streak = 1;
        }

        longestStreak = Math.max(
          longestStreak,
          streak
        );
      }
    }

    // ----------------------------------------------------------
    // Recent submissions
    // ----------------------------------------------------------

    const recentSubmissions =
      submissions
        .slice(0, 5)
        .map((submission) => ({
          id: submission._id,
          problemId:
            submission.problemId,
          status:
            submission.status,
          language:
            submission.language,
          passedTestCases:
            submission.passedTestCases || 0,
          totalTestCases:
            submission.totalTestCases || 0,
          runtime:
            submission.runtime || null,
          memory:
            submission.memory || null,
          createdAt:
            submission.createdAt,
        }));

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,

      progress: {
        totalProblems,
        solvedProblems,
        remainingProblems,
        solvedPercentage,

        totalSubmissions,
        acceptedSubmissions,
        failedSubmissions,
        accuracy,

        // Keep uppercase keys because
        // DSAProgress.jsx expects Easy/Medium/Hard.
        difficulty: {
          Easy: difficultyStats.Easy,
          Medium: difficultyStats.Medium,
          Hard: difficultyStats.Hard,
        },

        currentStreak,
        longestStreak,

        recentSubmissions,
      },
    });
  } catch (error) {
    console.error(
      "Get DSA Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch DSA progress.",
    });
  }
};


// ============================================================
// GET DSA SUBMISSION HISTORY
// ============================================================

const getDsaSubmissionHistory = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const skip =
      (page - 1) * limit;

    const [
      submissions,
      total,
    ] = await Promise.all([
      Submission.find({
        user: userId,
      })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate(
          "problem",
          "problemId title difficulty"
        )
        .lean(),

      Submission.countDocuments({
        user: userId,
      }),
    ]);

    return res.status(200).json({
      success: true,

      submissions,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(
      "Get DSA Submission History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch submission history.",
    });
  }
};


// ============================================================
// GET SOLVED DSA PROBLEMS
// ============================================================

const getSolvedDsaProblems = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    // ----------------------------------------------------------
    // Find accepted submissions for this user
    // ----------------------------------------------------------

    const acceptedSubmissions =
      await Submission.find({
        user: userId,
        status: "accepted",
      })
        .select("problemId")
        .lean();

    // ----------------------------------------------------------
    // Get unique numeric problem IDs
    // ----------------------------------------------------------

    const solvedProblemIds = [
      ...new Set(
        acceptedSubmissions
          .map(
            (submission) =>
              submission.problemId
          )
          .filter(
            (id) =>
              id !== undefined &&
              id !== null
          )
          .map((id) => Number(id))
      ),
    ];

    // ----------------------------------------------------------
    // Find problems using problemId
    // IMPORTANT:
    // Submission.problemId is NOT MongoDB _id
    // ----------------------------------------------------------

    const solvedProblems =
      solvedProblemIds.length > 0
        ? await DSAProblem.find({
            problemId: {
              $in: solvedProblemIds,
            },
            isActive: true,
          })
            .sort({ problemId: 1 })
            .lean()
        : [];

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return res.status(200).json({
      success: true,

      count:
        solvedProblems.length,

      solvedProblems,
    });
  } catch (error) {
    console.error(
      "Get Solved DSA Problems Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch solved DSA problems.",
    });
  }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getDsaProgress,
  getDsaSubmissionHistory,
  getSolvedDsaProblems,
};