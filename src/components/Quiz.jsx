import { useTimer } from "../hooks/useTimer";
import { useState, useEffect } from "react";
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
  Grid,
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

function Quiz({ examFile }) {
  // Business logic intact: do not change - all existing state and hooks
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [markQuestion, setMarkQuestion] = useState(false);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // New state for mobile drawer
  const { time } = useTimer(90); // Business logic intact: do not change

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Business logic intact: do not change - all existing useEffect hooks
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
        setQuestionStatus(data.map(() => ({ answered: false, marked: false })));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examFile]);

  useEffect(() => {
    if (examData && current < examData.length) {
      setMarkQuestion(questionStatus[current]?.marked || false);
    }
  }, [current, examData, questionStatus]);

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
            onClick={() => window.location.reload()} // Business logic intact: do not change
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

  const question = examData[current]; // Business logic intact: do not change

  // Business logic intact: do not change - handleSubmit function
  const handleSubmit = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[current] = {
      answered: selected !== "",
      marked: markQuestion,
    };
    setQuestionStatus(updatedStatus);

    if (selected === question.answer) setScore(score + 1);

    if (current + 1 < examData.length) {
      setCurrent(current + 1);
      setSelected("");
    } else {
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
        borderRadius: inDrawer ? 0 : 3,
        bgcolor: "background.paper",
        height: inDrawer ? "100vh" : "calc(100vh - 48px)",
        position: inDrawer ? "relative" : "sticky",
        top: inDrawer ? 0 : 24,
        overflowY: "auto",
        width: "100%",
        transition: theme.transitions.create(["box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
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
                backgroundColor: theme.palette.grey[200],
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

      {/* LEGEND */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 18,
              height: 18,
              bgcolor: "success.main",
              borderRadius: 1,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Answered
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 18,
              height: 18,
              bgcolor: "warning.main",
              borderRadius: 1,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Marked for Review
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 18,
              height: 18,
              bgcolor: "primary.main",
              borderRadius: 1,
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Current Question
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* QUESTION PALETTE */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          gap: 1.5,
          maxHeight: inDrawer ? "calc(100vh - 200px)" : "70vh",
          overflowY: "auto",
        }}
      >
        {examData.map((_, index) => {
          const status = questionStatus[index];
          let chipColor = "default";
          let chipBgColor = "grey.300";

          if (index === current) {
            chipColor = "primary";
            chipBgColor = "primary.main";
          } else if (status?.marked) {
            chipColor = "warning";
            chipBgColor = "warning.main";
          } else if (status?.answered) {
            chipColor = "success";
            chipBgColor = "success.main";
          }

          return (
            <IconButton
              key={index}
              onClick={() => {
                // Business logic intact: do not change
                setCurrent(index);
                setSelected("");
                if (inDrawer) setSidebarOpen(false);
              }}
              sx={{
                minWidth: 48,
                height: 48,
                bgcolor: chipBgColor,
                color:
                  index === current || status?.answered || status?.marked
                    ? "white"
                    : "text.primary",
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "0.875rem",
                border: index === current ? 3 : 0,
                borderColor: index === current ? "primary.dark" : "transparent",
                transition: theme.transitions.create(
                  ["background-color", "transform", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  backgroundColor:
                    index === current || status?.answered || status?.marked
                      ? chipBgColor
                      : theme.palette.grey[400],
                  opacity: 0.9,
                  transform: "scale(1.05)",
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

  // REVIEW SCREEN
  if (showReviewScreen) {
    const answered = questionStatus.filter((q) => q.answered).length;
    const marked = questionStatus.filter((q) => q.marked).length;
    const total = examData.length;
    const unanswered = total - answered;

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            bgcolor: "background.paper",
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

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "success.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "success.200",
                  transition: theme.transitions.create(["box-shadow"], {
                    duration: theme.transitions.duration.short,
                  }),
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                  },
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "grey.200",
                  transition: theme.transitions.create(["box-shadow"], {
                    duration: theme.transitions.duration.short,
                  }),
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                  },
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "warning.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "warning.200",
                  transition: theme.transitions.create(["box-shadow"], {
                    duration: theme.transitions.duration.short,
                  }),
                  "&:hover": {
                    boxShadow: theme.shadows[2],
                  },
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
            </Grid>
          </Grid>

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
              onClick={() => setShowReviewScreen(false)} // Business logic intact: do not change
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
                // Business logic intact: do not change
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
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
            <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
              >
                {/* MOBILE MENU BUTTON */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                      display: { xs: "flex", sm: "none" },
                      p: 1,
                      "&:hover": {
                        backgroundColor: theme.palette.grey[200],
                      },
                    }}
                    aria-label="Open question navigator"
                  >
                    <MenuIcon />
                  </IconButton>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Question {current + 1} of {examData.length}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 1,
                          bgcolor: "primary.main",
                          transition: theme.transitions.create(["transform"], {
                            duration: theme.transitions.duration.standard,
                          }),
                        },
                      }}
                      aria-label={`Question ${current + 1} of ${
                        examData.length
                      }`}
                    />
                  </Box>
                </Stack>

                {/* TIMER */}
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Time: ${time}`}
                  variant="filled"
                  sx={{
                    bgcolor: "grey.900",
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
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.short,
                }),
              }}
            >
              {/* MARK QUESTION CHECKBOX */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={markQuestion}
                      onChange={() => {
                        // Business logic intact: do not change
                        const updatedStatus = [...questionStatus];
                        updatedStatus[current].marked = !markQuestion;
                        setQuestionStatus(updatedStatus);
                        setMarkQuestion(!markQuestion);
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
                    onChange={(e) => setSelected(e.target.value)} // Business logic intact: do not change
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
                                  : "grey.300",
                              bgcolor:
                                selected === letter
                                  ? "primary.50"
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
                            onClick={() => setSelected(letter)}
                          >
                            <FormControlLabel
                              value={letter}
                              control={
                                <Radio
                                  sx={{
                                    "&.Mui-checked": {
                                      color: "primary.main",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, ml: 1 }}
                                >
                                  <strong>{letter}.</strong> {option}
                                </Typography>
                              }
                              sx={{
                                margin: 0,
                                width: "100%",
                                "& .MuiFormControlLabel-label": {
                                  flex: 1,
                                },
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
                borderColor: "divider",
                bgcolor: "grey.50",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                {/* PREVIOUS BUTTON */}
                <Button
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                  onClick={() => {
                    if (current > 0) {
                      setCurrent(current - 1);
                      setSelected("");
                    }
                  }}
                  disabled={current === 0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    transition: theme.transitions.create(
                      ["background-color", "border-color"],
                      {
                        duration: theme.transitions.duration.short,
                      }
                    ),
                    "&:hover:not(:disabled)": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderColor: theme.palette.primary.main,
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

                {/* CENTER BUTTONS */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAnswer(!showAnswer)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      transition: theme.transitions.create(
                        ["background-color", "border-color"],
                        {
                          duration: theme.transitions.duration.short,
                        }
                      ),
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        borderColor: theme.palette.secondary.main,
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
                      transition: theme.transitions.create(
                        ["background-color", "border-color"],
                        {
                          duration: theme.transitions.duration.short,
                        }
                      ),
                      "&:hover": {
                        backgroundColor: theme.palette.info.main,
                        color: theme.palette.info.contrastText,
                        borderColor: theme.palette.info.main,
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

                {/* NEXT/SUBMIT BUTTON */}
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
                    transition: theme.transitions.create(
                      ["background-color", "box-shadow"],
                      {
                        duration: theme.transitions.duration.short,
                      }
                    ),
                    "&:hover:not(:disabled)": {
                      backgroundColor: theme.palette.primary.dark,
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
