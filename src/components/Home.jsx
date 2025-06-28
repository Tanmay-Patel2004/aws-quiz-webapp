import React, { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

// Business logic intact: do not change
const exams = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Exam ${i + 1}`,
}));

export default function Home({ darkMode, onStartExam }) {
  const practiceRef = useRef(null);
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: darkMode ? "#121212" : "background.default",
        color: darkMode ? "#ffffff" : "text.primary",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${
            darkMode ? "#1e3a8a" : theme.palette.primary.main
          } 0%, ${darkMode ? "#3b82f6" : theme.palette.primary.light} 100%)`,
          color: darkMode ? "#ffffff" : theme.palette.primary.contrastText,

          py: { xs: 0, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${
              darkMode ? "%23ffffff" : "%23000000"
            }' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, px: 0 }}
        >
          <Box textAlign="center" sx={{ maxWidth: 800, mx: "auto" }}>
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                color: darkMode ? "#ffffff" : "inherit",
              }}
            >
              Master Your Skills with
              <br />
              Practice Exams
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                opacity: 0.9,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 400,
                lineHeight: 1.6,
                color: darkMode ? "#bbbbbb" : "inherit",
              }}
            >
              Choose from 23 comprehensive practice exams designed to help you
              succeed. Track your progress and identify areas for improvement.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: darkMode ? "#0f766e" : "secondary.main",
                color: darkMode ? "#ffffff" : "secondary.contrastText",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: darkMode ? "#0d9488" : "secondary.dark",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => {
                practiceRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* STATS SECTION */}
      <Container maxWidth="lg" sx={{ py: 0, mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: darkMode ? "#2d2d2d" : "grey.50",
                borderRadius: 3,
                color: darkMode ? "#ffffff" : "inherit",
              }}
            >
              <AssessmentIcon
                sx={{
                  fontSize: 48,
                  color: darkMode ? "#3b82f6" : "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: darkMode ? "#3b82f6" : "primary.main",
                  mb: 1,
                }}
              >
                23
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "#bbbbbb" : "text.secondary"}
              >
                Practice Exams
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: darkMode ? "#2d2d2d" : "grey.50",
                borderRadius: 3,
                color: darkMode ? "#ffffff" : "inherit",
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 48,
                  color: darkMode ? "#14b8a6" : "secondary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: darkMode ? "#14b8a6" : "secondary.main",
                  mb: 1,
                }}
              >
                100%
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "#bbbbbb" : "text.secondary"}
              >
                Success Rate
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: darkMode ? "#2d2d2d" : "grey.50",
                borderRadius: 3,
                color: darkMode ? "#ffffff" : "inherit",
              }}
            >
              <QuizIcon
                sx={{
                  fontSize: 48,
                  color: darkMode ? "#3b82f6" : "primary.main",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: darkMode ? "#3b82f6" : "primary.main",
                  mb: 1,
                }}
              >
                ∞
              </Typography>
              <Typography
                variant="body1"
                color={darkMode ? "#bbbbbb" : "text.secondary"}
              >
                Unlimited Attempts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* PRACTICE EXAMS SECTION */}
      <Container maxWidth="lg" sx={{ py: 6 }} id="practice" ref={practiceRef}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: darkMode ? "#ffffff" : "text.primary",
            }}
          >
            Choose Your Practice Exam
          </Typography>
          <Typography
            variant="body1"
            color={darkMode ? "#bbbbbb" : "text.secondary"}
            sx={{ maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
          >
            Select from our comprehensive collection of practice exams. Each
            exam is carefully crafted to test your knowledge and prepare you for
            success.
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={exam.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  bgcolor: darkMode ? "#2d2d2d" : "background.paper",
                  color: darkMode ? "#ffffff" : "text.primary",
                  "&:hover": {
                    "& .exam-number": {
                      transform: "scale(1.1)",
                    },
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box
                    className="exam-number"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: darkMode ? "#1e40af" : "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      transition: "transform 0.2s ease-in-out",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: darkMode ? "#ffffff" : "primary.contrastText",
                        fontWeight: 700,
                      }}
                    >
                      {exam.id}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: darkMode ? "#ffffff" : "text.primary",
                    }}
                  >
                    {exam.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={darkMode ? "#bbbbbb" : "text.secondary"}
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    Comprehensive practice exam with detailed explanations and
                    progress tracking.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => onStartExam(`exam-${exam.id}.json`)}
                    sx={{
                      mt: "auto",
                      py: 1.5,
                      fontWeight: 600,
                      bgcolor: darkMode ? "#0f766e" : "secondary.main",
                      color: darkMode ? "#ffffff" : "secondary.contrastText",
                      "&:hover": {
                        bgcolor: darkMode ? "#0d9488" : "secondary.dark",
                        transform: "translateY(-1px)",
                      },
                    }}
                    aria-label={`Start ${exam.name}`}
                  >
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          bgcolor: darkMode ? "#1e1e1e" : "grey.900",
          color: darkMode ? "#bbbbbb" : "grey.100",
          py: 6,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <QuizIcon
                  sx={{
                    fontSize: 32,
                    color: darkMode ? "#3b82f6" : "primary.light",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: darkMode ? "#3b82f6" : "primary.light",
                  }}
                >
                  Practice Exams
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: darkMode ? "#bbbbbb" : "grey.400", mb: 2 }}
              >
                Your trusted platform for comprehensive exam preparation. Master
                your skills with our expertly designed practice tests.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: darkMode ? "#ffffff" : "inherit",
                }}
              >
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Typography color={darkMode ? "#bbbbbb" : "grey.400"}>
                  © 2024 Practice Exams. All rights reserved.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
