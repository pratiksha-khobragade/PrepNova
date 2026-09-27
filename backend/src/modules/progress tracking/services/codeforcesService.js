// =====================================================
// Progress Tracking - Codeforces Service
// =====================================================
// Codeforces has a proper official public API - no key needed.
// Docs: https://codeforces.com/apiHelp

const fetchCodeforcesStats = async (username) => {
  const response = await fetch(
    `https://codeforces.com/api/user.info?handles=${username}`
  );

  const data = await response.json();

  // Codeforces returns { status: "OK" | "FAILED", ... } instead of
  // using normal HTTP error codes, so we check "status" ourselves.
  if (data.status !== "OK") {
    throw new Error("Codeforces username not found.");
  }

  const user = data.result[0];

  return {
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "unrated",
    maxRank: user.maxRank || "unrated",
    avatar: user.avatar,
  };
};

module.exports = { fetchCodeforcesStats };
