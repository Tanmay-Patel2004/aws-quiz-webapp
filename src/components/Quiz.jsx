import { useTimer } from "../hooks/useTimer";
import { useState, useEffect } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Checkbox,
  Container,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
  Alert,
  IconButton,
  Drawer,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Flag as FlagIcon,
  Quiz as QuizIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

function Quiz({ examFile, onQuit }) {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showResult, setShowResult] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // New state for mobile drawer

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [quizState, setQuizState] = useState(() => {
    const saved = localStorage.getItem(`quizState_${examFile}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          current: parsed.current || 0,
          selected: parsed.selected || "",
          markQuestion: parsed.markQuestion || false,
          questionStatus: Array.isArray(parsed.questionStatus)
            ? parsed.questionStatus
            : [],
          score: parsed.score || 0,
          time: parsed.time || "90:00", // Ensure time is "MM:SS" string
        };
      } catch (e) {
        localStorage.removeItem(`quizState_${examFile}`);
        return {
          current: 0,
          selected: "",
          markQuestion: false,
          questionStatus: [],
          score: 0,
          time: "90:00", // Default to "90:00" string
        };
      }
    }
    return {
      current: 0,
      selected: "",
      markQuestion: false,
      questionStatus: [],
      score: 0,
      time: "90:00", // Default to "90:00" string
    };
  });

  const initialSeconds = quizState.time
    ? typeof quizState.time === "string" && quizState.time.includes(":")
      ? parseInt(quizState.time.split(":")[0]) * 60 +
        parseInt(quizState.time.split(":")[1])
      : 90 * 60
    : 90 * 60;
  const { time } = useTimer(initialSeconds);
  const { current, selected, markQuestion, questionStatus, score } = quizState;

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://raw.githubusercontent.com/Tanmay-Patel2004/aws-practice-questions/main/data/${examFile}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${examFile}. Status: ${response.status}`
          );
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Exam data is empty or invalid.");
        }
        setExamData(data);
        setQuizState((prev) => {
          const currentStatus = prev.questionStatus || [];
          const newQuestionStatus = Array(data.length)
            .fill()
            .map((_, index) => {
              const existingStatus = currentStatus[index] || {};
              return {
                answered: existingStatus.answered || false,
                marked: existingStatus.marked || false,
              };
            });
          return {
            ...prev,
            questionStatus: newQuestionStatus,
          };
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchExamData();
  }, [examFile]);

  useEffect(() => {
    if (examData) {
      setQuizState((prev) => {
        const currentStatus = prev.questionStatus || [];
        const newQuestionStatus = Array(examData.length)
          .fill()
          .map((_, index) => {
            const existingStatus = currentStatus[index] || {};
            return {
              answered: existingStatus.answered || false,
              marked: existingStatus.marked || false,
              selected: existingStatus.selected || "", // Store selected answer
            };
          });
        return {
          ...prev,
          questionStatus: newQuestionStatus,
          selected: currentStatus[prev.current]?.selected || "", // Restore selected for current question
        };
      });
    }
  }, [examData]);

  useEffect(() => {
    if (examData && quizState.questionStatus[quizState.current]) {
      setQuizState((prev) => ({
        ...prev,
        selected: prev.questionStatus[prev.current].selected || "",
      }));
    }
  }, [quizState.current, examData, quizState.questionStatus]);

  useEffect(() => {
    setQuizState((prev) => ({ ...prev, time }));
  }, [time]);

  // Sync quiz state with localStorage
  useEffect(() => {
    if (showResult) {
      localStorage.removeItem(`quizState_${examFile}`);
    }
  }, [showResult]);

  // LOADING STATE
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            transition: theme.transitions.create(["box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3, color: "primary.main" }} />
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            Loading Exam
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we prepare your practice exam...
          </Typography>
        </Paper>
      </Container>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            transition: theme.transitions.create(["box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Unable to Load Exam
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              transition: theme.transitions.create(
                ["background-color", "box-shadow"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: theme.shadows[4],
              },
              "&:focus-visible": {
                outline: `2px solid ${theme.palette.secondary.main}`,
                outlineOffset: 2,
              },
            }}
            aria-label="Retry loading exam"
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  // NO QUESTIONS STATE
  if (!examData || examData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            transition: theme.transitions.create(["box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <QuizIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
          >
            No Questions Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This exam appears to be empty. Please try selecting a different
            exam.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const question = examData[current];

  const handleSubmit = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[current] = {
      answered: selected !== "",
      marked: markQuestion,
      selected: selected, // Save the selected answer
    };
    setQuizState((prev) => ({
      ...prev,
      questionStatus: updatedStatus,
      current:
        prev.current + 1 < examData.length ? prev.current + 1 : prev.current,
      selected: "", // Reset for next question, but restored by useEffect
      score: prev.selected === question.answer ? prev.score + 1 : prev.score,
    }));
    if (current + 1 >= examData.length) {
      setShowResult(true);
      setShowReview(true);
    }
  };

  // SIDEBAR COMPONENT
  const QuestionSidebar = ({ inDrawer = false }) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: theme.palette.mode === "dark" ? "#2d2d2d" : "background.paper",
        color: theme.palette.mode === "dark" ? "#ffffff" : "text.primary",
        height: inDrawer ? "100%" : "auto", // Auto height for desktop
        overflowY: "auto", // Ensure scrolling works
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#555555" : "#bbbbbb",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2d2d2d" : "grey.200",
        },
      }}
    >
      {inDrawer && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Question Navigator
          </Typography>
          <IconButton
            onClick={() => setSidebarOpen(false)}
            sx={{
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#333333"
                    : theme.palette.grey[200],
              },
            }}
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      {!inDrawer && (
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Question Navigator
        </Typography>
      )}
      {/* Legend */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {/* ... (existing legend stacks) */}
      </Stack>
      <Divider sx={{ mb: 3 }} />
      {/* Question Palette */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          gap: 1.5,
          minHeight: "100%", // Ensure full height
          maxHeight: "calc(100vh - 200px)", // Cap height to avoid overflow
          overflowY: "auto", // Scroll within the grid
        }}
      >
        {examData.map((_, index) => {
          const status = quizState.questionStatus[index];
          let chipColor = "default";
          let chipBgColor =
            theme.palette.mode === "dark" ? "#3d3d3d" : "grey.300";

          if (index === quizState.current) {
            chipColor = "primary";
            chipBgColor =
              theme.palette.mode === "dark" ? "#1e40af" : "primary.main";
          } else if (status?.marked) {
            chipColor = "warning";
            chipBgColor =
              theme.palette.mode === "dark" ? "#ed6c02" : "warning.main";
          } else if (status?.answered) {
            chipColor = "success";
            chipBgColor =
              theme.palette.mode === "dark" ? "#2e7d32" : "success.main";
          }

          return (
            <IconButton
              key={index}
              onClick={() => {
                goToQuestion(index);
                if (inDrawer) setSidebarOpen(false);
              }}
              sx={{
                minWidth: 48,
                height: 48,
                bgcolor: chipBgColor,
                color:
                  index === quizState.current ||
                  status?.answered ||
                  status?.marked
                    ? "white"
                    : theme.palette.mode === "dark"
                    ? "#bbbbbb"
                    : "text.primary",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.875rem",
                border: index === quizState.current ? 3 : 0,
                borderColor:
                  index === quizState.current ? "primary.dark" : "transparent",
                transition: theme.transitions.create(
                  ["background-color", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor:
                    index === quizState.current ||
                    status?.answered ||
                    status?.marked
                      ? chipBgColor
                      : theme.palette.mode === "dark"
                      ? "#444444"
                      : theme.palette.grey[400],
                  opacity: 0.9,
                  boxShadow: theme.shadows[2],
                },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 2,
                },
              }}
              aria-label={`Go to question ${index + 1}${
                status?.answered ? " (answered)" : ""
              }${status?.marked ? " (marked for review)" : ""}`}
            >
              {index + 1}
            </IconButton>
          );
        })}
      </Box>
    </Paper>
  );

  // RESULT SCREEN
  if (showResult) {
    const percentage = Math.round((score / examData.length) * 100);
    const passed = percentage >= 70;

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            transition: theme.transitions.create(["box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: passed ? "success.main" : "error.main",
              mx: "auto",
              mb: 3,
              fontSize: "2rem",
            }}
          >
            {passed ? "🎉" : "📚"}
          </Avatar>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
          >
            Exam Complete!
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 3, color: passed ? "success.main" : "error.main" }}
          >
            {percentage}% ({score}/{examData.length})
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {passed
              ? "Congratulations! You've passed the exam."
              : "Keep studying and try again. You've got this!"}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.location.reload()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: theme.transitions.create(
                  ["background-color", "border-color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 2,
                },
              }}
              aria-label="Start a new exam"
            >
              Take Another Exam
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: theme.transitions.create(
                  ["background-color", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[4],
                },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 2,
                },
              }}
              aria-label="Review your answers"
            >
              Review Answers
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }
  if (showReviewScreen) {
    const answered = quizState.questionStatus.filter((q) => q.answered).length;
    const marked = quizState.questionStatus.filter((q) => q.marked).length;
    const total = examData.length;
    const unanswered = total - answered;

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            bgcolor:
              theme.palette.mode === "dark" ? "#1e1e1e" : "background.paper",
            color: theme.palette.mode === "dark" ? "#ffffff" : "text.primary",
            transition: theme.transitions.create(["box-shadow"], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}
          >
            Review Your Exam
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Box sx={{ flex: "1 1 100%", maxWidth: { sm: "33.33%" } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "success.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "success.200",
                  "&:hover": { boxShadow: theme.shadows[2] },
                }}
              >
                <CheckCircleIcon
                  sx={{ fontSize: 32, color: "success.main", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {answered}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Answered
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: "1 1 100%", maxWidth: { sm: "33.33%" } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "grey.200",
                  "&:hover": { boxShadow: theme.shadows[2] },
                }}
              >
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 32, color: "grey.500", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "grey.600" }}
                >
                  {unanswered}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unanswered
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: "1 1 100%", maxWidth: { sm: "33.33%" } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "warning.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "warning.200",
                  "&:hover": { boxShadow: theme.shadows[2] },
                }}
              >
                <FlagIcon sx={{ fontSize: 32, color: "warning.main", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "warning.main" }}
                >
                  {marked}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Marked for Review
                </Typography>
              </Paper>
            </Box>
          </Stack>

          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              You have <strong>{unanswered}</strong> unanswered questions.
              {unanswered > 0 &&
                " You can go back to complete them or submit the exam as is."}
            </Typography>
          </Alert>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              startIcon={<NavigateBeforeIcon />}
              onClick={() => setShowReviewScreen(false)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: theme.transitions.create(
                  ["background-color", "border-color"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 2,
                },
              }}
              aria-label="Continue with exam"
            >
              Continue Exam
            </Button>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => {
                setShowReviewScreen(false);
                setShowResult(true);
                setShowReview(true);
              }}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: theme.transitions.create(
                  ["background-color", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                  boxShadow: theme.shadows[4],
                },
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 2,
                },
              }}
              aria-label="Submit final answers"
            >
              Submit Final Answers
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // MAIN QUIZ INTERFACE
  const progress = ((current + 1) / examData.length) * 100;

  // Navigation functions
  const goToQuestion = (index) => {
    setQuizState((prev) => ({
      ...prev,
      current: index,
      selected: prev.questionStatus[index]?.selected || "", // Restore previous selection
    }));
  };

  const handleQuit = () => {
    localStorage.removeItem(`quizState_${examFile}`);
    setQuizState({
      current: 0,
      selected: "",
      markQuestion: false,
      questionStatus: [],
      score: 0,
      time: "90:00",
    }); // Reset quiz state
    onQuit(); // Navigate to homepage
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "grey.50",
      }}
    >
      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        <QuestionSidebar inDrawer />
      </Drawer>

      {/* DESKTOP SIDEBAR */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          width: { sm: 280, md: 320 },
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: "sticky", top: 0, height: "100vh", p: 2 }}>
          <QuestionSidebar />
        </Box>
      </Box>

      {/* MAIN CONTENT AREA */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Container maxWidth="lg" disableGutters>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              bgcolor: "background.paper",
              overflow: "hidden",
              transition: theme.transitions.create(["box-shadow"], {
                duration: theme.transitions.duration.short,
              }),
            }}
          >
            {/* HEADER - PROGRESS & TIMER */}
            <Box
              sx={{
                p: 3,
                borderBottom: 1,
                borderColor:
                  theme.palette.mode === "dark" ? "#333333" : "divider",
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={handleQuit}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  borderColor:
                    theme.palette.mode === "dark" ? "#bbbbbb" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "#333333"
                        : theme.palette.grey[200],
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  },
                }}
              >
                Quit
              </Button>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      p: 1,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#2d2d2d"
                            : theme.palette.grey[200],
                      },
                    }}
                    aria-label="Open question navigator"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : "text.primary",
                      }}
                    >
                      Question {quizState.current + 1} of {examData.length}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "#2d2d2d"
                            : "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "#3b82f6"
                              : "primary.main",
                        },
                      }}
                    />
                  </Box>
                </Stack>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Time: ${time}`}
                  variant="filled"
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark" ? "#000000" : "grey.900",
                    color: "white",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    px: 1,
                    alignSelf: { xs: "flex-end", sm: "center" },
                  }}
                  aria-label={`Time remaining: ${time}`}
                />
              </Stack>
            </Box>

            {/* FIXED-HEIGHT QUESTION CONTAINER */}
            <Box
              sx={{
                height: {
                  xs: "calc(100vh - 200px)",
                  sm: "calc(100vh - 160px)",
                  md: theme.spacing(70),
                },
                overflowY: "auto",
                p: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "#1e1e1e"
                    : "background.paper",
                color:
                  theme.palette.mode === "dark" ? "#ffffff" : "text.primary",
              }}
            >
              {/* MARK QUESTION CHECKBOX */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={markQuestion}
                      onChange={() => {
                        const updatedStatus = [...questionStatus];
                        updatedStatus[current].marked = !markQuestion;
                        setQuizState((prev) => ({
                          ...prev,
                          questionStatus: updatedStatus,
                          markQuestion: !prev.markQuestion,
                        }));
                      }}
                      sx={{
                        color: "warning.main",
                        "&.Mui-checked": {
                          color: "warning.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FlagIcon sx={{ fontSize: 16, color: "warning.main" }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Mark for Review
                      </Typography>
                    </Stack>
                  }
                />
              </Box>

              {/* QUESTION */}
              <Box component="section" sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    lineHeight: 1.6,
                    fontWeight: 500,
                    color: "text.primary",
                  }}
                >
                  {question.question}
                </Typography>

                {/* ANSWER OPTIONS */}
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={selected}
                    onChange={(e) =>
                      setQuizState((prev) => {
                        const updatedStatus = [...prev.questionStatus];
                        updatedStatus[prev.current] = {
                          ...updatedStatus[prev.current],
                          selected: e.target.value,
                        };
                        return {
                          ...prev,
                          selected: e.target.value,
                          questionStatus: updatedStatus,
                        };
                      })
                    }
                  >
                    <Box sx={{ display: "grid", gap: 1.5 }}>
                      {question.options.map((option, index) => {
                        const letter = String.fromCharCode(65 + index);
                        return (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 1,
                              borderRadius: 3,
                              border: 2,
                              borderColor:
                                selected === letter
                                  ? "primary.main"
                                  : theme.palette.mode === "dark"
                                  ? "#444444"
                                  : "grey.300",
                              bgcolor:
                                selected === letter
                                  ? theme.palette.mode === "dark"
                                    ? "#2d2d2d"
                                    : "primary.50"
                                  : theme.palette.mode === "dark"
                                  ? "#1e1e1e"
                                  : "background.paper",
                              cursor: "pointer",
                              transition: theme.transitions.create(["all"], {
                                duration: theme.transitions.duration.short,
                              }),
                              "&:hover": {
                                boxShadow: theme.shadows[4],
                                borderColor: "primary.main",
                                transform: "translateY(-2px)",
                              },
                            }}
                            onClick={() =>
                              setQuizState((prev) => {
                                const updatedStatus = [...prev.questionStatus];
                                updatedStatus[prev.current] = {
                                  ...updatedStatus[prev.current],
                                  selected: letter,
                                };
                                return {
                                  ...prev,
                                  selected: letter,
                                  questionStatus: updatedStatus,
                                };
                              })
                            }
                          >
                            <FormControlLabel
                              value={letter}
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": { color: "primary.main" },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    ml: 1,
                                    color:
                                      theme.palette.mode === "dark"
                                        ? "#ffffff"
                                        : "text.primary",
                                  }}
                                >
                                  <strong>{letter}.</strong> {option}
                                </Typography>
                              }
                              sx={{
                                margin: 0,
                                width: "100",
                                "& .MuiFormControlLabel-label": { flex: 1 },
                              }}
                            />
                          </Paper>
                        );
                      })}
                    </Box>
                  </RadioGroup>
                </FormControl>

                {/* SHOW ANSWER */}
                {showAnswer && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 3,
                      transition: theme.transitions.create(["opacity"], {
                        duration: theme.transitions.duration.short,
                      }),
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Correct Answer: <strong>{question.answer}</strong>
                    </Typography>
                    {question.explanation && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {question.explanation}
                      </Typography>
                    )}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* NAVIGATION FOOTER */}
            <Box
              sx={{
                p: 3,
                borderTop: 1,
                borderColor:
                  theme.palette.mode === "dark" ? "#333333" : "divider",
                bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "grey.50",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Button
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={() => {
                    if (quizState.current > 0) {
                      setQuizState((prev) => ({
                        ...prev,
                        current: prev.current - 1,
                        selected: "",
                      }));
                    }
                  }}
                  disabled={current === 0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                    borderColor:
                      theme.palette.mode === "dark" ? "#bbbbbb" : "inherit",
                    "&:hover:not(:disabled)": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#333333"
                          : theme.palette.primary.main,
                      color:
                        theme.palette.mode === "dark"
                          ? "#ffffff"
                          : theme.palette.primary.contrastText,
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "#ffffff"
                          : theme.palette.primary.main,
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.secondary.main}`,
                      outlineOffset: 2,
                    },
                  }}
                  aria-label="Go to previous question"
                >
                  Previous
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAnswer(!showAnswer)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      color:
                        theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                      borderColor:
                        theme.palette.mode === "dark" ? "#bbbbbb" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#333333"
                            : theme.palette.secondary.main,
                        color:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : theme.palette.secondary.contrastText,
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : theme.palette.secondary.main,
                      },
                      "&:focus-visible": {
                        outline: `2px solid ${theme.palette.secondary.main}`,
                        outlineOffset: 2,
                      },
                    }}
                    aria-label={showAnswer ? "Hide answer" : "Show answer"}
                  >
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowReviewScreen(true)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      color:
                        theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                      borderColor:
                        theme.palette.mode === "dark" ? "#bbbbbb" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#333333"
                            : theme.palette.info.main,
                        color:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : theme.palette.info.contrastText,
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "#ffffff"
                            : theme.palette.info.main,
                      },
                      "&:focus-visible": {
                        outline: `2px solid ${theme.palette.secondary.main}`,
                        outlineOffset: 2,
                      },
                    }}
                    aria-label="Review exam progress"
                  >
                    Review
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  endIcon={<NavigateNextIcon />}
                  onClick={handleSubmit}
                  disabled={!selected}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e40af" : "inherit",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                    "&:hover:not(:disabled)": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "#1e3a8a"
                          : theme.palette.primary.dark,
                      boxShadow: theme.shadows[4],
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${theme.palette.secondary.main}`,
                      outlineOffset: 2,
                    },
                  }}
                  aria-label={
                    current + 1 === examData.length
                      ? "Submit final answer"
                      : "Submit answer and go to next question"
                  }
                >
                  {current + 1 === examData.length ? "Submit" : "Next"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Quiz;
