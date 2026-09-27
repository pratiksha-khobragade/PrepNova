// =====================================================
// PrepNova - DSA Code Runner
// =====================================================

const buildExecutableCode = ({
  language,
  userCode,
  testCase,
  runner,
  functionName = "solution",
}) => {
  if (!userCode || !userCode.trim()) {
    throw new Error("Code cannot be empty.");
  }

  const input = String(testCase?.input || "");
  const safeFunctionName = functionName || "solution";

  // ===================================================
  // JAVASCRIPT
  // ===================================================

  if (language === "JavaScript") {
    return buildJavaScriptRunner({
      userCode,
      input,
      runner,
      functionName: safeFunctionName,
    });
  }

  // ===================================================
  // PYTHON
  // ===================================================

  if (language === "Python") {
    return buildPythonRunner({
      userCode,
      input,
      runner,
      functionName: safeFunctionName,
    });
  }

  // ===================================================
  // JAVA
  // ===================================================

  if (language === "Java") {
    return buildJavaRunner({
      userCode,
      input,
      runner,
    });
  }

  // ===================================================
  // C++
  // ===================================================

  if (language === "C++") {
    return buildCppRunner({
      userCode,
      input,
      runner,
    });
  }

  throw new Error(`Unsupported language: ${language}`);
};

// =====================================================
// JavaScript Runner
// =====================================================

const buildJavaScriptRunner = ({
  userCode,
  input,
  runner,
  functionName,
}) => {
  const inputLiteral = JSON.stringify(input);

  const parser = `
const __input = ${inputLiteral};

function __parseInput(value) {

  if ("${runner}" === "twoSum") {
    const numsMatch = value.match(
      /nums\\s*=\\s*(\\[[^\\]]*\\])/
    );

    const targetMatch = value.match(
      /target\\s*=\\s*(-?\\d+)/
    );

    if (!numsMatch || !targetMatch) {
      throw new Error(
        "Unable to parse Two Sum input: " + value
      );
    }

    return {
      nums: JSON.parse(numsMatch[1]),
      target: Number(targetMatch[1]),
    };
  }

  if ("${runner}" === "validParentheses") {
    const match = value.match(
      /s\\s*=\\s*"([^"]*)"/
    );

    return {
      s: match ? match[1] : "",
    };
  }

  if ("${runner}" === "bestTimeToBuyAndSellStock") {
    const match = value.match(
      /prices\\s*=\\s*(\\[[^\\]]*\\])/
    );

    return {
      prices: match ? JSON.parse(match[1]) : [],
    };
  }

  if ("${runner}" === "binarySearch") {
    const numsMatch = value.match(
      /nums\\s*=\\s*(\\[[^\\]]*\\])/
    );

    const targetMatch = value.match(
      /target\\s*=\\s*(-?\\d+)/
    );

    return {
      nums: numsMatch ? JSON.parse(numsMatch[1]) : [],
      target: targetMatch
        ? Number(targetMatch[1])
        : 0,
    };
  }

  if ("${runner}" === "reverseLinkedList") {
    const match = value.match(
      /head\\s*=\\s*(\\[[^\\]]*\\])/
    );

    return {
      head: match ? JSON.parse(match[1]) : [],
    };
  }

  if ("${runner}" === "longestSubstring") {
    const match = value.match(
      /s\\s*=\\s*"([^"]*)"/
    );

    return {
      s: match ? match[1] : "",
    };
  }

  if ("${runner}" === "threeSum") {
    const match = value.match(
      /nums\\s*=\\s*(\\[[^\\]]*\\])/
    );

    return {
      nums: match ? JSON.parse(match[1]) : [],
    };
  }

  if ("${runner}" === "productExceptSelf") {
    const match = value.match(
      /nums\\s*=\\s*(\\[[^\\]]*\\])/
    );

    return {
      nums: match ? JSON.parse(match[1]) : [],
    };
  }

  if ("${runner}" === "numberOfIslands") {
    const match = value.match(
      /grid\\s*=\\s*(\\[.*\\])/s
    );

    return {
      grid: match ? JSON.parse(match[1]) : [],
    };
  }

  if ("${runner}" === "binaryTreeLevelOrder") {
    const match = value.match(
      /root\\s*=\\s*(\\[.*\\])/s
    );

    return {
      root: match ? JSON.parse(match[1]) : [],
    };
  }

  return {};
}

const __parsed = __parseInput(__input);
`;

  const invocation = getJavaScriptInvocation(
    runner,
    functionName
  );

  return `
${userCode}

${parser}

const __result = ${invocation};

console.log(
  JSON.stringify(__result)
);
`;
};

