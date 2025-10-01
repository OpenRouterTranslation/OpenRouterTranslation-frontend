import {
  Grid,
  Box,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFooter, type Model } from "../hooks/useFooter";

type Props = {
  setLanguage: (lang: string) => void;
  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;
  handleClickTranslate: () => void;
  isTranslating?: boolean; // Add the loading prop
};

export const Footer: React.FC<Props> = ({
                                          setLanguage,
                                          selectedModel,
                                          setSelectedModel,
                                          handleClickTranslate,
                                          isTranslating = false // Add the loading prop with default
                                        }) => {
  const { checked, setChecked, models } = useFooter();

  return (
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
        >
          <Box display={"flex"} gap={4}>
            <Typography
                variant="body1"
                sx={{ opacity: isTranslating ? 0.5 : 1 }} // Dim when translating
            >
              Only Free Models
            </Typography>
            <Switch
                name="free-models"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                disabled={isTranslating} // Disable when translating
            />
          </Box>

          <FormControl
              sx={{
                flexGrow: 4,
                opacity: isTranslating ? 0.5 : 1 // Dim when translating
              }}
              disabled={isTranslating} // Disable when translating
          >
            <InputLabel id="select-models-label">Select Model</InputLabel>
            <Select
                labelId="select-models-label"
                id="select-models"
                value={selectedModel?.modelId || ""}
                onChange={(e) => {
                  const selected = models.find((m) => m.modelId === e.target.value);
                  if (selected) setSelectedModel(selected);
                }}
                disabled={isTranslating} // Disable when translating
            >
              <MenuItem value="" disabled>
                Select Model
              </MenuItem>
              {models.map((model) => (
                  <MenuItem key={model.modelId} value={model.modelId}>
                    {model.modelId}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Language Selector */}
          <FormControl
              sx={{
                flexGrow: 2,
                opacity: isTranslating ? 0.5 : 1 // Dim when translating
              }}
              disabled={isTranslating} // Disable when translating
          >
            <InputLabel id="select-language-label">Language</InputLabel>
            <Select
                labelId="select-language-label"
                id="select-language"
                onChange={(e) => setLanguage(e.target.value as string)}
                disabled={isTranslating} // Disable when translating
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="sr">Serbian</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="it">Italian</MenuItem>
            </Select>
          </FormControl>

          {/* Translate Again Button */}
          <Button
              sx={{
                flexGrow: 1,
                minWidth: 140, // Ensure consistent width
                opacity: isTranslating ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }}
              variant="contained"
              color="primary"
              onClick={handleClickTranslate}
              disabled={isTranslating} // Disable when translating
          >
            {isTranslating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  Translating...
                </Box>
            ) : (
                'Translate Again'
            )}
          </Button>
        </Box>
      </Grid>
  );
};
