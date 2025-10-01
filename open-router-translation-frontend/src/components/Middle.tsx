import { Box, CircularProgress, Typography } from "@mui/material";
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
    selectedTranslationId: number;
    selectedMovie: number;
    onSubtitlesChange: (subtitles: Subtitle[]) => void;
    updatedSubtitles?: Subtitle[];
    isTranslating?: boolean; // Add loading prop
}

export const Middle: React.FC<Props> = ({
                                            selectedTranslationId,
                                            selectedMovie,
                                            onSubtitlesChange,
                                            updatedSubtitles,
                                            isTranslating = false, // Add loading prop
                                        }) => {
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

    useEffect(() => {
        const fetchSubtitles = async () => {
            if (selectedMovie === -1) return;

            const response = await sendRequest(
                `/subtitles/${selectedMovie}`,
                HttpMethod.GET,
                null
            );
            const data = await response.json();
            setSubtitles(data);
            onSubtitlesChange(data);
        };
        fetchSubtitles();
    }, [selectedMovie]);

    useEffect(() => {
        if (updatedSubtitles && updatedSubtitles.length > 0) {
            setSubtitles(updatedSubtitles);
        }
    }, [updatedSubtitles]);

    return (
        <Box sx={{ my: 5, position: 'relative' }}>
            <SelectableTextRows subtitles={subtitles} />

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
