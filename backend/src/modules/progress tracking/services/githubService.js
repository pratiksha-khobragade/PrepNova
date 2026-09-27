// =====================================================
// Progress Tracking - GitHub Service
// =====================================================
// GitHub has a clean official public API, no key needed for
// basic profile data. Note: unauthenticated requests are
// rate-limited to 60/hour per IP by GitHub itself.

const fetchGithubStats = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      // GitHub rejects requests that don't send a User-Agent
      "User-Agent": "PrepNova-App",
    },
  });

  if (response.status === 404) {
    throw new Error("GitHub username not found.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub stats. Try again later.");
  }

  const data = await response.json();

  // Only keep the fields the UI actually needs
  return {
    avatarUrl: data.avatar_url,
    name: data.name,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    profileUrl: data.html_url,
  };
};

module.exports = { fetchGithubStats };
