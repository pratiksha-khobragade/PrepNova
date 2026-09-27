import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCurrentQuestion,
  submitInterviewAnswer,
  generateNextQuestion,
  finishInterview,
} from "../../api/interviewApi";

import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
  faMicrophone,
  faStop,
  faClock,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../../images/logo.png";
import femaleAiVideo from "../../../videos/female-ai.mp4";

import "./Interview.css";


const Interview = ({
  interviewId,
  onFinish,
}) => {
  // ==================================================
  // STATE
  // ==================================================

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(90);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(false);


  // ==================================================
  // REFS
  // ==================================================

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const submittingRef = useRef(false);
  const finishingRef = useRef(false);

  const answerRef = useRef("");
  const questionRef = useRef(null);

  const timeLeftRef = useRef(90);

  /*
    The timer uses this ref so it always gets
    the latest submit function.
  */
  const submitAnswerRef = useRef(null);

  /*
    Chrome speech synthesis keep-alive.
  */
  const speechKeepAliveRef = useRef(null);

  /*
    ====================================================
    SPEECH RECOGNITION REFS

    These are kept separate intentionally.

    finalTranscriptRef:
      Contains only confirmed speech.

    interimTranscriptRef:
      Contains temporary speech that Chrome is
      still processing.

    listeningRequestedRef:
      Tells us whether the user still wants the
      microphone running.

    recognitionRestartTimerRef:
      Prevents multiple recognition restarts.
  */
  const finalTranscriptRef = useRef("");
  const interimTranscriptRef = useRef("");

  const listeningRequestedRef = useRef(false);

  const recognitionRestartTimerRef =
    useRef(null);


  // ==================================================
  // KEEP ANSWER REF UPDATED
  // ==================================================

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);


  // ==================================================
  // KEEP QUESTION REF UPDATED
  // ==================================================

  useEffect(() => {
    questionRef.current = question;
  }, [question]);


  // ==================================================
  // KEEP TIMER REF UPDATED
  // ==================================================

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);


  // ==================================================
  // STOP TIMER
  // ==================================================

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);


  // ==================================================
  // STOP SPEECH KEEP ALIVE
  // ==================================================

  const stopSpeechKeepAlive =
    useCallback(() => {
      if (speechKeepAliveRef.current) {
        clearInterval(
          speechKeepAliveRef.current
        );

        speechKeepAliveRef.current = null;
      }
    }, []);


  // ==================================================
  // STOP AI VIDEO
  // ==================================================

  const stopVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsSpeaking(false);
  }, []);


  // ==================================================
  // STOP AI SPEECH
  // ==================================================

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    stopSpeechKeepAlive();
    stopVideo();
  }, [
    stopSpeechKeepAlive,
    stopVideo,
  ]);


  // ==================================================
  // STOP SPEECH RECOGNITION
  // ==================================================

  const stopListening = useCallback(() => {
    /*
      Tell recognition that the user intentionally
      stopped listening.

      This is important because onend can otherwise
      automatically restart the microphone.
    */
    listeningRequestedRef.current = false;

    if (recognitionRestartTimerRef.current) {
      clearTimeout(
        recognitionRestartTimerRef.current
      );

      recognitionRestartTimerRef.current =
        null;
    }

    try {
      recognitionRef.current?.stop();
    } catch (error) {
      // Recognition may already be stopped.
    }

    setIsListening(false);
  }, []);


  // ==================================================
  // SPEAK QUESTION
  // ==================================================

  const speakQuestion = useCallback(
    (text) => {
      if (!text) {
        return;
      }

      if (!window.speechSynthesis) {
        setIsSpeaking(false);
        return;
      }

      // Stop previous speech.
      window.speechSynthesis.cancel();

      stopSpeechKeepAlive();
      stopVideo();

      const speakNow = () => {
        const utterance =
          new SpeechSynthesisUtterance(text);

        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voices =
          window.speechSynthesis.getVoices();

        const preferredVoice =
          voices.find((voice) =>
            voice.name
              .toLowerCase()
              .includes("female")
          ) ||
          voices.find((voice) =>
            voice.name
              .toLowerCase()
              .includes("zira")
          ) ||
          voices.find((voice) =>
            voice.name
              .toLowerCase()
              .includes("samantha")
          ) ||
          voices.find((voice) =>
            voice.lang
              .toLowerCase()
              .startsWith("en")
          );

        if (preferredVoice) {
          utterance.voice =
            preferredVoice;
        }


        // --------------------------------------------
        // SPEECH START
        // --------------------------------------------

        utterance.onstart = () => {
          setIsSpeaking(true);

          if (videoRef.current) {
            videoRef.current.currentTime = 0;

            videoRef.current
              .play()
              .catch((playError) => {
                console.log(
                  "Video play prevented:",
                  playError
                );
              });
          }

          stopSpeechKeepAlive();

          speechKeepAliveRef.current =
            setInterval(() => {
              if (
                window.speechSynthesis
                  .speaking
              ) {
                window.speechSynthesis.resume();
              }
            }, 4000);
        };


        // --------------------------------------------
        // SPEECH END
        // --------------------------------------------

        utterance.onend = () => {
          setIsSpeaking(false);

          stopSpeechKeepAlive();

          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        };


        // --------------------------------------------
        // SPEECH ERROR
        // --------------------------------------------

        utterance.onerror = () => {
          setIsSpeaking(false);

          stopSpeechKeepAlive();

          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        };


        window.speechSynthesis.speak(
          utterance
        );
      };


      const existingVoices =
        window.speechSynthesis.getVoices();

      if (existingVoices.length > 0) {
        speakNow();
      } else {
        const handleVoicesChanged = () => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          speakNow();
        };

        window.speechSynthesis.addEventListener(
          "voiceschanged",
          handleVoicesChanged
        );

        setTimeout(() => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          speakNow();
        }, 1000);
      }
    },
    [
      stopSpeechKeepAlive,
      stopVideo,
    ]
  );


  // ==================================================
  // START TIMER
  // ==================================================

  const startTimer = useCallback(
    (seconds = 90) => {
      stopTimer();

      const safeSeconds =
        Number(seconds) > 0
          ? Number(seconds)
          : 90;

      timeLeftRef.current =
        safeSeconds;

      setTimeLeft(
        safeSeconds
      );

      timerRef.current =
        setInterval(() => {
          setTimeLeft(
            (previous) => {
              if (previous <= 1) {
                clearInterval(
                  timerRef.current
                );

                timerRef.current =
                  null;

                timeLeftRef.current = 0;

                /*
                  IMPORTANT:
                  Always use the latest submit
                  function through the ref.
                */
                if (
                  !submittingRef.current &&
                  !finishingRef.current
                ) {
                  submitAnswerRef.current?.(
                    true
                  );
                }

                return 0;
              }

              const nextValue =
                previous - 1;

              timeLeftRef.current =
                nextValue;

              return nextValue;
            }
          );
        }, 1000);
    },
    [stopTimer]
  );


  // ==================================================
  // LOAD CURRENT QUESTION
  // ==================================================

  const loadQuestion = useCallback(
    async () => {
      if (!interviewId) {
        setError(
          "Interview ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        stopSpeech();
        stopListening();
        stopTimer();

        const response =
          await getCurrentQuestion(
            interviewId
          );

        console.log(
          "Current question response:",
          response
        );

        const currentQuestion =
          response?.interview?.question ||
          response?.data?.interview?.question ||
          response?.question ||
          response?.data?.question;

        if (!currentQuestion) {
          throw new Error(
            "Question could not be loaded."
          );
        }

        questionRef.current =
          currentQuestion;

        setQuestion(
          currentQuestion
        );

        const existingAnswer =
          currentQuestion.answer ||
          "";

        answerRef.current =
          existingAnswer;

        setAnswer(
          existingAnswer
        );

        const questionTime =
          Number(
            currentQuestion.timeLimit ||
              90
          );

        timeLeftRef.current =
          questionTime;

        setTimeLeft(
          questionTime
        );

        startTimer(
          questionTime
        );

        /*
          Reset speech transcript state
          whenever a new question starts.
        */
        finalTranscriptRef.current =
          existingAnswer;

        interimTranscriptRef.current =
          "";

        setTimeout(() => {
          speakQuestion(
            currentQuestion.question
          );
        }, 500);
      } catch (error) {
        console.error(
          "Load question error:",
          error
        );

        setError(
          error?.message ||
            "Unable to load the interview question."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      interviewId,
      speakQuestion,
      startTimer,
      stopListening,
      stopSpeech,
      stopTimer,
    ]
  );


  // ==================================================
  // SUBMIT ANSWER
  // ==================================================

  const handleSubmitAnswer =
    useCallback(
      async (isTimeout = false) => {
        if (
          submittingRef.current ||
          finishingRef.current
        ) {
          return;
        }

        const currentQuestion =
          questionRef.current;

        if (!currentQuestion) {
          console.error(
            "Submit attempted but current question is missing."
          );

          setError(
            "The current question could not be found. Please try again."
          );

          return;
        }

        const questionId =
          currentQuestion.id ||
          currentQuestion._id;

        if (!questionId) {
          console.error(
            "Question ID missing:",
            currentQuestion
          );

          setError(
            "The current question ID is missing."
          );

          return;
        }

        const finalAnswer =
          answerRef.current.trim();

        if (
          !finalAnswer &&
          !isTimeout
        ) {
          setError(
            "Please answer the question first."
          );

          return;
        }

        try {
          submittingRef.current =
            true;

          setSubmitting(true);
          setError("");

          stopTimer();
          stopSpeech();
          stopListening();

          const timeTaken =
            Math.max(
              0,
              90 - timeLeftRef.current
            );

          const response =
            await submitInterviewAnswer({
              interviewId,
              answer: finalAnswer,
              timeTaken,
            });

          console.log(
            "Answer submitted:",
            response
          );


          // ------------------------------------------
          // GENERATE NEXT QUESTION
          // ------------------------------------------

          const nextResponse =
            await generateNextQuestion(
              interviewId
            );

          console.log(
            "Next question response:",
            nextResponse
          );


          // ------------------------------------------
          // CHECK COMPLETION
          // ------------------------------------------

          const interviewCompleted =
            nextResponse?.interviewCompleted ===
              true ||
            nextResponse?.completed ===
              true ||
            nextResponse?.isComplete ===
              true ||
            nextResponse?.status ===
              "completed";


          // ------------------------------------------
          // INTERVIEW COMPLETED
          // ------------------------------------------

          if (interviewCompleted) {
            let report =
              nextResponse?.report ||
              nextResponse?.data?.report ||
              nextResponse?.data ||
              null;

            if (!report) {
              const finishResponse =
                await finishInterview(
                  interviewId
                );

              report =
                finishResponse?.report ||
                finishResponse?.data?.report ||
                finishResponse?.data ||
                finishResponse;
            }

            console.log(
              "Final interview report:",
              report
            );

            if (
              typeof onFinish ===
              "function"
            ) {
              onFinish(
                report,
                interviewId
              );
            } else {
              setError(
                "Interview completed, but the results screen is not connected."
              );
            }

            return;
          }


          // ------------------------------------------
          // GET NEXT QUESTION
          // ------------------------------------------

          const nextQuestion =
            nextResponse?.question ||
            nextResponse?.interview?.question ||
            nextResponse?.data?.question ||
            nextResponse?.data
              ?.interview?.question;


          if (nextQuestion) {
            questionRef.current =
              nextQuestion;

            setQuestion(
              nextQuestion
            );

            const nextAnswer =
              nextQuestion.answer ||
              "";

            answerRef.current =
              nextAnswer;

            setAnswer(
              nextAnswer
            );

            /*
              Reset microphone transcript
              for the new question.
            */
            finalTranscriptRef.current =
              nextAnswer;

            interimTranscriptRef.current =
              "";

            const nextTime =
              Number(
                nextQuestion.timeLimit ||
                  90
              );

            timeLeftRef.current =
              nextTime;

            setTimeLeft(
              nextTime
            );

            startTimer(
              nextTime
            );

            setTimeout(() => {
              speakQuestion(
                nextQuestion.question
              );
            }, 500);
          } else {
            await loadQuestion();
          }
        } catch (error) {
          console.error(
            "Submit answer error:",
            error
          );

          setError(
            error?.message ||
              "Unable to submit your answer."
          );
        } finally {
          submittingRef.current =
            false;

          setSubmitting(false);
        }
      },
      [
        interviewId,
        loadQuestion,
        onFinish,
        speakQuestion,
        startTimer,
        stopListening,
        stopSpeech,
        stopTimer,
      ]
    );


  // ==================================================
  // KEEP LATEST SUBMIT FUNCTION IN REF
  // ==================================================

  useEffect(() => {
    submitAnswerRef.current =
      handleSubmitAnswer;
  }, [handleSubmitAnswer]);


  // ==================================================
  // LOAD FIRST QUESTION
  // ==================================================

  useEffect(() => {
    loadQuestion();

    return () => {
      stopTimer();
      stopSpeech();
      stopListening();
    };
  }, [
    loadQuestion,
    stopListening,
    stopSpeech,
    stopTimer,
  ]);


  // ==================================================
  // SPEECH RECOGNITION SETUP
  // ==================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    /*
      Speech recognition is optional.

      If unsupported, textarea continues
      to work normally.
    */
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition =
      new SpeechRecognition();

    /*
      IMPORTANT MICROPHONE SETTINGS
    */
    recognition.continuous = true;

    /*
      We need interim results so the user can
      see speech appearing while speaking.
    */
    recognition.interimResults = true;

    /*
      en-IN works better for Indian English
      pronunciation/accent than forcing en-US.
    */
    recognition.lang = "en-IN";

    /*
      Number of alternative recognition results.
      This gives Chrome more flexibility when
      understanding a word.
    */
    recognition.maxAlternatives = 3;


    // --------------------------------------------
    // RECOGNITION START
    // --------------------------------------------

    recognition.onstart = () => {
      setIsListening(true);

      /*
        Candidate is speaking.
        Stop AI interviewer.
      */
      stopVideo();

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };


    // --------------------------------------------
    // RECOGNITION RESULT
    // --------------------------------------------

    recognition.onresult = (
      event
    ) => {
      let newFinalText = "";
      let newInterimText = "";

      /*
        IMPORTANT:

        We only process NEW results from
        event.resultIndex.

        Final and interim speech are kept
        separately.
      */
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result =
          event.results[i];

        const transcript =
          result[0]?.transcript || "";

        if (result.isFinal) {
          newFinalText +=
            transcript + " ";
        } else {
          newInterimText +=
            transcript;
        }
      }


      // ------------------------------------------
      // SAVE FINAL SPEECH
      // ------------------------------------------

      if (newFinalText.trim()) {
        const cleanedFinal =
          newFinalText
            .replace(/\s+/g, " ")
            .trim();

        /*
          Add ONLY confirmed speech to the
          permanent transcript.
        */
        const currentFinal =
          finalTranscriptRef.current
            .trim();

        finalTranscriptRef.current =
          currentFinal
            ? `${currentFinal} ${cleanedFinal}`
                .replace(/\s+/g, " ")
                .trim()
            : cleanedFinal;
      }


      // ------------------------------------------
      // SAVE INTERIM SPEECH
      // ------------------------------------------

      interimTranscriptRef.current =
        newInterimText
          .replace(/\s+/g, " ")
          .trim();


      // ------------------------------------------
      // UPDATE TEXTAREA
      // ------------------------------------------

      const finalText =
        finalTranscriptRef.current.trim();

      const interimText =
        interimTranscriptRef.current.trim();

      /*
        IMPORTANT:

        Interim text is displayed temporarily.

        It is NOT permanently added to
        finalTranscriptRef.

        This prevents duplicated words.
      */
      const displayText =
        interimText
          ? `${finalText} ${interimText}`
              .replace(/\s+/g, " ")
              .trim()
          : finalText;

      answerRef.current =
        displayText;

      setAnswer(
        displayText
      );
    };


    // --------------------------------------------
    // RECOGNITION ERROR
    // --------------------------------------------

    recognition.onerror = (
      event
    ) => {
      console.log(
        "Speech recognition error:",
        event.error
      );

      /*
        These errors can happen normally in
        Chrome and don't necessarily mean
        the microphone is broken.
      */

      if (
        event.error ===
          "not-allowed" ||
        event.error ===
          "service-not-allowed"
      ) {
        listeningRequestedRef.current =
          false;

        setIsListening(false);

        setError(
          "Microphone permission was denied. Please allow microphone access in Chrome."
        );

        return;
      }

      if (
        event.error ===
          "audio-capture"
      ) {
        setError(
          "Chrome could not access the microphone. Please check that your microphone is connected and not being used by another app."
        );
      }

      /*
        For temporary errors such as:
        no-speech
        aborted
        network

        we allow onend to restart recognition.
      */
      setIsListening(false);
    };


    // --------------------------------------------
    // RECOGNITION END
    // --------------------------------------------

    recognition.onend = () => {
      setIsListening(false);

      /*
        Chrome can automatically stop SpeechRecognition
        even when continuous = true.

        If the user still wants the microphone,
        start it again automatically.
      */
      if (
        listeningRequestedRef.current &&
        !submittingRef.current &&
        !finishingRef.current
      ) {
        if (
          recognitionRestartTimerRef.current
        ) {
          clearTimeout(
            recognitionRestartTimerRef.current
          );
        }

        recognitionRestartTimerRef.current =
          setTimeout(() => {
            if (
              !listeningRequestedRef.current ||
              submittingRef.current ||
              finishingRef.current
            ) {
              return;
            }

            try {
              recognition.start();
            } catch (error) {
              /*
                Chrome throws InvalidStateError
                if recognition is already starting.
                Ignore it and let onend handle
                the next restart.
              */
              console.log(
                "Recognition restart:",
                error.message
              );
            }
          }, 250);
      }
    };


    recognitionRef.current =
      recognition;


    // --------------------------------------------
    // CLEANUP
    // --------------------------------------------

    return () => {
      listeningRequestedRef.current =
        false;

      if (
        recognitionRestartTimerRef.current
      ) {
        clearTimeout(
          recognitionRestartTimerRef.current
        );

        recognitionRestartTimerRef.current =
          null;
      }

      try {
        recognition.stop();
      } catch (error) {
        // Already stopped.
      }

      recognitionRef.current = null;
    };
  }, [stopVideo]);


  // ==================================================
  // START MICROPHONE
  // ==================================================

  const startListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    /*
      Stop AI speech first.
    */
    stopSpeech();

    /*
      Tell the recognition system that the
      user wants the microphone to remain active.
    */
    listeningRequestedRef.current =
      true;

    /*
      Start a new answer transcript from the
      current textarea content.

      This is important if the user already typed
      something before using the microphone.
    */
    finalTranscriptRef.current =
      answerRef.current.trim();

    interimTranscriptRef.current =
      "";

    setError("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(
        "Recognition start error:",
        error
      );

      /*
        Chrome can throw this if start() is
        called while recognition is already
        starting/listening.

        It is safe to ignore.
      */
    }
  };


  // ==================================================
  // STOP MICROPHONE
  // ==================================================

  const handleStopListening = () => {
    /*
      First disable automatic restarting.
    */
    listeningRequestedRef.current =
      false;

    interimTranscriptRef.current =
      "";

    stopListening();

    /*
      Save only the confirmed transcript.

      This removes any temporary interim words
      that Chrome had not confirmed yet.
    */
    const finalText =
      finalTranscriptRef.current.trim();

    answerRef.current =
      finalText;

    setAnswer(
      finalText
    );
  };


  // ==================================================
  // ANSWER CHANGE
  // ==================================================

  const handleAnswerChange = (
    event
  ) => {
    const value =
      event.target.value;

    setAnswer(value);
    answerRef.current = value;

    /*
      If the user types manually, use the typed
      content as the current confirmed transcript.
    */
    if (!isListening) {
      finalTranscriptRef.current =
        value;

      interimTranscriptRef.current =
        "";
    }
  };


  // ==================================================
  // MANUAL FINISH
  // ==================================================

  const handleFinishInterview =
    async () => {
      if (
        finishingRef.current ||
        submittingRef.current
      ) {
        return;
      }

      try {
        finishingRef.current =
          true;

        setFinishing(true);
        setError("");

        stopTimer();
        stopSpeech();
        stopListening();

        const response =
          await finishInterview(
            interviewId
          );

        console.log(
          "Finish interview response:",
          response
        );

        const report =
          response?.report ||
          response?.data?.report ||
          response?.data ||
          response;

        if (!report) {
          throw new Error(
            "Interview report could not be generated."
          );
        }

        if (
          typeof onFinish ===
          "function"
        ) {
          onFinish(
            report,
            interviewId
          );
        } else {
          setError(
            "Interview completed, but the results screen is not connected."
          );
        }
      } catch (error) {
        console.error(
          "Finish interview error:",
          error
        );

        setError(
          error?.message ||
            "Unable to finish the interview."
        );
      } finally {
        finishingRef.current =
          false;

        setFinishing(false);
      }
    };


  // ==================================================
  // TIMER DISPLAY
  // ==================================================

  const minutes =
    Math.floor(
      timeLeft / 60
    )
      .toString()
      .padStart(2, "0");

  const seconds =
    (timeLeft % 60)
      .toString()
      .padStart(2, "0");


  // ==================================================
  // LOADING SCREEN
  // ==================================================

  if (
    loading &&
    !question
  ) {
    return (
      <div className="interview-page">

        <header className="interview-header">

          <div className="interview-brand">

            <img
              src={logo}
              alt="PrepNova"
            />

            <span>
              AI Interview
            </span>

          </div>

        </header>


        <main className="interview-main">

          <div className="interview-loading">

            <div className="loading-spinner" />

            <h2>
              Preparing your interview...
            </h2>

            <p>
              Your AI interviewer is
              getting the next question
              ready.
            </p>

          </div>

        </main>

      </div>
    );
  }


  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="interview-page">

      {/* =============================================
          HEADER
      ============================================= */}

      <header className="interview-header">

        <div className="interview-brand">

          <img
            src={logo}
            alt="PrepNova"
          />

          <span>
            AI Interview
          </span>

        </div>


        <div className="interview-header-right">

          <div className="question-counter">
            Question{" "}

            <strong>
              {question?.questionNumber ||
                1}
            </strong>
          </div>


          <div
            className={`interview-timer ${
              timeLeft <= 15
                ? "timer-danger"
                : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faClock}
            />

            <span>
              {minutes}:{seconds}
            </span>
          </div>

        </div>

      </header>


      {/* =============================================
          MAIN
      ============================================= */}

      <main className="interview-main">

        {/* ===========================================
            INTERVIEWER PANEL
        =========================================== */}

        <section className="interviewer-panel">

          <div className="interviewer-video-area">

            <div
              className={`ai-video-wrapper ${
                isSpeaking
                  ? "speaking"
                  : ""
              }`}
            >

              <video
                ref={videoRef}
                className="ai-interviewer-video"
                src={femaleAiVideo}
                muted
                loop
                playsInline
                preload="auto"
              />


              {isSpeaking && (
                <div className="ai-speaking-indicator">

                  <span className="speaking-dot" />

                  Speaking...

                </div>
              )}

            </div>

          </div>


          <div className="interviewer-info">

            <div>

              <h3>
                AI Interviewer
              </h3>

              <p>
                {isSpeaking
                  ? "Please listen to the question..."
                  : isListening
                  ? "I'm listening to your answer..."
                  : "Take your time and answer clearly."}
              </p>

            </div>


            <div
              className={`interviewer-status ${
                isSpeaking
                  ? "status-speaking"
                  : isListening
                  ? "status-listening"
                  : ""
              }`}
            >

              <span />

              {isSpeaking
                ? "Speaking"
                : isListening
                ? "Listening"
                : "Ready"}

            </div>

          </div>

        </section>


        {/* ===========================================
            QUESTION + ANSWER
        =========================================== */}

        <section className="question-panel">

          {/* -----------------------------------------
              QUESTION
          ----------------------------------------- */}

          <div className="question-card">

            <div className="question-card-top">

              <span className="question-label">
                INTERVIEW QUESTION
              </span>


              {question?.difficulty && (
                <span
                  className={`difficulty-badge ${String(
                    question.difficulty
                  ).toLowerCase()}`}
                >
                  {question.difficulty}
                </span>
              )}

            </div>


            <h1>
              {question?.question ||
                "Loading question..."}
            </h1>

          </div>


          {/* -----------------------------------------
              ANSWER
          ----------------------------------------- */}

          <div className="answer-section">

            <div className="answer-header">

              <div>

                <span className="answer-label">
                  YOUR ANSWER
                </span>

                <p>
                  Speak naturally or type
                  your answer below.
                </p>

              </div>


              {/* ---------------------------------------
                  SPEECH CONTROLS
              --------------------------------------- */}

              {speechSupported && (
                <div className="speech-controls">

                  {!isListening ? (

                    <button
                      type="button"
                      className="mic-button"
                      onClick={
                        startListening
                      }
                      disabled={
                        submitting ||
                        finishing ||
                        isSpeaking
                      }
                    >

                      <FontAwesomeIcon
                        icon={faMicrophone}
                      />

                      <span>
                        Start Speaking
                      </span>

                    </button>

                  ) : (

                    <button
                      type="button"
                      className="mic-button listening"
                      onClick={
                        handleStopListening
                      }
                    >

                      <FontAwesomeIcon
                        icon={faStop}
                      />

                      <span>
                        Stop Speaking
                      </span>

                    </button>

                  )}

                </div>
              )}

            </div>


            {/* -----------------------------------------
                TEXT ANSWER
            ----------------------------------------- */}

            <textarea
              className="answer-textarea"
              value={answer}
              onChange={
                handleAnswerChange
              }
              placeholder={
                speechSupported
                  ? "Type your answer here or use the microphone..."
                  : "Speech recognition isn't available in this browser. Type your answer here..."
              }
              disabled={
                submitting ||
                finishing
              }
            />


            <div className="answer-footer">

              <span className="answer-hint">

                {isListening
                  ? "Listening to your answer..."
                  : speechSupported
                  ? "You can type or use your microphone."
                  : "Type your answer in the box above."}

              </span>


              <div className="answer-actions">

                {/* -------------------------------------
                    FINISH INTERVIEW
                ------------------------------------- */}

                <button
                  type="button"
                  className="finish-button"
                  onClick={
                    handleFinishInterview
                  }
                  disabled={
                    submitting ||
                    finishing
                  }
                >
                  {finishing
                    ? "Finishing..."
                    : "Finish Interview"}
                </button>


                {/* -------------------------------------
                    SUBMIT ANSWER
                ------------------------------------- */}

                <button
                  type="button"
                  className="submit-answer-button"
                  onClick={() =>
                    handleSubmitAnswer(
                      false
                    )
                  }
                  disabled={
                    submitting ||
                    finishing ||
                    !answer.trim()
                  }
                >
                  {submitting
                    ? "Evaluating..."
                    : "Submit Answer →"}
                </button>

              </div>

            </div>

          </div>


          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="interview-error">

              <FontAwesomeIcon
                icon={faTriangleExclamation}
              />

              <span>
                {error}
              </span>

            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default Interview;