// =====================================================
// JavaScript Function Calls
// =====================================================

const getJavaScriptInvocation = (
  runner,
  functionName
) => {
  switch (runner) {
    case "twoSum":
      return `${functionName}(
  __parsed.nums,
  __parsed.target
)`;

    case "validParentheses":
      return `${functionName}(
  __parsed.s
)`;

    case "bestTimeToBuyAndSellStock":
      return `${functionName}(
  __parsed.prices
)`;

    case "binarySearch":
      return `${functionName}(
  __parsed.nums,
  __parsed.target
)`;

    case "reverseLinkedList":
      return `${functionName}(
  __parsed.head
)`;

    case "longestSubstring":
      return `${functionName}(
  __parsed.s
)`;

    case "threeSum":
      return `${functionName}(
  __parsed.nums
)`;

    case "productExceptSelf":
      return `${functionName}(
  __parsed.nums
)`;

    case "numberOfIslands":
      return `${functionName}(
  __parsed.grid
)`;

    case "binaryTreeLevelOrder":
      return `${functionName}(
  __parsed.root
)`;

    default:
      return `${functionName}(
  __parsed
)`;
  }
};

// =====================================================
// Python Helpers
// =====================================================

const normalizePythonCode = (code) => {
  let normalized = String(code)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, "    ");

  const lines = normalized.split("\n");

  const defIndex = lines.findIndex((line) =>
    /^\s*def\s+solution\s*\(/.test(line)
  );

  if (defIndex === -1) {
    return normalized;
  }

  // ---------------------------------------------------
  // Make sure the function declaration is top-level.
  // ---------------------------------------------------

  lines[defIndex] =
    lines[defIndex].trimStart();

  // ---------------------------------------------------
  // If the body accidentally lost indentation,
  // automatically indent it.
  //
  // Example:
  //
  // def solution(nums, target):
  // seen = {}
  //
  // becomes:
  //
  // def solution(nums, target):
  //     seen = {}
  // ---------------------------------------------------

  let bodyStarted = false;

  for (
    let i = defIndex + 1;
    i < lines.length;
    i++
  ) {
    const original = lines[i];

    if (original.trim() === "") {
      lines[i] = "";
      continue;
    }

    // Another top-level definition/class means
    // the function body has ended.
    if (
      /^(def|class)\s+/.test(original.trim())
    ) {
      break;
    }

    if (!bodyStarted) {
      bodyStarted = true;
    }

    const trimmed = original.trim();

    // Already indented correctly.
    if (/^\s+/.test(original)) {
      continue;
    }

    // Common Python statements that belong
    // inside the solution function.
    lines[i] = `    ${trimmed}`;
  }

  normalized = lines.join("\n");

  return normalized.trim();
};

// =====================================================
// Python Runner
// =====================================================

