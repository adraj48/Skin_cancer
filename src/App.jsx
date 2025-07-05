import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  Stack,
} from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setResult({ error: "Please select an image file." });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
    // Updated backend URL to port 8080
    const response = await fetch(" https://8d10-2405-201-a407-839-f0e4-2aaa-57c5-ff15.ngrok-free.app", {
      method: "POST",
      body: formData,
    });
      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Error connecting to backend." });
    }
    setLoading(false);
  };

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f6f8fa"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 420, width: "100%" }}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" color="primary" fontWeight={700}>
            Skin Cancer Classifier
          </Typography>
          <Typography align="center" color="text.secondary">
            Upload a skin lesion image to predict if it's <b>benign</b> or <b>malignant</b>.
          </Typography>
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ mb: 2 }}
            >
              {file ? "Change Image" : "Select Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                disabled={loading}
              />
            </Button>
            <br />
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading || !file}
              sx={{ mt: 1, width: "60%" }}
            >
              {loading ? "Predicting..." : "Predict"}
            </Button>
          </form>
          {loading && <LinearProgress />}
          {preview && (
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 220,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  marginBottom: 8,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Preview
              </Typography>
            </Box>
          )}
          {result && (
            <Box mt={2}>
              {result.error ? (
                <Alert severity="error">{result.error}</Alert>
              ) : (
                <Alert
                  severity={result.result === "malignant" ? "error" : "success"}
                  sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                >
                  Result: {result.result.toUpperCase()} <br />
                  Probability: {Number(result.probability).toFixed(4)}
                </Alert>
              )}
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;

