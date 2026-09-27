// =====================================================
// Progress Tracking - CodeChef Service
// =====================================================
// CodeChef does not offer ANY public API, official or
// otherwise. So this scrapes the public profile page's HTML
// directly. This is more fragile than the other 3 services -
// if CodeChef ever redesigns their profile page, the class
// names below will need to be updated to match.
//
// Requires two extra packages that are NOT in the original
// PrepNova backend yet:
//   npm install axios cheerio

const axios = require("axios");
const cheerio = require("cheerio");

const fetchCodechefStats = async (username) => {
  let html;

  try {
    const response = await axios.get(
      `https://www.codechef.com/users/${username}`,
      {
        // a real-looking User-Agent, otherwise CodeChef may block the request
        headers: { "User-Agent": "Mozilla/5.0 (PrepNova-App)" },
      }
    );

    html = response.data;
  } catch (error) {
    throw new Error("CodeChef username not found.");
  }

  // load the HTML into cheerio so we can query it like jQuery
  const $ = cheerio.load(html);

  const rating = $(".rating-number").first().text().trim();
  const stars = $(".rating-star").first().text().trim();

  const highestRatingRaw = $(".rating-header small")
    .text()
    .replace(/[()]/g, "")
    .replace("Highest Rating", "")
    .trim();

  // if we couldn't find a rating on the page, treat it as "user not found"
  if (!rating) {
    throw new Error("CodeChef username not found.");
  }

  return {
    rating: Number(rating) || 0,
    stars,
    highestRating: Number(highestRatingRaw) || Number(rating) || 0,
  };
};

module.exports = { fetchCodechefStats };
