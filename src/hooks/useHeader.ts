import { useEffect, useState } from "react";
import {
    HttpMethod,
    sendRequest,
    uploadFileToApi,
} from "../services/baseService";

export type Movie = {
    id: number;
    name: string;
    description: string;
    releaseYear: number;
};

export type Translation = {
    id: number;
    itemName: string;
};

export const useHeader = (
    setSelectedOriginalId: React.Dispatch<React.SetStateAction<number>>,
    setSelectedMovie: React.Dispatch<React.SetStateAction<number>>,
    selectedMovie: number,
    setSelectedAiTranslation: React.Dispatch<React.SetStateAction<number>>,
    translationsRefreshTrigger: number = 0
) => {
    const [movieOptions, setMovieOptions] = useState<Movie[]>([]);
    const [originalSubtitles, setOriginalSubtitles] = useState<Translation[]>([]);
    const [aiTranslations, setAiTranslations] = useState<Translation[]>([]);
    const [movieDetails, setMovieDetails] = useState<Movie | undefined>(undefined);
    const [selectedOriginalIdLocal, setSelectedOriginalIdLocal] = useState<number>(-1);

    const hangleUploadFile = async (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (selectedMovie === -1) {
            alert("Please select a movie first");
            return;
        }

        try {
            const result = await uploadFileToApi(file, selectedMovie);
            console.log("Upload successful:", result);

            // Refresh original subtitles list after upload
            const response = await sendRequest(
                `/subtitles/original/${selectedMovie}`,
                HttpMethod.GET,
                null
            );
            const data = await response.json();
            setOriginalSubtitles(data);

            alert("Subtitle uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload subtitle");
        }
    };

    // Fetch all movies on mount
    useEffect(() => {
        const fetchMovieOptions = async () => {
            try {
                const response = await sendRequest("/movies", HttpMethod.GET, null);
                const data = await response.json();
                setMovieOptions(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMovieOptions();
    }, []);

    // Fetch original subtitles when movie changes
    useEffect(() => {
        const fetchOriginalSubtitles = async () => {
            if (selectedMovie === -1) {
                setOriginalSubtitles([]);
                return;
            }

            try {
                const response = await sendRequest(
                    `/subtitles/original/${selectedMovie}`,
                    HttpMethod.GET,
                    null
                );

                if (!response.ok) {
                    console.error("Failed to fetch subtitles. Status:", response.status);
                    setOriginalSubtitles([]);
                    return;
                }

                const data = await response.json();
                setOriginalSubtitles(data);
            } catch (err) {
                console.error("Error fetching original subtitles:", err);
                setOriginalSubtitles([]);
            }
        };

        fetchOriginalSubtitles();
        setSelectedOriginalIdLocal(-1);
        setSelectedOriginalId(-1);
        setSelectedAiTranslation(-1);
        setAiTranslations([]);
    }, [selectedMovie]);

    // Fetch AI translations when original subtitle is selected OR when refresh trigger changes
    useEffect(() => {
        const fetchAiTranslations = async () => {
            if (selectedOriginalIdLocal === -1) {
                setAiTranslations([]);
                return;
            }

            try {
                const response = await sendRequest(
                    `/subtitles/ai-translated/${selectedOriginalIdLocal}`,
                    HttpMethod.GET,
                    null
                );
                const data = await response.json();
                setAiTranslations(data);
            } catch (err) {
                console.error("Error fetching AI translations:", err);
                setAiTranslations([]);
            }
        };

        fetchAiTranslations();
    }, [selectedOriginalIdLocal, translationsRefreshTrigger]);

    const onMovieChange = async (event: any) => {
        const movieId = event.target.value;
        setSelectedMovie(movieId);

        try {
            const response = await sendRequest(
                `/movies/${movieId}`,
                HttpMethod.GET,
                null
            );
            const data = await response.json();
            setMovieDetails(data);
        } catch (err) {
            console.error("Error fetching movie details:", err);
        }
    };

    const handleOriginalSubtitleChange = (event: any) => {
        const originalId = event.target.value;
        setSelectedOriginalIdLocal(originalId);
        setSelectedOriginalId(originalId);
        setSelectedAiTranslation(-1);
    };

    const handleAiTranslationChange = (event: any) => {
        setSelectedAiTranslation(event.target.value);
    };

    const handleDeleteMovie = async (movieId: number) => {
        if (!window.confirm("Are you sure you want to delete this movie? This will also delete all its subtitles and translations.")) {
            return;
        }

        try {
            const response = await sendRequest(
                `/movies/delete/${movieId}`,
                HttpMethod.POST,
                null
            );

            if (response.ok) {
                alert("Movie deleted successfully");
                // Refresh movie list
                const moviesResponse = await sendRequest("/movies", HttpMethod.GET, null);
                const moviesData = await moviesResponse.json();
                setMovieOptions(moviesData);
                setMovieDetails(undefined);
            } else {
                alert("Failed to delete movie");
            }
        } catch (err) {
            console.error("Error deleting movie:", err);
            alert("Error deleting movie");
        }
    };

    const handleDeleteOriginal = async (originalId: number) => {
        if (!window.confirm("Are you sure you want to delete this original subtitle? This will also delete all its translations.")) {
            return;
        }

        try {
            const response = await sendRequest(
                `/subtitles/original/delete/${originalId}`,
                HttpMethod.POST,
                null
            );

            if (response.ok) {
                alert("Original subtitle deleted successfully");
                // Refresh original subtitles list
                if (selectedMovie !== -1) {
                    const origResponse = await sendRequest(
                        `/subtitles/original/${selectedMovie}`,
                        HttpMethod.GET,
                        null
                    );
                    const origData = await origResponse.json();
                    setOriginalSubtitles(origData);
                }
            } else {
                alert("Failed to delete original subtitle");
            }
        } catch (err) {
            console.error("Error deleting original subtitle:", err);
            alert("Error deleting original subtitle");
        }
    };

    const handleDeleteTranslation = async (translationId: number) => {
        if (!window.confirm("Are you sure you want to delete this translation?")) {
            return;
        }

        try {
            const response = await sendRequest(
                `/subtitles/ai-translated/delete/${translationId}`,
                HttpMethod.POST,
                null
            );

            if (response.ok) {
                alert("Translation deleted successfully");
                // Refresh AI translations list
                if (selectedOriginalIdLocal !== -1) {
                    const transResponse = await sendRequest(
                        `/subtitles/ai-translated/${selectedOriginalIdLocal}`,
                        HttpMethod.GET,
                        null
                    );
                    const transData = await transResponse.json();
                    setAiTranslations(transData);
                }
            } else {
                alert("Failed to delete translation");
            }
        } catch (err) {
            console.error("Error deleting translation:", err);
            alert("Error deleting translation");
        }
    };

    const refreshTranslations = async () => {
        if (selectedOriginalIdLocal !== -1) {
            try {
                const response = await sendRequest(
                    `/subtitles/ai-translated/${selectedOriginalIdLocal}`,
                    HttpMethod.GET,
                    null
                );
                const data = await response.json();
                setAiTranslations(data);
            } catch (err) {
                console.error("Error refreshing translations:", err);
            }
        }
    };

    return {
        selectedMovie,
        onMovieChange,
        originalSubtitles,
        aiTranslations,
        handleOriginalSubtitleChange,
        handleAiTranslationChange,
        hangleUploadFile,
        movieOptions,
        movieDetails,
        handleDeleteMovie,
        handleDeleteOriginal,
        handleDeleteTranslation,
        refreshTranslations,
    };
};