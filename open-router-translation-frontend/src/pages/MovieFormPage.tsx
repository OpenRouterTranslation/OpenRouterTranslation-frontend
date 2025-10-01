// pages/MovieForm.tsx
import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { HttpMethod, sendRequest } from "../services/baseService";
import { useNavigate } from "react-router-dom";

interface CreateMovieDto {
  name: string;
  description: string;
  releaseYear: number | "";
}

export function MovieForm() {
  const [form, setForm] = useState<CreateMovieDto>({
    name: "",
    description: "",
    releaseYear: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await sendRequest("/movies", HttpMethod.POST, form);
      if (!response.ok) {
        throw new Error("Failed to create movie");
      }
      const result = await response.json();
      console.log("Movie created:", result);
      navigate("/");
      // optionally reset form
      setForm({ name: "", description: "", releaseYear: "" });
    } catch (error) {
      console.error("Error submitting movie:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 6, maxWidth: 600, margin: "40px auto" }}>
      <Typography variant="h5" mb={3}>
        Create Movie
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
          fullWidth
        />
        <TextField
          label="Release Year"
          name="releaseYear"
          type="number"
          value={form.releaseYear}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Paper>
  );
}
