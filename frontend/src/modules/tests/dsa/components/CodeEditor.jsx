import React from "react";

import {
  faRotateLeft,
  faCode,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CodeMirror from "@uiw/react-codemirror";

import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

import { starterCode } from "./starterCode";

const languageExtensions = {
  JavaScript: javascript(),
  Java: java(),
  Python: python(),
  "C++": cpp(),
};

const CodeEditor = ({
  language = "JavaScript",
  code = "",
  onLanguageChange,
  onCodeChange,
}) => {
  const handleCodeChange = (value) => {
    if (onCodeChange) {
      onCodeChange(value);
    }
  };

  const handleReset = () => {
    const defaultCode =
      starterCode[language] ||
      starterCode.JavaScript;

    if (onCodeChange) {
      onCodeChange(defaultCode);
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;

    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <div className="code-editor-wrapper">

      {/* Editor Header */}
      <div className="code-editor-header">

        {/* Language Selector */}
        <div className="editor-language">
          <FontAwesomeIcon icon={faCode} />

          <select
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select programming language"
          >
            {Object.keys(starterCode).map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <FontAwesomeIcon
            className="language-chevron"
            icon={faChevronDown}
          />
        </div>

        {/* Reset Button */}
        <button
          type="button"
          className="reset-code-btn"
          onClick={handleReset}
        >
          <FontAwesomeIcon
            icon={faRotateLeft}
          />

          Reset
        </button>
      </div>

      {/* Code Area */}
      <div className="code-editor-body">

        <div className="codemirror-container">

          <CodeMirror
            value={code}
            height="100%"
            theme="dark"

            extensions={[
              languageExtensions[language] ||
                javascript(),
            ]}

            onChange={handleCodeChange}

            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              autocompletion: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
            }}

            indentWithTab={true}
          />

        </div>

      </div>

    </div>
  );
};

export default CodeEditor;