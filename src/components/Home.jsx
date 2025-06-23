import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  Stack,
  Paper,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

// THEME CONFIGURATION
const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a",
      light: "#3b82f6",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0d9488",
      light: "#14b8a6",
      dark: "#0f766e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "3.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2.5rem", fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
  },
  spacing: 8,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          "&:hover": {
            boxShadow:
              "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});

// Business logic intact: do not change
const exams = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Exam ${i + 1}`,
}));

export default function Home({ onStartExam }) {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {/* HERO SECTION */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: "primary.contrastText",
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
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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
                }}
              >
                Choose from 23 comprehensive practice exams designed to help you
                succeed. Track your progress and identify areas for improvement.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "secondary.dark",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => onStartExam("exam-1.json")}
              >
                Get Started
              </Button>
            </Box>
          </Container>
        </Box>

        {/* STATS SECTION */}
        <Container maxWidth="lg" sx={{ py: 0 }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "grey.50",
                  borderRadius: 3,
                }}
              >
                <AssessmentIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                >
                  23
                </Typography>
                <Typography variant="body1" color="text.secondary">
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
                  bgcolor: "grey.50",
                  borderRadius: 3,
                }}
              >
                <SchoolIcon
                  sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "secondary.main", mb: 1 }}
                >
                  100%
                </Typography>
                <Typography variant="body1" color="text.secondary">
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
                  bgcolor: "grey.50",
                  borderRadius: 3,
                }}
              >
                <QuizIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                >
                  ∞
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Unlimited Attempts
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* PRACTICE EXAMS SECTION */}
        <Container maxWidth="lg" sx={{ py: 6 }} id="practice">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
            >
              Choose Your Practice Exam
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", fontSize: "1.1rem" }}
            >
              Select from our comprehensive collection of practice exams. Each
              exam is carefully crafted to test your knowledge and prepare you
              for success.
            </Typography>
          </Box>

          {/* Business logic intact: do not change - exam mapping and onStartExam prop */}
          <Grid container spacing={3} justifyContent="center">
            {exams.map((exam) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={exam.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
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
                        bgcolor: "primary.main",
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
                          color: "primary.contrastText",
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
                        color: "text.primary",
                      }}
                    >
                      {exam.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      Comprehensive practice exam with detailed explanations and
                      progress tracking.
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => onStartExam(`exam-${exam.id}.json`)} // Business logic intact
                      sx={{
                        mt: "auto",
                        py: 1.5,
                        fontWeight: 600,
                        "&:hover": {
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
            bgcolor: "grey.900",
            color: "grey.100",
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
                  <QuizIcon sx={{ fontSize: 32, color: "primary.light" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.light" }}
                  >
                    Practice Exams
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
                  Your trusted platform for comprehensive exam preparation.
                  Master your skills with our expertly designed practice tests.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Links
                </Typography>
                {/* You can remove or keep Footer links as you like */}
                <Stack spacing={1}>
                  <Typography color="grey.400">
                    © 2024 Practice Exams. All rights reserved.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
