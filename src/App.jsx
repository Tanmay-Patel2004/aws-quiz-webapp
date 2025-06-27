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
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExamFile, setSelectedExamFile] = useState(() => {
    return localStorage.getItem("selectedExamFile") || null;
  });

  const lightTheme = createTheme({
    palette: { mode: "light" },
    transitions: { duration: { standard: 300 } },
  });

  const darkTheme = createTheme({
    palette: { mode: "dark" },
    transitions: { duration: { standard: 300 } },
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

  // Sync back to localStorage whenever it changes
  useEffect(() => {
    if (selectedExamFile) {
      localStorage.setItem("selectedExamFile", selectedExamFile);
    } else {
      localStorage.removeItem("selectedExamFile");
    }
  }, [selectedExamFile]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          boxShadow: (theme) => theme.shadows[2],
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
                localStorage.removeItem(`quizState_${selectedExamFile}`); // Clear quiz state for the selected exam
              }
              setSelectedExamFile(null); // Clear selected exam to trigger Quiz reset
              window.location.href = "/"; // Navigate to homepage
            }}
            sx={{
              color: (theme) => theme.palette.primary.contrastText,
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
              color: (theme) => theme.palette.primary.contrastText,
              transition: (theme) =>
                theme.transitions.create(["background-color", "transform"], {
                  duration: theme.transitions.duration.standard,
                }),
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.common.white, 0.1),
              },
              "&:focus-visible": {
                outline: (theme) =>
                  `2px solid ${theme.palette.primary.contrastText}`,
                outlineOffset: "2px",
              },
              transform: Boolean(anchorEl) ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content Container */}
      <Container
        maxWidth="0g"
        sx={{
          py: 0,
          px: 0,
          minHeight: "calc(100vh - 64px)", // Account for AppBar height
        }}
        disableGutters
      >
        <Fade
          in={true}
          timeout={{ enter: 500, exit: 300 }}
          key={selectedExamFile ? "quiz" : "home"} // retriggers on switch
        >
          <Box>
            {selectedExamFile ? (
              <Quiz
                darkMode={darkMode}
                examFile={selectedExamFile}
                onQuit={() => setSelectedExamFile(null)}
              />
            ) : (
              <Home onStartExam={handleStartExam} />
            )}
          </Box>
        </Fade>
      </Container>

      {/* Preferences Menu */}
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
            boxShadow: (theme) => theme.shadows[8],
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
            sx={{
              fontWeight: 600,
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Preferences
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={() => {
            setDarkMode(!darkMode);
            handleClose();
          }}
          sx={{
            py: 1.5,
            "&:focus-visible": {
              outline: (theme) => `2px solid ${theme.palette.primary.main}`,
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
            <Typography variant="body2" sx={{ mr: 2 }}>
              Dark Mode
            </Typography>
            <Switch
              checked={darkMode}
              size="small"
              sx={{
                transition: (theme) =>
                  theme.transitions.create("all", {
                    duration: theme.transitions.duration.standard,
                  }),
                "& .MuiSwitch-thumb": {
                  transition: (theme) =>
                    theme.transitions.create("all", {
                      duration: theme.transitions.duration.standard,
                    }),
                },
                "& .MuiSwitch-track": {
                  transition: (theme) =>
                    theme.transitions.create("all", {
                      duration: theme.transitions.duration.standard,
                    }),
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
