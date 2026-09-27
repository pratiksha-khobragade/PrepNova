// =====================================================
// PrepNova - DSA Code Execution Service
// =====================================================

const axios = require("axios");

// =====================================================
// Judge0 Configuration
// =====================================================

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://ce.judge0.com";

// =====================================================
// Judge0 Language IDs
// =====================================================

const LANGUAGE_IDS = {
  JavaScript: 63,
  Python: 71,
  Java: 62,
  "C++": 54,
};

// =====================================================
// Normalize Output
// =====================================================

const normalizeOutput = (output) => {
  if (output === null || output === undefined) {
    return "";
  }

  return String(output)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
};

// =====================================================
// Deep JSON Equality
// =====================================================

const deepEqual = (first, second) => {
  if (first === second) {
    return true;
  }

  if (first === null || second === null) {
    return false;
  }

  if (typeof first !== typeof second) {
    return false;
  }

  if (
    Array.isArray(first) ||
    Array.isArray(second)
  ) {
    if (
      !Array.isArray(first) ||
      !Array.isArray(second)
    ) {
      return false;
    }

    if (first.length !== second.length) {
      return false;
    }

    for (let i = 0; i < first.length; i++) {
      if (!deepEqual(first[i], second[i])) {
        return false;
      }
    }

    return true;
  }

  if (
    typeof first === "object" &&
    typeof second === "object"
  ) {
    const firstKeys = Object.keys(first);
    const secondKeys = Object.keys(second);

    if (firstKeys.length !== secondKeys.length) {
      return false;
    }

    for (const key of firstKeys) {
      if (
        !Object.prototype.hasOwnProperty.call(
          second,
          key
        )
      ) {
        return false;
      }

      if (!deepEqual(first[key], second[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
};

// =====================================================
// Compare Outputs
// =====================================================

const outputsMatch = (actual, expected) => {
  const normalizedActual =
    normalizeOutput(actual);

  const normalizedExpected =
    normalizeOutput(expected);

  // Direct comparison
  if (
    normalizedActual ===
    normalizedExpected
  ) {
    return true;
  }

  // JSON comparison
  try {
    const actualJson =
      JSON.parse(normalizedActual);

    const expectedJson =
      JSON.parse(normalizedExpected);

    return deepEqual(
      actualJson,
      expectedJson
    );
  } catch {
    return false;
  }
};

// =====================================================
// Submit Code To Judge0
// =====================================================

const submitToJudge0 = async ({
  language,
  code,
  input = "",
}) => {
  const languageId =
    LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(
      `Unsupported language: ${language}`
    );
  }

  if (!code || !code.trim()) {
    throw new Error(
      "Executable code is empty."
    );
  }

  console.log(
    `[Judge0] Executing ${language} using language ID ${languageId}`
  );

  try {
    const response = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageId,
        stdin: input || "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    console.log(
      "[Judge0] Status:",
      response.data?.status
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Judge0] Request Error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to execute code."
    );
  }
};

// =====================================================
// Normalize Judge0 Result
// =====================================================

const normalizeResult = (result) => {
  const statusId =
    result?.status?.id;

  const statusDescription =
    result?.status?.description || "";

  // ---------------------------------------------------
  // Accepted
  // ---------------------------------------------------

  if (statusId === 3) {
    return {
      status: "executed",
      output:
        result.stdout || "",
      errorMessage:
        result.stderr || "",
      runtime:
        result.time || null,
      memory:
        result.memory || null,
    };
  }

  // ---------------------------------------------------
  // Compilation Error
  // ---------------------------------------------------

  if (statusId === 6) {
    return {
      status: "compilation_error",
      output:
        result.stdout || "",
      errorMessage:
        result.compile_output ||
        result.stderr ||
        "Compilation error.",
      runtime:
        result.time || null,
      memory:
        result.memory || null,
    };
  }

  // ---------------------------------------------------
  // Runtime Error
  // ---------------------------------------------------

  if (
    statusId === 7 ||
    statusId === 8 ||
    statusId === 9 ||
    statusId === 10 ||
    statusId === 11
  ) {
    return {
      status: "runtime_error",
      output:
        result.stdout || "",
      errorMessage:
        result.stderr ||
        result.message ||
        statusDescription ||
        "Runtime error.",
      runtime:
        result.time || null,
      memory:
        result.memory || null,
    };
  }

  // ---------------------------------------------------
  // Time Limit
  // ---------------------------------------------------

  if (statusId === 5) {
    return {
      status: "time_limit",
      output:
        result.stdout || "",
      errorMessage:
        "Time limit exceeded.",
      runtime:
        result.time || null,
      memory:
        result.memory || null,
    };
  }

  // ---------------------------------------------------
  // Memory Limit
  // ---------------------------------------------------

  if (statusId === 4) {
    return {
      status: "memory_limit",
      output:
        result.stdout || "",
      errorMessage:
        "Memory limit exceeded.",
      runtime:
        result.time || null,
      memory:
        result.memory || null,
    };
  }

  // ---------------------------------------------------
  // Other Error
  // ---------------------------------------------------

  return {
    status: "error",
    output:
      result.stdout || "",
    errorMessage:
      result.stderr ||
      result.compile_output ||
      result.message ||
      statusDescription ||
      "Code execution failed.",
    runtime:
      result.time || null,
    memory:
      result.memory || null,
  };
};

// =====================================================
// Execute Code Against Test Cases
// =====================================================

const executeCode = async ({
  language,
  code,
  testCases = [],
}) => {
  const results = [];

  let passedTestCases = 0;

  const totalTestCases =
    testCases.length;

  if (totalTestCases === 0) {
    return {
      status: "error",
      passedTestCases: 0,
      totalTestCases: 0,
      runtime: null,
      memory: null,
      output: "",
      expected: "",
      errorMessage:
        "No test cases were provided.",
      results: [],
    };
  }

  // ===================================================
  // Execute each test case
  // ===================================================

  for (
    let index = 0;
    index < testCases.length;
    index++
  ) {
    const testCase =
      testCases[index];

    const executableCode =
      testCase.executableCode ||
      code;

    console.log(
      `\n[DSA] ${language} Test Case ${
        index + 1
      }/${totalTestCases}`
    );

    console.log(
      "[DSA] Input:",
      testCase.input
    );

    try {
      const judgeResult =
        await submitToJudge0({
          language,
          code: executableCode,
          input: "",
        });

      // ------------------------------------------------
      // IMPORTANT DEBUG LOG
      // ------------------------------------------------

      console.log(
        "[DSA] Judge0 Raw Result:",
        JSON.stringify(
          judgeResult,
          null,
          2
        )
      );

      const normalized =
        normalizeResult(
          judgeResult
        );

      console.log(
        "[DSA] Normalized Result:",
        normalized
      );

      // =================================================
      // Execution Error
      // =================================================

      if (
        normalized.status !==
        "executed"
      ) {
        results.push({
          testCase: index + 1,
          input:
            testCase.input || "",
          expected:
            testCase.output || "",
          output:
            normalized.output || "",
          status:
            normalized.status,
          errorMessage:
            normalized.errorMessage,
          runtime:
            normalized.runtime,
          memory:
            normalized.memory,
          passed: false,
        });

        console.error(
          `[DSA] Test Case ${
            index + 1
          } failed during execution.`
        );

        console.error(
          "[DSA] Error:",
          normalized.errorMessage
        );

        console.error(
          "[DSA] Generated Code:\n",
          executableCode
        );

        return {
          status:
            normalized.status,
          passedTestCases,
          totalTestCases,
          runtime:
            normalized.runtime,
          memory:
            normalized.memory,
          output:
            normalized.output || "",
          expected:
            testCase.output || "",
          errorMessage:
            normalized.errorMessage,
          results,
        };
      }

      // =================================================
      // Compare Output
      // =================================================

      const actualOutput =
        normalizeOutput(
          normalized.output
        );

      const expectedOutput =
        normalizeOutput(
          testCase.output
        );

      const passed =
        outputsMatch(
          actualOutput,
          expectedOutput
        );

      console.log(
        "[DSA] Actual:",
        actualOutput
      );

      console.log(
        "[DSA] Expected:",
        expectedOutput
      );

      console.log(
        "[DSA] Passed:",
        passed
      );

      // =================================================
      // Store Result
      // =================================================

      results.push({
        testCase: index + 1,
        input:
          testCase.input || "",
        expected:
          expectedOutput,
        output:
          actualOutput,
        status:
          passed
            ? "passed"
            : "wrong_answer",
        runtime:
          normalized.runtime,
        memory:
          normalized.memory,
        passed,
      });

      // =================================================
      // Wrong Answer
      // =================================================

      if (!passed) {
        console.error(
          `[DSA] Wrong Answer on Test Case ${
            index + 1
          }`
        );

        return {
          status: "wrong_answer",
          passedTestCases,
          totalTestCases,
          runtime:
            normalized.runtime,
          memory:
            normalized.memory,
          output:
            actualOutput,
          expected:
            expectedOutput,
          errorMessage:
            "Output does not match the expected result.",
          results,
        };
      }

      passedTestCases++;
    } catch (error) {
      console.error(
        `[DSA] Unexpected error on Test Case ${
          index + 1
        }:`,
        error
      );

      results.push({
        testCase: index + 1,
        input:
          testCase.input || "",
        expected:
          testCase.output || "",
        output: "",
        status: "error",
        errorMessage:
          error.message,
        passed: false,
      });

      return {
        status: "error",
        passedTestCases,
        totalTestCases,
        runtime: null,
        memory: null,
        output: "",
        expected:
          testCase.output || "",
        errorMessage:
          error.message,
        results,
      };
    }
  }

  // ===================================================
  // All Test Cases Passed
  // ===================================================

  const lastResult =
    results[results.length - 1];

  return {
    status: "accepted",

    passedTestCases,

    totalTestCases,

    runtime:
      lastResult?.runtime || null,

    memory:
      lastResult?.memory || null,

    output:
      lastResult?.output || "",

    expected:
      lastResult?.expected || "",

    errorMessage: "",

    results,
  };
};

// =====================================================
// Export
// =====================================================

module.exports = {
  LANGUAGE_IDS,
  submitToJudge0,
  normalizeResult,
  normalizeOutput,
  outputsMatch,
  executeCode,
};