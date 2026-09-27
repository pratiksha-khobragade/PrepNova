// =====================================================
// PrepNova - DSA Problems Seed
// =====================================================

require("dotenv").config();

const mongoose = require("mongoose");

const DSAProblem = require("./models/DSAProblem");

// =====================================================
// MongoDB Connection
// =====================================================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env");
  process.exit(1);
}

// =====================================================
// DSA Problems
// =====================================================

const dsaProblems = [
  // ===================================================
  // 1. Two Sum
  // ===================================================

  {
    problemId: 1,
    title: "Two Sum",
    difficulty: "Easy",

    description:
      "Find two numbers in an array that add up to a given target.",

    topics: ["Array", "Hash Map"],

    example: {
      input:
        "nums = [2, 7, 11, 15], target = 9",

      output: "[0, 1]",

      explanation:
        "Because nums[0] + nums[1] = 2 + 7 = 9.",
    },

    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Each input has exactly one solution.",
    ],

    testCases: [
      {
        input:
          "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        isHidden: false,
      },
      {
        input:
          "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        isHidden: false,
      },
      {
        input:
          "nums = [3, 3], target = 6",
        output: "[0, 1]",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(nums, target) {
  // Write your solution here

  return [];
}`,

      Python: `def solution(nums, target):
    # Write your solution here

    return []`,

      Java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here

        return new int[]{};
    }
}`,

      "C++": `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here

        return {};
    }
};`,
    },

    runner: "twoSum",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 2. Valid Parentheses
  // ===================================================

  {
    problemId: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",

    description:
      "Given a string containing parentheses, determine if the input string is valid.",

    topics: ["Stack"],

    example: {
      input: 's = "()[]{}"',
      output: "true",

      explanation:
        "Every opening bracket is closed by the correct corresponding bracket.",
    },

    constraints: [
      "1 <= s.length <= 10⁴",
      "s consists of parentheses only: (), {}, and [].",
    ],

    testCases: [
      {
        input: 's = "()"',
        output: "true",
        isHidden: false,
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        isHidden: false,
      },
      {
        input: 's = "(]"',
        output: "false",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(s) {
  // Write your solution here

  return false;
}`,

      Python: `def solution(s):
    # Write your solution here

    return False`,

      Java: `class Solution {
    public boolean solution(String s) {
        // Write your solution here

        return false;
    }
}`,

      "C++": `class Solution {
public:
    bool solution(string s) {
        // Write your solution here

        return false;
    }
};`,
    },

    runner: "validParentheses",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 3. Best Time to Buy and Sell Stock
  // ===================================================

  {
    problemId: 3,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",

    description:
      "Find the maximum profit that can be achieved from buying and selling a stock once.",

    topics: ["Array"],

    example: {
      input:
        "prices = [7, 1, 5, 3, 6, 4]",

      output: "5",

      explanation:
        "Buy on day 2 at price 1 and sell on day 5 at price 6.",
    },

    constraints: [
      "1 <= prices.length <= 10⁵",
      "0 <= prices[i] <= 10⁴",
    ],

    testCases: [
      {
        input:
          "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        isHidden: false,
      },
      {
        input:
          "prices = [7, 6, 4, 3, 1]",
        output: "0",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(prices) {
  // Write your solution here

  return 0;
}`,

      Python: `def solution(prices):
    # Write your solution here

    return 0`,

      Java: `class Solution {
    public int solution(int[] prices) {
        // Write your solution here

        return 0;
    }
}`,

      "C++": `class Solution {
public:
    int solution(vector<int>& prices) {
        // Write your solution here

        return 0;
    }
};`,
    },

    runner: "bestTimeToBuyAndSellStock",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 4. Binary Search
  // ===================================================

  {
    problemId: 4,
    title: "Binary Search",
    difficulty: "Easy",

    description:
      "Search for a target value in a sorted array using binary search.",

    topics: ["Searching"],

    example: {
      input:
        "nums = [-1, 0, 3, 5, 9, 12], target = 9",

      output: "4",

      explanation:
        "The target value 9 is present at index 4.",
    },

    constraints: [
      "1 <= nums.length <= 10⁴",
      "-10⁴ <= nums[i], target <= 10⁴",
      "All integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],

    testCases: [
      {
        input:
          "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
        isHidden: false,
      },
      {
        input:
          "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        output: "-1",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(nums, target) {
  // Write your solution here

  return -1;
}`,

      Python: `def solution(nums, target):
    # Write your solution here

    return -1`,

      Java: `class Solution {
    public int solution(int[] nums, int target) {
        // Write your solution here

        return -1;
    }
}`,

      "C++": `class Solution {
public:
    int solution(vector<int>& nums, int target) {
        // Write your solution here

        return -1;
    }
};`,
    },

    runner: "binarySearch",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 5. Reverse Linked List
  // ===================================================

  {
    problemId: 5,
    title: "Reverse Linked List",
    difficulty: "Easy",

    description:
      "Reverse a singly linked list and return the reversed list.",

    topics: ["Linked List"],

    example: {
      input:
        "head = [1, 2, 3, 4, 5]",

      output:
        "[5, 4, 3, 2, 1]",

      explanation:
        "The links of the list are reversed so that the last node becomes the first.",
    },

    constraints: [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],

    testCases: [
      {
        input:
          "head = [1, 2, 3, 4, 5]",
        output:
          "[5, 4, 3, 2, 1]",
        isHidden: false,
      },
      {
        input:
          "head = [1, 2]",
        output:
          "[2, 1]",
        isHidden: false,
      },
      {
        input:
          "head = []",
        output: "[]",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(head) {
  // Write your solution here

  return [];
}`,

      Python: `def solution(head):
    # Write your solution here

    return []`,

      Java: `class Solution {
    public int[] solution(int[] head) {
        // Write your solution here

        return new int[]{};
    }
}`,

      "C++": `class Solution {
public:
    vector<int> solution(vector<int>& head) {
        // Write your solution here

        return {};
    }
};`,
    },

    runner: "reverseLinkedList",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 6. Longest Substring
  // ===================================================

  {
    problemId: 6,
    title:
      "Longest Substring Without Repeating Characters",

    difficulty: "Medium",

    description:
      "Find the length of the longest substring without repeating characters.",

    topics: ["String", "Hash Map"],

    example: {
      input:
        's = "abcabcbb"',

      output: "3",

      explanation:
        'The longest substring without repeating characters is "abc".',
    },

    constraints: [
      "0 <= s.length <= 5 × 10⁴",
      "s consists of English letters, digits, symbols and spaces.",
    ],

    testCases: [
      {
        input:
          's = "abcabcbb"',
        output: "3",
        isHidden: false,
      },
      {
        input:
          's = "bbbbb"',
        output: "1",
        isHidden: false,
      },
      {
        input:
          's = "pwwkew"',
        output: "3",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(s) {
  // Write your solution here

  return 0;
}`,

      Python: `def solution(s):
    # Write your solution here

    return 0`,

      Java: `class Solution {
    public int solution(String s) {
        // Write your solution here

        return 0;
    }
}`,

      "C++": `class Solution {
public:
    int solution(string s) {
        // Write your solution here

        return 0;
    }
};`,
    },

    runner: "longestSubstring",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 7. 3Sum
  // ===================================================

  {
    problemId: 7,
    title: "3Sum",
    difficulty: "Medium",

    description:
      "Find all unique triplets in the array that sum to zero.",

    topics: ["Array"],

    example: {
      input:
        "nums = [-1, 0, 1, 2, -1, -4]",

      output:
        "[[-1,-1,2],[-1,0,1]]",

      explanation:
        "These are the unique triplets whose sum is zero.",
    },

    constraints: [
      "3 <= nums.length <= 3000",
      "-10⁵ <= nums[i] <= 10⁵",
    ],

    testCases: [
      {
        input:
          "nums = [-1, 0, 1, 2, -1, -4]",
        output:
          "[[-1,-1,2],[-1,0,1]]",
        isHidden: false,
      },
      {
        input:
          "nums = [0, 1, 1]",
        output: "[]",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(nums) {
  // Write your solution here

  return [];
}`,

      Python: `def solution(nums):
    # Write your solution here

    return []`,

      Java: `class Solution {
    public List<List<Integer>> solution(int[] nums) {
        // Write your solution here

        return new ArrayList<>();
    }
}`,

      "C++": `class Solution {
public:
    vector<vector<int>> solution(vector<int>& nums) {
        // Write your solution here

        return {};
    }
};`,
    },

    runner: "threeSum",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 8. Product Except Self
  // ===================================================

  {
    problemId: 8,
    title: "Product of Array Except Self",
    difficulty: "Medium",

    description:
      "Return an array where each element is the product of all elements except itself.",

    topics: ["Array"],

    example: {
      input:
        "nums = [1, 2, 3, 4]",

      output:
        "[24,12,8,6]",

      explanation:
        "Each output value is the product of every element except the element at that index.",
    },

    constraints: [
      "2 <= nums.length <= 10⁵",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix fits in a 32-bit integer.",
    ],

    testCases: [
      {
        input:
          "nums = [1, 2, 3, 4]",
        output:
          "[24,12,8,6]",
        isHidden: false,
      },
      {
        input:
          "nums = [-1, 1, 0, -3, 3]",
        output:
          "[0,0,9,0,0]",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(nums) {
  // Write your solution here

  return [];
}`,

      Python: `def solution(nums):
    # Write your solution here

    return []`,

      Java: `class Solution {
    public int[] solution(int[] nums) {
        // Write your solution here

        return new int[]{};
    }
}`,

      "C++": `class Solution {
public:
    vector<int> solution(vector<int>& nums) {
        // Write your solution here

        return {};
    }
};`,
    },

    runner: "productExceptSelf",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 9. Number of Islands
  // ===================================================

  {
    problemId: 9,
    title: "Number of Islands",
    difficulty: "Medium",

    description:
      "Count the number of islands in a 2D grid containing land and water.",

    topics: ["Graph"],

    example: {
      input:
        'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',

      output: "3",

      explanation:
        "There are three separate groups of connected land cells.",
    },

    constraints: [
      "1 <= m, n <= 300",
      "grid[i][j] is either '0' or '1'.",
    ],

    testCases: [
      {
        input:
          'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        isHidden: false,
      },
      {
        input:
          'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]',
        output: "1",
        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(grid) {
  // Write your solution here

  return 0;
}`,

      Python: `def solution(grid):
    # Write your solution here

    return 0`,

      Java: `class Solution {
    public int solution(char[][] grid) {
        // Write your solution here

        return 0;
    }
}`,

      "C++": `class Solution {
public:
    int solution(vector<vector<char>>& grid) {
        // Write your solution here

        return 0;
    }
};`,
    },

    runner: "numberOfIslands",
    functionName: "solution",
    isActive: true,
  },

  // ===================================================
  // 10. Binary Tree Level Order Traversal
  // ===================================================

  {
    problemId: 10,
    title:
      "Binary Tree Level Order Traversal",

    difficulty: "Medium",

    description:
      "Return the level order traversal of a binary tree.",

    topics: ["Tree"],

    example: {
      input:
        "root = [3,9,20,null,null,15,7]",

      output:
        "[[3],[9,20],[15,7]]",

      explanation:
        "Nodes are returned level by level from top to bottom.",
    },

    constraints: [
      "The number of nodes is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],

    testCases: [
      {
        input:
          "root = [3,9,20,null,null,15,7]",

        output:
          "[[3],[9,20],[15,7]]",

        isHidden: false,
      },
      {
        input:
          "root = [1]",

        output:
          "[[1]]",

        isHidden: false,
      },
      {
        input:
          "root = []",

        output: "[]",

        isHidden: true,
      },
    ],

    starterCode: {
      JavaScript: `function solution(root) {
  // Write your solution here

  return [];
}`,

      Python: `def solution(root):
    # Write your solution here

    return []`,

      Java: `class Solution {
    public List<List<Integer>> solution(Integer[] root) {
        // Write your solution here

        return new ArrayList<>();
    }
}`,

      "C++": `class Solution {
public:
    vector<vector<int>> solution(vector<int>& root) {
        // Write your solution here

        return {};
    }
};`,
    },

    runner: "binaryTreeLevelOrder",
    functionName: "solution",
    isActive: true,
  },
];

// =====================================================
// Seed Function
// =====================================================

const seedDsaProblems = async () => {
  try {
    console.log("========================================");
    console.log("🌱 PrepNova DSA Seed Started");
    console.log("========================================");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected");

    // Clear existing DSA problems
    await DSAProblem.deleteMany({});

    console.log("🗑️ Existing DSA problems cleared");

    // Insert new problems
    const inserted =
      await DSAProblem.insertMany(
        dsaProblems
      );

    console.log(
      `✅ ${inserted.length} DSA problems inserted`
    );

    console.log("========================================");
    console.log("🎉 DSA Seed Completed Successfully");
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ DSA Seed Error:",
      error
    );

    process.exit(1);
  }
};

// =====================================================
// Run Seed
// =====================================================

seedDsaProblems();