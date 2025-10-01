import { Paper } from "@mui/material";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Middle } from "../components/Middle";
import { useState } from "react";
import type { Model } from "../hooks/useFooter";
import type { Subtitle } from "../components/Middle";
import { translateChunks } from "../services/baseService";

export const LandingPage = () => {
    const [selectedMovieId, setSelectedMovieId] = useState<number>(-1);
    const [selectedTranslationId, setSelectedTranslation] = useState<number>(-1);
    const [selectedAiTranslationId, setSelectedAiTranslation] = useState<number>(-1);

    const [language, setLanguage] = useState<string>("en");
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [currentSubtitles, setCurrentSubtitles] = useState<Subtitle[]>([]);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    const handleClickTranslate = async () => {
        console.log("translate chunks");

        // Validation
        if (!selectedModel || !selectedModel.modelId) {
            console.error("No model selected");
            alert("Please select a model first");
            return;
        }

        if (!language) {
            console.error("No language selected");
            alert("Please select a language first");
            return;
        }

        if (currentSubtitles.length === 0) {
            console.error("No subtitles to translate");
            alert("Please upload a subtitle file first");
            return;
        }

        // Get the original subtitle ID from the first subtitle
        const originalId = currentSubtitles[0]?.id;
        if (!originalId) {
            console.error("No original subtitle ID found");
            alert("Please select a valid subtitle file first");
            return;
        }

        // Set loading state
        setIsTranslating(true);

        try {
            // Get all chunks from all subtitles
            const allChunks = currentSubtitles.flatMap(subtitle => subtitle.chunks);

            console.log("Translating", allChunks.length, "chunks to", language, "using model", selectedModel.modelId);
            console.log("Original subtitle ID:", originalId);

            // Call translation API with original ID
            const response = await translateChunks(
                originalId, // Pass the original subtitle ID
                allChunks,
                selectedModel.modelId,
                language,
                10 // batch size
            );

            if (response.ok) {
                const translatedChunks = await response.json();
                console.log("Translation successful", translatedChunks);
                console.log("Translation automatically saved to database");

                // Update the subtitles with translated chunks for immediate display
                const updatedSubtitles = currentSubtitles.map(subtitle => ({
                    ...subtitle,
                    chunks: subtitle.chunks.map(chunk => {
                        // Find corresponding translated chunk by index
                        const translatedChunk = translatedChunks.find((tc: any) => tc.index === chunk.index);
                        return translatedChunk ? {
                            ...chunk,
                            translatedText: translatedChunk.translatedText
                        } : chunk;
                    })
                }));

                setCurrentSubtitles(updatedSubtitles);
                console.log("UI updated with translations");

                // Show success message
                alert(`Translation completed and saved! Translated ${translatedChunks.length} subtitle chunks to ${language}.`);

            } else {
                console.error("Translation failed", response.status);
                const errorText = await response.text();
                console.error("Error details:", errorText);
                alert("Translation failed. Please check the console for details and try again.");
            }
        } catch (error) {
            console.error("Translation error:", error);
            alert("Translation error. Please check your connection and try again.");
        } finally {
            // Always clear loading state
            setIsTranslating(false);
        }
    };

    // Function to handle subtitles change from Middle component
    const handleSubtitlesChange = (subtitles: Subtitle[]) => {
        console.log("Received subtitles from Middle:", subtitles.length);
        if (subtitles.length > 0) {
            console.log("First subtitle ID:", subtitles[0].id);
        }
        setCurrentSubtitles(subtitles);
    };

    return (
        <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
            <Header
                setSelectedTranslation={setSelectedTranslation}
                selectedMovie={selectedMovieId}
                setSelectedMovie={setSelectedMovieId}
                setSelectedAiTranslation={setSelectedAiTranslation}
            />
            <Middle
                selectedTranslationId={selectedTranslationId}
                selectedMovie={selectedMovieId}
                onSubtitlesChange={handleSubtitlesChange}
                updatedSubtitles={currentSubtitles}
                isTranslating={isTranslating}
            />
            <Footer
                setLanguage={setLanguage}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                handleClickTranslate={handleClickTranslate}
                isTranslating={isTranslating}
            />
        </Paper>
    );
};
