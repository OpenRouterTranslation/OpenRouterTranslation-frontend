import { Paper } from "@mui/material";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import type { Subtitle } from "../components/Middle";
import { Middle } from "../components/Middle";
import type { Model } from "../hooks/useFooter";
import { translateChunks } from "../services/baseService";

export const LandingPage = () => {
    const [selectedMovieId, setSelectedMovieId] = useState<number>(-1);
    const [selectedOriginalId, setSelectedOriginalId] = useState<number>(-1);
    const [selectedAiTranslationId, setSelectedAiTranslation] = useState<number>(-1);

    const [language, setLanguage] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    const [fetchedSubtitles, setFetchedSubtitles] = useState<Subtitle[]>([]);
    const [newTranslation, setNewTranslation] = useState<Subtitle[]>([]);

    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [hasUnsavedTranslation, setHasUnsavedTranslation] = useState<boolean>(false);

    const [translationsRefreshTrigger, setTranslationsRefreshTrigger] = useState<number>(0);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

    const currentSubtitles = hasUnsavedTranslation && newTranslation.length > 0 ? newTranslation : fetchedSubtitles;
    const hasTranslation = currentSubtitles.length > 0 && currentSubtitles[0].chunks.some(c => c.translatedText);
    

    const handleClickRetranslate = async (beforeCount: number, afterCount: number) => {
        if (!selectedModel || !selectedModel.modelId) {
            alert("Please select a model first");
            return;
        }

        if (!language) {
            alert("Please select a language first");
            return;
        }

        if (selectedRowIndex === -1) {
            alert("Please select a row to retranslate");
            return;
        }

        const currentSubs = hasUnsavedTranslation && newTranslation.length > 0 ? newTranslation : fetchedSubtitles;

        if (currentSubs.length === 0 || !currentSubs[0].chunks) {
            alert("No subtitle chunks available");
            return;
        }

        setIsTranslating(true);

        try {
            const allChunks = currentSubs[0].chunks;
            const startIndex = Math.max(0, selectedRowIndex - beforeCount);
            const endIndex = Math.min(allChunks.length - 1, selectedRowIndex + afterCount);

            const chunksToTranslate = allChunks.slice(startIndex, endIndex + 1);

            console.log(`Retranslating rows ${startIndex + 1} to ${endIndex + 1} (${chunksToTranslate.length} chunks)`);

            const response = await translateChunks(
                selectedOriginalId,
                chunksToTranslate,
                selectedModel.modelId,
                language,
                chunksToTranslate.length
            );

            if (response.ok) {
                const translatedChunks = await response.json();
                console.log("Retranslation successful", translatedChunks);

                const updatedChunks = [...allChunks];
                translatedChunks.forEach((chunk: any, idx: number) => {
                    const originalIndex = startIndex + idx;
                    updatedChunks[originalIndex] = chunk;
                });

                const updatedSubtitles = [{
                    id: selectedOriginalId,
                    chunks: updatedChunks
                }];

                setNewTranslation(updatedSubtitles);
                setHasUnsavedTranslation(true);

                alert(`Successfully retranslated rows ${startIndex + 1} to ${endIndex + 1}`);
            } else {
                const errorText = await response.text();
                console.error("Retranslation failed:", errorText);
                alert("Retranslation failed. Please check the console for details.");
            }
        } catch (error: any) {
            console.error("Retranslation error:", error);
            if (error.message && error.message.includes('No API key')) {
                alert("No API key found. Please set your OpenRouter API key in the settings (gear icon).");
            } else {
                alert("Retranslation error. Please check your connection and try again.");
            }
        } finally {
            setIsTranslating(false);
        }
    };

    const handleClickTranslate = async () => {
        if (!selectedModel || !selectedModel.modelId) {
            alert("Please select a model first");
            return;
        }

        if (!language) {
            alert("Please select a language first");
            return;
        }

        if (selectedOriginalId === -1) {
            alert("Please select an original subtitle first");
            return;
        }

        if (fetchedSubtitles.length === 0 || !fetchedSubtitles[0].chunks) {
            alert("No subtitle chunks to translate");
            return;
        }

        setIsTranslating(true);
        setHasUnsavedTranslation(false);

        try {
            const allChunks = fetchedSubtitles[0].chunks;

            console.log("Translating", allChunks.length, "chunks to", language, "using model", selectedModel.modelId);

            const response = await translateChunks(
                selectedOriginalId,
                allChunks,
                selectedModel.modelId,
                language,
                10
            );

            if (response.ok) {
                const translatedChunks = await response.json();
                console.log("Translation successful", translatedChunks);

                const updatedSubtitles = [{
                    id: selectedOriginalId,
                    chunks: translatedChunks
                }];

                setNewTranslation(updatedSubtitles);
                setHasUnsavedTranslation(true);

                alert(`Translation completed! ${translatedChunks.length} subtitle chunks translated to ${language}.`);
            } else {
                const errorText = await response.text();
                console.error("Translation failed:", errorText);
                alert("Translation failed. Please check the console for details.");
            }
        } catch (error: any) {
            console.error("Translation error:", error);
            if (error.message && error.message.includes('No API key')) {
                alert("No API key found. Please set your OpenRouter API key in the settings (gear icon).");
            } else {
                alert("Translation error. Please check your connection and try again.");
            }
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubtitlesChange = (subtitles: Subtitle[]) => {
        setFetchedSubtitles(subtitles);
        setNewTranslation([]);
        setHasUnsavedTranslation(false);
        setSelectedRowIndex(-1);
    };

    const handleSelectRow = (index: number) => {
        console.log("Row selected in LandingPage:", index);
        setSelectedRowIndex(index);
    };

    const handleSaveTranslation = () => {
        setHasUnsavedTranslation(false);
        setNewTranslation([]);
        setTranslationsRefreshTrigger(prev => prev + 1);
    };

    const handleMovieDeleted = () => {
        setFetchedSubtitles([]);
        setNewTranslation([]);
        setHasUnsavedTranslation(false);
        setSelectedMovieId(-1);
        setSelectedOriginalId(-1);
        setSelectedAiTranslation(-1);
    };

    const handleOriginalDeleted = () => {
        setFetchedSubtitles([]);
        setNewTranslation([]);
        setHasUnsavedTranslation(false);
        setSelectedOriginalId(-1);
        setSelectedAiTranslation(-1);
    };

    const handleTranslationDeleted = () => {
        setFetchedSubtitles([]);
        setNewTranslation([]);
        setHasUnsavedTranslation(false);
        setSelectedAiTranslation(-1);
    };

    const displaySubtitles = hasUnsavedTranslation && newTranslation.length > 0
        ? newTranslation
        : fetchedSubtitles;

    return (
        <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
            <Header
                setSelectedOriginalId={setSelectedOriginalId}
                selectedMovie={selectedMovieId}
                setSelectedMovie={setSelectedMovieId}
                setSelectedAiTranslation={setSelectedAiTranslation}
                selectedOriginalId={selectedOriginalId}
                selectedAiTranslationId={selectedAiTranslationId}
                onMovieDeleted={handleMovieDeleted}
                onOriginalDeleted={handleOriginalDeleted}
                onTranslationDeleted={handleTranslationDeleted}
                translationsRefreshTrigger={translationsRefreshTrigger}
            />
            <Middle
                selectedOriginalId={selectedOriginalId}
                selectedAiTranslationId={selectedAiTranslationId}
                onSubtitlesChange={handleSubtitlesChange}
                updatedSubtitles={displaySubtitles}
                isTranslating={isTranslating}
                hasUnsavedTranslation={hasUnsavedTranslation}
                onSaveTranslation={handleSaveTranslation}
                currentLanguage={language}
                onSelectRow={handleSelectRow}
                selectedRowIndex={selectedRowIndex}
            />
            <Footer
                setLanguage={setLanguage}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                handleClickTranslate={handleClickTranslate}
                handleClickRetranslate={handleClickRetranslate}
                isTranslating={isTranslating}
                hasTranslation={hasTranslation}
                selectedRowIndex={selectedRowIndex}
            />
        </Paper>
    );
};
