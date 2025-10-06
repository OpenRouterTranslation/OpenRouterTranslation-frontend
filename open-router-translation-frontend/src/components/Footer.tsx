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
    Autocomplete,
    TextField,
} from "@mui/material";
import { useFooter, type Model } from "../hooks/useFooter";
import { useState } from "react";

type Props = {
    setLanguage: (lang: string) => void;
    selectedModel: Model | null;
    setSelectedModel: (model: Model | null) => void;
    handleClickTranslate: () => void;
    handleClickRetranslate?: (beforeCount: number, afterCount: number) => void;
    isTranslating?: boolean;
    hasTranslation?: boolean;
    selectedRowIndex?: number;
};

const LANGUAGES = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Catalan",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Finnish",
    "French",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Korean",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Malayalam",
    "Maltese",
    "Marathi",
    "Mongolian",
    "Nepali",
    "Norwegian",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Welsh",
];

export const Footer: React.FC<Props> = ({
                                            setLanguage,
                                            selectedModel,
                                            setSelectedModel,
                                            handleClickTranslate,
                                            handleClickRetranslate,
                                            isTranslating = false,
                                            hasTranslation = false,
                                            selectedRowIndex = -1,
                                        }) => {
    const { checked, setChecked, models } = useFooter();
    const [beforeCount, setBeforeCount] = useState<number>(2);
    const [afterCount, setAfterCount] = useState<number>(2);

    const canRetranslate = hasTranslation && selectedRowIndex !== -1 && beforeCount >= 0 && afterCount >= 0;

    console.log("Footer retranslate state:", { hasTranslation, selectedRowIndex, beforeCount, afterCount, canRetranslate });

    return (
        <Grid container spacing={2} alignItems="center">
            {/* First Row */}
            <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
                    <Box display="flex" gap={2} alignItems="center">
                        <Typography variant="body1" sx={{ opacity: isTranslating ? 0.5 : 1 }}>
                            Only Free Models
                        </Typography>
                        <Switch
                            name="free-models"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            disabled={isTranslating}
                        />
                    </Box>

                    <FormControl sx={{ flexGrow: 4, opacity: isTranslating ? 0.5 : 1 }} disabled={isTranslating}>
                        <InputLabel id="select-models-label">Select Model</InputLabel>
                        <Select
                            labelId="select-models-label"
                            id="select-models"
                            value={selectedModel?.modelId || ""}
                            onChange={(e) => {
                                const selected = models.find((m) => m.modelId === e.target.value);
                                if (selected) setSelectedModel(selected);
                            }}
                            disabled={isTranslating}
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

                    <Autocomplete
                        sx={{ flexGrow: 2, opacity: isTranslating ? 0.5 : 1 }}
                        options={LANGUAGES}
                        disabled={isTranslating}
                        onChange={(event, value) => {
                            if (value) {
                                setLanguage(value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Language" placeholder="Search language..." />
                        )}
                    />

                    <Button
                        sx={{
                            flexGrow: 1,
                            minWidth: 140,
                            opacity: isTranslating ? 0.7 : 1,
                            transition: "opacity 0.3s ease",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={handleClickTranslate}
                        disabled={isTranslating}
                    >
                        {isTranslating ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={18} color="inherit" />
                                Translating...
                            </Box>
                        ) : (
                            "Translate"
                        )}
                    </Button>
                </Box>
            </Grid>

            {/* Second Row - Retranslate Section (only shown when translation exists) */}
            {hasTranslation && (
                <Grid size={{ xs: 12 }}>
                    <Box display="flex" alignItems="center" gap={2} sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.paper'
                    }}>
                        <Typography variant="body2" sx={{ minWidth: 100 }}>
                            Retranslate Row:
                        </Typography>

                        <TextField
                            type="number"
                            label="Before"
                            value={beforeCount}
                            onChange={(e) => setBeforeCount(Math.max(0, parseInt(e.target.value) || 0))}
                            size="small"
                            sx={{ width: 100 }}
                            disabled={isTranslating}
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            type="number"
                            label="After"
                            value={afterCount}
                            onChange={(e) => setAfterCount(Math.max(0, parseInt(e.target.value) || 0))}
                            size="small"
                            sx={{ width: 100 }}
                            disabled={isTranslating}
                            inputProps={{ min: 0 }}
                        />

                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                            {selectedRowIndex === -1
                                ? "Select a row to retranslate"
                                : `Will retranslate row ${selectedRowIndex + 1} with ${beforeCount} before and ${afterCount} after`}
                        </Typography>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleClickRetranslate?.(beforeCount, afterCount)}
                            disabled={!canRetranslate || isTranslating}
                            sx={{ minWidth: 140 }}
                        >
                            {isTranslating ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CircularProgress size={18} color="inherit" />
                                    Retranslating...
                                </Box>
                            ) : (
                                "Retranslate"
                            )}
                        </Button>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};