const buildPythonRunner = ({
  userCode,
  input,
  runner,
  functionName,
}) => {
  const inputLiteral = JSON.stringify(input);

  const normalizedUserCode =
    normalizePythonCode(userCode);

  let parser = "";

  switch (runner) {
    // ================================================
    // Two Sum
    // ================================================

    case "twoSum":
      parser = `
__nums_match = re.search(
    r"nums\\s*=\\s*(\\[[^\\]]*\\])",
    __input
)

__target_match = re.search(
    r"target\\s*=\\s*(-?\\d+)",
    __input
)

if not __nums_match:
    raise ValueError(
        "Unable to parse nums from input: "
        + __input
    )

if not __target_match:
    raise ValueError(
        "Unable to parse target from input: "
        + __input
    )

__nums = json.loads(
    __nums_match.group(1)
)

__target = int(
    __target_match.group(1)
)
`;
      break;

    // ================================================
    // Valid Parentheses
    // Longest Substring
    // ================================================

    case "validParentheses":
    case "longestSubstring":
      parser = `
__match = re.search(
    r's\\s*=\\s*"([^"]*)"',
    __input
)

if not __match:
    raise ValueError(
        "Unable to parse string input: "
        + __input
    )

__s = __match.group(1)
`;
      break;

    // ================================================
    // Best Time To Buy And Sell Stock
    // ================================================

    case "bestTimeToBuyAndSellStock":
      parser = `
__match = re.search(
    r"prices\\s*=\\s*(\\[[^\\]]*\\])",
    __input
)

if not __match:
    raise ValueError(
        "Unable to parse prices from input: "
        + __input
    )

__nums = json.loads(
    __match.group(1)
)
`;
      break;

    // ================================================
    // Binary Search
    // ================================================

    case "binarySearch":
      parser = `
__nums_match = re.search(
    r"nums\\s*=\\s*(\\[[^\\]]*\\])",
    __input
)

__target_match = re.search(
    r"target\\s*=\\s*(-?\\d+)",
    __input
)

if not __nums_match:
    raise ValueError(
        "Unable to parse nums from input: "
        + __input
    )

if not __target_match:
    raise ValueError(
        "Unable to parse target from input: "
        + __input
    )

__nums = json.loads(
    __nums_match.group(1)
)

__target = int(
    __target_match.group(1)
)
`;
      break;

    // ================================================
    // Reverse Linked List
    // ================================================

    case "reverseLinkedList":
      parser = `
__match = re.search(
    r"head\\s*=\\s*(\\[[^\\]]*\\])",
    __input
)

if not __match:
    raise ValueError(
        "Unable to parse head from input: "
        + __input
    )

__nums = json.loads(
    __match.group(1)
)
`;
      break;

    // ================================================
    // 3Sum
    // Product Except Self
    // ================================================

    case "threeSum":
    case "productExceptSelf":
      parser = `
__match = re.search(
    r"nums\\s*=\\s*(\\[[^\\]]*\\])",
    __input
)

if not __match:
    raise ValueError(
        "Unable to parse nums from input: "
        + __input
    )

__nums = json.loads(
    __match.group(1)
)
`;
      break;

    // ================================================
    // Number Of Islands
    // Binary Tree Level Order
    // ================================================

    case "numberOfIslands":
    case "binaryTreeLevelOrder":
      parser = `
__match = re.search(
    r"\\w+\\s*=\\s*(\\[.*\\])",
    __input,
    re.DOTALL
)

if not __match:
    raise ValueError(
        "Unable to parse input: "
        + __input
    )

__data = json.loads(
    __match.group(1)
)
`;
      break;

    default:
      parser = `
__data = __input
`;
  }

  const invocation =
    getPythonInvocation(
      runner,
      functionName
    );

  // ===================================================
  // IMPORTANT:
  //
  // The generated Python must contain:
  //
  // __result = solution(
  //     __nums,
  //     __target
  // )
  //
  // and NOT:
  //
  // __result =
  // solution(...)
  //
  // ===================================================

  return `import json
import re

__input = ${inputLiteral}

${normalizedUserCode}

${parser}

__result = ${invocation}

print(json.dumps(__result))
`;
};

// =====================================================
// Python Function Calls
// =====================================================

