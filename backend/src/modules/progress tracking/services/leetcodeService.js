// =====================================================
// Progress Tracking - LeetCode Service
// =====================================================
// NOTE: LeetCode does not offer an official public API.
// This calls the same internal GraphQL endpoint that
// leetcode.com's own website uses. It works today, but
// LeetCode can change it without notice - if this ever
// breaks, open leetcode.com in a browser, check the
// Network tab for the "graphql" request, and compare
// the query shape to the one below.

const fetchLeetcodeStats = async (username) => {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          realName
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // some LeetCode endpoints reject requests with no Referer
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch LeetCode stats. Try again later.");
  }

  const { data } = await response.json();

  if (!data || !data.matchedUser) {
    throw new Error("LeetCode username not found.");
  }

  const { profile, submitStats } = data.matchedUser;

  // submitStats.acSubmissionNum comes back as an array like:
  // [{difficulty: "All", count: 120}, {difficulty: "Easy", count: 50}, ...]
  // Turn it into a simple lookup object instead.
  const solvedByDifficulty = {};
  submitStats.acSubmissionNum.forEach((item) => {
    solvedByDifficulty[item.difficulty.toLowerCase()] = item.count;
  });

  return {
    ranking: profile.ranking,
    realName: profile.realName,
    totalSolved: solvedByDifficulty.all || 0,
    easySolved: solvedByDifficulty.easy || 0,
    mediumSolved: solvedByDifficulty.medium || 0,
    hardSolved: solvedByDifficulty.hard || 0,
  };
};

module.exports = { fetchLeetcodeStats };
