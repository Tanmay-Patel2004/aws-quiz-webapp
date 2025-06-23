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
} from "@mui/material";

function Quiz({ examFile }) {
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
  const { time } = useTimer(90); // 90 seconds for demo; adjust as needed

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

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box mt={10} textAlign="center">
          <CircularProgress />
          <Typography variant="h6" mt={2}>
            Loading exam...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box mt={10} textAlign="center">
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  if (!examData || examData.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box mt={10} textAlign="center">
          <Typography variant="h6" color="error">
            No questions found in the exam.
          </Typography>
        </Box>
      </Container>
    );
  }

  const question = examData[current];

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

  if (showResult) {
    return (
      <Container maxWidth="sm">
        <Box mt={10}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Test Complete!
            </Typography>
            <Typography variant="body1" align="center">
              You scored <strong>{score}</strong> out of{" "}
              <strong>{examData.length}</strong>.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (showReviewScreen) {
    const answered = questionStatus.filter((q) => q.answered).length;
    const marked = questionStatus.filter((q) => q.marked).length;
    const total = examData.length;

    return (
      <Container maxWidth="sm">
        <Box mt={10}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Review Your Exam
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Total Questions: {total} <br />
              Answered: {answered} <br />
              Unanswered: {total - answered} <br />
              Marked for Review: {marked}
            </Typography>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={() => setShowReviewScreen(false)}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setShowReviewScreen(false);
                  setShowResult(true);
                  setShowReview(true);
                }}
              >
                Submit Exam
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mb={2}
        >
          <Typography
            sx={{
              color: "white",
              background: "#222",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontFamily: "monospace",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            Time Remaining: <span style={{ fontWeight: 700 }}>{time}</span>
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={markQuestion}
                      onChange={() => {
                        const updatedStatus = [...questionStatus];
                        updatedStatus[current].marked = !markQuestion;
                        setQuestionStatus(updatedStatus);
                        setMarkQuestion(!markQuestion);
                      }}
                    />
                  }
                  label="Mark"
                />
                <Typography variant="subtitle1">
                  <strong>Question {current + 1}</strong> of {examData.length}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                {question.question}
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {question.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    return (
                      <FormControlLabel
                        key={index}
                        value={letter}
                        control={<Radio />}
                        label={`${letter}. ${option}`}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>

              {showAnswer && (
                <Typography variant="subtitle2" color="green" mt={2}>
                  Correct Answer: {question.answer}
                </Typography>
              )}

              {showReview && (
                <Box mt={3}>
                  <Typography variant="subtitle2" color="green">
                    ✅ Correct Answer: {question.answer}
                  </Typography>
                  {question.explanation && (
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      💡 Explanation: {question.explanation}
                    </Typography>
                  )}
                </Box>
              )}

              <Box mt={4} display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  disabled={current === 0}
                  onClick={() => {
                    setCurrent(current - 1);
                    setSelected("");
                  }}
                >
                  Previous
                </Button>

                <Box>
                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    onClick={() => setShowReview(!showReview)}
                  >
                    {showReview ? "Hide Review" : "Review"}
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ mr: 2 }}
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    disabled={!selected && current + 1 === examData.length}
                    onClick={() => {
                      if (current + 1 === examData.length) {
                        setShowReviewScreen(true);
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {current + 1 === examData.length ? "End Exam" : "Next"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper elevation={1} sx={{ padding: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Question List
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {examData.map((_, index) => {
                  const status = questionStatus[index];
                  let chipColor = "default";

                  if (index === current) chipColor = "primary";
                  else if (status?.marked) chipColor = "warning";
                  else if (status?.answered) chipColor = "success";

                  return (
                    <Chip
                      key={index}
                      label={`Q${index + 1}`}
                      color={chipColor}
                      onClick={() => {
                        setCurrent(index);
                        setSelected("");
                      }}
                      clickable
                    />
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Quiz;