const getPythonInvocation = (
  runner,
  functionName
) => {
  switch (runner) {
    case "twoSum":
      return `${functionName}(
    __nums,
    __target
)`;

    case "validParentheses":
    case "longestSubstring":
      return `${functionName}(
    __s
)`;

    case "bestTimeToBuyAndSellStock":
    case "threeSum":
    case "productExceptSelf":
      return `${functionName}(
    __nums
)`;

    case "binarySearch":
      return `${functionName}(
    __nums,
    __target
)`;

    case "reverseLinkedList":
      return `${functionName}(
    __nums
)`;

    case "numberOfIslands":
    case "binaryTreeLevelOrder":
      return `${functionName}(
    __data
)`;

    default:
      return `${functionName}(
    __data
)`;
  }
};

// =====================================================
// Java Runner
// =====================================================

const buildJavaRunner = ({
  userCode,
  input,
  runner,
}) => {
  const safeInput = String(input)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  let invocation = "";

  switch (runner) {
    case "twoSum":
      invocation = `
        String input =
            "${safeInput}";

        String[] parts =
            input.split(
                "target\\\\s*=\\\\s*"
            );

        String numsPart =
            parts[0]
                .replace(
                    "nums =",
                    ""
                )
                .trim();

        int target =
            Integer.parseInt(
                parts[1].trim()
            );

        numsPart =
            numsPart
                .replace("[", "")
                .replace("]", "")
                .trim();

        String[] values =
            numsPart.split(",");

        int[] nums =
            new int[values.length];

        for (
            int i = 0;
            i < values.length;
            i++
        ) {
            nums[i] =
                Integer.parseInt(
                    values[i].trim()
                );
        }

        int[] result =
            solution.solution(
                nums,
                target
            );

        System.out.println(
            Arrays.toString(result)
        );
      `;
      break;

    case "validParentheses":
    case "longestSubstring":
      invocation = `
        String input =
            "${safeInput}";

        String value =
            input.substring(
                input.indexOf("=") + 1
            ).trim();

        value =
            value.replace(
                "\\\"",
                ""
            );

        ${
          runner === "validParentheses"
            ? `
        boolean result =
            solution.solution(value);

        System.out.println(result);
        `
            : `
        int result =
            solution.solution(value);

        System.out.println(result);
        `
        }
      `;
      break;

    case "bestTimeToBuyAndSellStock":
    case "productExceptSelf":
      invocation = `
        String input =
            "${safeInput}";

        String arrayPart =
            input.substring(
                input.indexOf("=") + 1
            )
            .trim()
            .replace("[", "")
            .replace("]", "");

        String[] values =
            arrayPart.split(",");

        int[] nums =
            new int[values.length];

        for (
            int i = 0;
            i < values.length;
            i++
        ) {
            nums[i] =
                Integer.parseInt(
                    values[i].trim()
                );
        }

        ${
          runner === "bestTimeToBuyAndSellStock"
            ? `
        int result =
            solution.solution(nums);

        System.out.println(result);
        `
            : `
        int[] result =
            solution.solution(nums);

        System.out.println(
            Arrays.toString(result)
        );
        `
        }
      `;
      break;

    case "binarySearch":
      invocation = `
        String input =
            "${safeInput}";

        String[] parts =
            input.split(
                "target\\\\s*=\\\\s*"
            );

        String numsPart =
            parts[0]
                .replace(
                    "nums =",
                    ""
                )
                .trim()
                .replace("[", "")
                .replace("]", "");

        int target =
            Integer.parseInt(
                parts[1].trim()
            );

        String[] values =
            numsPart.split(",");

        int[] nums =
            new int[values.length];

        for (
            int i = 0;
            i < values.length;
            i++
        ) {
            nums[i] =
                Integer.parseInt(
                    values[i].trim()
                );
        }

        int result =
            solution.solution(
                nums,
                target
            );

        System.out.println(result);
      `;
      break;

    default:
      invocation = `
        System.out.println(
            "This Java problem runner is not implemented yet."
        );
      `;
  }

  return `
import java.util.*;

${userCode}

public class Main {

    public static void main(
        String[] args
    ) {

        Solution solution =
            new Solution();

        ${invocation}
    }
}
`;
};

