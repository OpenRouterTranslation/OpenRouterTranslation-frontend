import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { HttpMethod, sendRequest } from "../services/baseService";
import SelectableTextRows from "./SelectableTextRows";

type chunk = {
    index: number;
    startTime: string;
    endTime: string;
    originalText: string;
    translatedText: string;
};

export type Subtitle = {
    id: number;
    chunks: chunk[];
};

interface Props {
    selectedOriginalId: number;
    selectedAiTranslationId: number;
    onSubtitlesChange: (subtitles: Subtitle[]) => void;
    updatedSubtitles?: Subtitle[];
    isTranslating?: boolean;
    hasUnsavedTranslation?: boolean;
    onSaveTranslation?: () => void;
    currentLanguage?: string;
    onSelectRow?: (index: number) => void;
    selectedRowIndex?: number;
}

export const Middle: React.FC<Props> = ({
                                            selectedOriginalId,
                                            selectedAiTranslationId,
                                            onSubtitlesChange,
                                            updatedSubtitles,
                                            isTranslating = false,
                                            hasUnsavedTranslation = false,
                                            onSaveTranslation,
                                            currentLanguage = "unknown",
<<<<<<< HEAD
                                            onSelectRow,
                                            selectedRowIndex,
=======
>>>>>>> 6ce1fe9452ef126bfb3ef1e6e56699f20f7836ad
                                        }) => {
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [translationName, setTranslationName] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubtitles = async () => {
            if (selectedOriginalId === -1) {
                setSubtitles([]);
                onSubtitlesChange([]);
                return;
            }

            let queryParams = `?originalId=${selectedOriginalId}`;
            if (selectedAiTranslationId !== -1) {
                queryParams += `&translatedId=${selectedAiTranslationId}`;
            }

            const response = await sendRequest(
                `/subtitles-display${queryParams}`,
                HttpMethod.GET,
                null
            );
            const data = await response.json();

            const wrappedData = [{
                id: selectedOriginalId,
                chunks: data
            }];

            setSubtitles(wrappedData);
            onSubtitlesChange(wrappedData);
        };
        fetchSubtitles();
    }, [selectedOriginalId, selectedAiTranslationId]);

    useEffect(() => {
        if (updatedSubtitles && updatedSubtitles.length > 0) {
            setSubtitles(updatedSubtitles);
        }
    }, [updatedSubtitles]);

    const handleSaveTranslation = async () => {
        if (!translationName.trim()) {
            alert("Please enter a name for the translation");
            return;
        }

        if (subtitles.length === 0 || !subtitles[0].chunks) {
            alert("No translation data to save");
            return;
        }

        setIsSaving(true);

        try {
            const requestBody = {
                originalId: selectedOriginalId,
                name: translationName,
                subtitleChunks: subtitles[0].chunks,
                language: currentLanguage,
            };

            console.log("Sending save request with body:", requestBody);

            const response = await sendRequest(
                "/subtitles/save/translated",
                HttpMethod.POST,
                requestBody
            );

            if (response.ok) {
                const savedTranslation = await response.json();
                alert("Translation saved successfully!");
                setTranslationName("");
                if (onSaveTranslation) {
                    onSaveTranslation();
                }
            } else {
                const errorText = await response.text();
                console.error("Failed to save translation:", errorText);
                alert("Failed to save translation");
            }
        } catch (error) {
            console.error("Error saving translation:", error);
            alert("Error saving translation");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ my: 5, position: 'relative' }}>
            <SelectableTextRows
                subtitles={subtitles}
                onSelectRow={onSelectRow}
                selectedRowIndex={selectedRowIndex}
            />

            {/* Save Translation Section */}
            {hasUnsavedTranslation && (
                <Box sx={{
                    mt: 3,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Save Translation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Translation Name"
                            value={translationName}
                            onChange={(e) => setTranslationName(e.target.value)}
                            placeholder={`${currentLanguage} - Version 1`}
                            fullWidth
                            disabled={isSaving}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSaveTranslation}
                            disabled={isSaving || !translationName.trim()}
                            sx={{ minWidth: 120 }}
                        >
                            {isSaving ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Save Translation Section */}
            {hasUnsavedTranslation && (
                <Box sx={{
                    mt: 3,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Save Translation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Translation Name"
                            value={translationName}
                            onChange={(e) => setTranslationName(e.target.value)}
                            placeholder={`${currentLanguage} - Version 1`}
                            fullWidth
                            disabled={isSaving}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSaveTranslation}
                            disabled={isSaving || !translationName.trim()}
                            sx={{ minWidth: 120 }}
                        >
                            {isSaving ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Loading Overlay */}
            {isTranslating && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1000,
                        borderRadius: 1,
                    }}
                >
                    <CircularProgress size={60} sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Translating subtitles...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This may take a few moments depending on the number of subtitles
                    </Typography>
                </Box>
            )}
        </Box>
    );
};