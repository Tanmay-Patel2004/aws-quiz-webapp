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
} from "@mui/material";

import examData from "../data/exam-1.json"; // adjust as needed

function Quiz({ isDarkMode, showTimer, timerDuration }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [markQuestion, setMarkQuestion] = useState(false);
  const [questionStatus, setQuestionStatus] = useState(
    examData.map(() => ({ answered: false, marked: false }))
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  const [showReview, setShowReview] = useState(false);
  const question = examData[current];
  const { time, expired } = useTimer(90); // 60 minutes default
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);

  useEffect(() => {
    if (!showTimer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer]);

  useEffect(() => {
    setMarkQuestion(questionStatus[current]?.marked || false);
  }, [current]);

  // Format timer for display
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSubmit = () => {
    // ✅ Update question status before navigating
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
      setReviewMode(true);
    }
  };

  const handlePrevious = () => {
    setCurrent(current - 1);
    setSelected("");
  };

  // Show result screen if test is complete
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

  // Show review screen if requested
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
                  setReviewMode(true);
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
        {/* Timer at top right */}
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
          {/* Main Question Area */}
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              {/* Top Controls */}
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

              {/* Question Text */}
              <Typography variant="h6" gutterBottom>
                {question.question}
              </Typography>

              {/* Options */}
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

              {/* Show Answer */}
              {showAnswer && (
                <Typography variant="subtitle2" color="green" mt={2}>
                  Correct Answer: {question.answer}
                </Typography>
              )}

              {/* Explanation */}
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

              {/* Navigation Buttons */}
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

          {/* Sidebar - Question Palette */}
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
