import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useHeader } from "../hooks/useHeader";
import { Link } from "react-router-dom";

const options = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface HeaderProps {
  setSelectedTranslation: React.Dispatch<React.SetStateAction<number>>;
  selectedMovie: number;
  setSelectedMovie: React.Dispatch<React.SetStateAction<number>>;
}

export const Header: React.FC<HeaderProps> = ({ setSelectedTranslation, selectedMovie, setSelectedMovie }) => {
  const {
    onMovieChange,
    translations,
    handleTranslationChange,
    hangleUploadFile,
    movieOptions,
  } = useHeader(setSelectedTranslation, setSelectedMovie, selectedMovie);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={6} alignItems="center">
        {/* Create Movie Button */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Button component={Link} to="/create" variant="contained" fullWidth>
            Create Movie
          </Button>
        </Grid>

        {/* Movie Select */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="movie-select-label">Movie</InputLabel>
            <Select
              labelId="movie-select-label"
              id="movie-select"
              onChange={onMovieChange}
            >
              {movieOptions.map((m: any) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Translation Select */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="translation-select-label">Translation</InputLabel>
            <Select
              labelId="translation-select-label"
              id="translation-select"
              disabled={selectedMovie < 0}
              onChange={handleTranslationChange}
            >
              {translations.map((opt: any) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.translatedSrtText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Upload Button */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Button component="label" variant="contained" fullWidth>
            Upload Files
            <VisuallyHiddenInput
              type="file"
              onChange={hangleUploadFile}
              multiple
            />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
