// App.jsx
import React, { useState } from "react";
import Quiz from "./components/Quiz";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor

  const lightTheme = createTheme({
    palette: { mode: "light" },
  });

  const darkTheme = createTheme({
    palette: { mode: "dark" },
  });

  // Handle opening the menu
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h5">AWS Exam Practice App</Typography>
        <IconButton onClick={handleSettingsClick}>
          <SettingsIcon sx={{ color: darkMode ? "white" : "black" }} />
        </IconButton>
      </Box>

      <Quiz darkMode={darkMode} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => {
                  setDarkMode(!darkMode);
                  handleClose(); // Close menu after toggling
                }}
              />
            }
            label="Dark Mode"
          />
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
}

export default App;
