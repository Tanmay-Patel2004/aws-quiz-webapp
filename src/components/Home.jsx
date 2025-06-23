import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

const exams = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Exam ${i + 1}`,
}));

export default function Home({ onStartExam }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Select a Practice Exam
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {exams.map((exam) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={exam.id}>
            <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {exam.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => onStartExam(`exam-${exam.id}.json`)}
                >
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
