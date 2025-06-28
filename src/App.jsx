import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Home from "./components/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  IconButton,
  Switch,
  Menu,
  MenuItem,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Divider,
  Fade,
  alpha,
} from "@mui/material";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load from localStorage
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExamFile, setSelectedExamFile] = useState(() => {
    return localStorage.getItem("selectedExamFile") || null;
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
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
        default: darkMode ? "#121212" : "#f8fafc",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
        secondary: darkMode ? "#bbbbbb" : "#555555",
      },
      grey: {
        50: darkMode ? "#2d2d2d" : "#f8fafc",
        100: darkMode ? "#3d3d3d" : "#f1f5f9",
        200: darkMode ? "#4d4d4d" : "#e2e8f0",
        300: darkMode ? "#5d5d5d" : "#cbd5e1",
        400: darkMode ? "#6d6d6d" : "#94a3b8",
        500: darkMode ? "#7d7d7d" : "#64748b",
        600: darkMode ? "#8d8d8d" : "#475569",
        700: darkMode ? "#9d9d9d" : "#334155",
        800: darkMode ? "#adadad" : "#1e293b",
        900: darkMode ? "#bdbdbd" : "#0f172a",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    transitions: { duration: { standard: 300 } },
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

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartExam = (filename) => {
    setSelectedExamFile(filename);
  };

  // Sync darkMode and selectedExamFile to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (selectedExamFile) {
      localStorage.setItem("selectedExamFile", selectedExamFile);
    } else {
      localStorage.removeItem("selectedExamFile");
    }
  }, [darkMode, selectedExamFile]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            onClick={() => {
              if (selectedExamFile) {
                localStorage.removeItem(`quizState_${selectedExamFile}`);
              }
              setSelectedExamFile(null);
              window.location.href = "/";
            }}
            sx={{
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              cursor: "pointer",
            }}
          >
            AWS Exam Practice App
          </Typography>
          <IconButton
            onClick={handleSettingsClick}
            aria-label="Open settings menu"
            sx={{
              color: theme.palette.primary.contrastText,
              transition: theme.transitions.create(
                ["background-color", "transform"],
                {
                  duration: theme.transitions.duration.standard,
                }
              ),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
              "&:focus-visible": {
                outline: `2px solid ${theme.palette.primary.contrastText}`,
                outlineOffset: "2px",
              },
              transform: Boolean(anchorEl) ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="0g"
        sx={{
          py: 0,
          px: 0,
          minHeight: "calc(100vh - 64px)",
        }}
        disableGutters
      >
        <Fade
          in={true}
          timeout={{ enter: 500, exit: 300 }}
          key={selectedExamFile ? "quiz" : "home"}
        >
          <Box>
            {selectedExamFile ? (
              <Quiz
                darkMode={darkMode}
                examFile={selectedExamFile}
                onQuit={() => setSelectedExamFile(null)}
              />
            ) : (
              <Home darkMode={darkMode} onStartExam={handleStartExam} />
            )}
          </Box>
        </Fade>
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 240,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
        MenuListProps={{
          "aria-labelledby": "settings-button",
          sx: { py: 1 },
        }}
      >
        <MenuItem disabled sx={{ cursor: "default" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Preferences
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
        <MenuItem
          onClick={() => {
            setDarkMode(!darkMode);
            handleClose();
          }}
          sx={{
            py: 1.5,
            "&:focus-visible": {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: "-2px",
            },
          }}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ mr: 2, color: theme.palette.text.primary }}
            >
              Dark Mode
            </Typography>
            <Switch
              checked={darkMode}
              size="small"
              sx={{
                transition: theme.transitions.create("all", {
                  duration: theme.transitions.duration.standard,
                }),
                "& .MuiSwitch-thumb": {
                  bgcolor: darkMode
                    ? theme.palette.grey[300]
                    : theme.palette.grey[700],
                },
                "& .MuiSwitch-track": {
                  bgcolor: darkMode
                    ? theme.palette.grey[600]
                    : theme.palette.grey[400],
                },
              }}
              inputProps={{ "aria-label": "Toggle dark mode" }}
            />
          </Box>
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
}

export default App;