// =====================================================
// C++ Runner
// =====================================================

const buildCppRunner = ({
  userCode,
  input,
  runner,
}) => {
  const safeInput = String(input)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

  let invocation = "";

  switch (runner) {
    case "twoSum":
      invocation = `
    string input =
        "${safeInput}";

    size_t targetPos =
        input.find("target =");

    string numsPart =
        input.substr(
            0,
            targetPos
        );

    numsPart =
        numsPart.substr(
            numsPart.find("[") + 1
        );

    numsPart =
        numsPart.substr(
            0,
            numsPart.find("]")
        );

    string targetPart =
        input.substr(
            targetPos + 9
        );

    int target =
        stoi(targetPart);

    vector<int> nums;

    stringstream ss(numsPart);
    string value;

    while (
        getline(
            ss,
            value,
            ','
        )
    ) {
        nums.push_back(
            stoi(value)
        );
    }

    vector<int> result =
        solution.solution(
            nums,
            target
        );

    cout << "[";

    for (
        size_t i = 0;
        i < result.size();
        i++
    ) {
        if (i > 0)
            cout << ",";

        cout << result[i];
    }

    cout << "]";
`;
      break;

    case "validParentheses":
    case "longestSubstring":
      invocation = `
    string input =
        "${safeInput}";

    string value =
        input.substr(
            input.find("=") + 1
        );

    value.erase(
        remove(
            value.begin(),
            value.end(),
            '"'
        ),
        value.end()
    );

    ${
      runner === "validParentheses"
        ? `
    bool result =
        solution.solution(value);

    cout <<
        (result
            ? "true"
            : "false");
`
        : `
    int result =
        solution.solution(value);

    cout << result;
`
    }
`;
      break;

    case "bestTimeToBuyAndSellStock":
    case "productExceptSelf":
      invocation = `
    string input =
        "${safeInput}";

    size_t start =
        input.find("[") + 1;

    size_t end =
        input.find("]");

    string values =
        input.substr(
            start,
            end - start
        );

    vector<int> nums;

    stringstream ss(values);
    string value;

    while (
        getline(
            ss,
            value,
            ','
        )
    ) {
        nums.push_back(
            stoi(value)
        );
    }

    ${
      runner === "bestTimeToBuyAndSellStock"
        ? `
    int result =
        solution.solution(nums);

    cout << result;
`
        : `
    vector<int> result =
        solution.solution(nums);

    cout << "[";

    for (
        size_t i = 0;
        i < result.size();
        i++
    ) {
        if (i > 0)
            cout << ",";

        cout << result[i];
    }

    cout << "]";
`
    }
`;
      break;

    case "binarySearch":
      invocation = `
    string input =
        "${safeInput}";

    size_t targetPos =
        input.find("target =");

    string numsPart =
        input.substr(
            0,
            targetPos
        );

    numsPart =
        numsPart.substr(
            numsPart.find("[") + 1
        );

    numsPart =
        numsPart.substr(
            0,
            numsPart.find("]")
        );

    int target =
        stoi(
            input.substr(
                targetPos + 9
            )
        );

    vector<int> nums;

    stringstream ss(numsPart);
    string value;

    while (
        getline(
            ss,
            value,
            ','
        )
    ) {
        nums.push_back(
            stoi(value)
        );
    }

    int result =
        solution.solution(
            nums,
            target
        );

    cout << result;
`;
      break;

    default:
      invocation = `
    cout <<
        "This C++ problem runner is not implemented yet.";
`;
  }

  return `
#include <bits/stdc++.h>
using namespace std;

${userCode}

int main() {

    Solution solution;

${invocation}

    return 0;
}
`;
};

// =====================================================
// Export
// =====================================================

module.exports = {
  buildExecutableCode,
};