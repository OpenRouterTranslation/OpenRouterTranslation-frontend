import styled from '@emotion/styled';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import { useHeader } from '../hooks/useHeader';
import { Link } from 'react-router-dom';
import { MovieDetails } from './MovieDetails';
import ApiKeyManager from './ApiKeyManager';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface HeaderProps {
  setSelectedOriginalId: React.Dispatch<React.SetStateAction<number>>;
  selectedMovie: number;
  setSelectedMovie: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAiTranslation: React.Dispatch<React.SetStateAction<number>>;
  selectedOriginalId: number;
  selectedAiTranslationId: number;
  onMovieDeleted?: () => void;
  onOriginalDeleted?: () => void;
  onTranslationDeleted?: () => void;
  translationsRefreshTrigger?: number;
}

export const Header: React.FC<HeaderProps> = ({
                                                setSelectedOriginalId,
                                                selectedMovie,
                                                setSelectedMovie,
                                                setSelectedAiTranslation,
                                                selectedOriginalId,
                                                selectedAiTranslationId,
                                                onMovieDeleted,
                                                onOriginalDeleted,
                                                onTranslationDeleted,
                                                translationsRefreshTrigger = 0,
                                              }) => {
  const {
    onMovieChange,
    originalSubtitles,
    handleOriginalSubtitleChange,
    hangleUploadFile,
    movieOptions,
    aiTranslations,
    handleAiTranslationChange,
    movieDetails,
    handleDeleteMovie,
    handleDeleteOriginal,
    handleDeleteTranslation,
  } = useHeader(
      setSelectedOriginalId,
      setSelectedMovie,
      selectedMovie,
      setSelectedAiTranslation,
      translationsRefreshTrigger
  );

  const handleMovieDelete = async (movieId: number) => {
    await handleDeleteMovie(movieId);
    onMovieDeleted?.();
  };

  const handleOriginalDelete = async (originalId: number) => {
    await handleDeleteOriginal(originalId);
    onOriginalDeleted?.();
  };

  const handleTranslationDelete = async (translationId: number) => {
    await handleDeleteTranslation(translationId);
    onTranslationDeleted?.();
  };

  return (
      <Box sx={{ flexGrow: 1, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Movie Details */}
          <Grid size={{ xs: 12, md: 2.5 }}>
            {movieDetails ? (
                <MovieDetails movie={movieDetails} />
            ) : (
                <Typography variant="h5">Select a movie</Typography>
            )}
          </Grid>

          {/* Movie Select */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel id="movie-select-label">Movie</InputLabel>
                <Select
                    labelId="movie-select-label"
                    id="movie-select"
                    onChange={onMovieChange}
                    value={selectedMovie === -1 ? '' : selectedMovie}
                >
                  <MenuItem value="" disabled>
                    Select a movie
                  </MenuItem>
                  {movieOptions.map((m: any) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedMovie !== -1 && (
                  <IconButton
                      color="error"
                      onClick={() => handleMovieDelete(selectedMovie)}
                      sx={{ flexShrink: 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
              )}
            </Box>
          </Grid>

          {/* Original Subtitle Select */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel id="original-subtitle-label">
                  Original Subtitles
                </InputLabel>
                <Select
                    labelId="original-subtitle-label"
                    id="original-subtitle-select"
                    disabled={selectedMovie === -1}
                    onChange={handleOriginalSubtitleChange}
                    value={selectedOriginalId === -1 ? '' : selectedOriginalId}
                >
                  <MenuItem value="" disabled>
                    Select original subtitle
                  </MenuItem>
                  {originalSubtitles?.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.itemName || `Original ${sub.id}`}
                      </MenuItem>
                  )) || []}
                </Select>
              </FormControl>
              {selectedOriginalId !== -1 && (
                  <IconButton
                      color="error"
                      onClick={() => handleOriginalDelete(selectedOriginalId)}
                      sx={{ flexShrink: 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
              )}
            </Box>
          </Grid>

          {/* AI Translation Select */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel id="ai-translation-label">AI Translations</InputLabel>
                <Select
                    labelId="ai-translation-label"
                    id="ai-translation-select"
                    disabled={originalSubtitles.length === 0}
                    onChange={handleAiTranslationChange}
                    value={selectedAiTranslationId === -1 ? '' : selectedAiTranslationId}
                >
                  <MenuItem value={-1}>None (show original only)</MenuItem>
                  {aiTranslations?.map((translation) => (
                      <MenuItem key={translation.id} value={translation.id}>
                        {translation.itemName}
                      </MenuItem>
                  )) || []}
                </Select>
              </FormControl>
              {selectedAiTranslationId !== -1 && (
                  <IconButton
                      color="error"
                      onClick={() => handleTranslationDelete(selectedAiTranslationId)}
                      sx={{ flexShrink: 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
              )}
            </Box>
          </Grid>

          {/* Action Buttons + API Key Manager */}
          <Grid size={{ xs: 12, md: 3.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                  component={Link}
                  to="/create"
                  variant="contained"
                  sx={{ flexGrow: 1, minWidth: 120 }}
              >
                Create Movie
              </Button>

              <Button
                  component="label"
                  variant="contained"
                  disabled={selectedMovie === -1}
                  sx={{ flexGrow: 1, minWidth: 120 }}
              >
                Upload Files
                <VisuallyHiddenInput
                    type="file"
                    onChange={hangleUploadFile}
                    accept=".srt"
                />
              </Button>

              <ApiKeyManager />
            </Box>
          </Grid>
        </Grid>
      </Box>
  );
};