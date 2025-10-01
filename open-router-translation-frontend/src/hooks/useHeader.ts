import { MovieDetails } from './../components/MovieDetails';
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
// {
//     "id": 0,
//     "chunks": [
//       {
//         "index": 0,
//         "startTime": "string",
//         "endTime": "string",
//         "originalText": "string",
//         "translatedText": "string"
//       }
//     ]
//   }
export type Translation = {
  id: number;
  name: string;
};
export const useHeader = (
  setSelectedTranslation: React.Dispatch<React.SetStateAction<number>>,
  setSelectedMovie: React.Dispatch<React.SetStateAction<number>>,
  selectedMovie: number,
  setSelectedAiTranslation: React.Dispatch<React.SetStateAction<number>>
) => {
  const [movieOptions, setMovieOptions] = useState<Movie[]>([]);
  // const [selectedMovie, setSelectedMovie] = useState<number>(-1);

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [aiTranslations, setAiTranslations] = useState<Translation[]>([]);
  const [movieDetails, setMovieDetails] = useState<Movie | undefined>(undefined);
  const hangleUploadFile = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFileToApi(file, selectedMovie);
      window.location.reload();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    const fetchTranslationOptions = async () => {
      try {
        const responseOriginal = await sendRequest(
          `/subtitles/original/${selectedMovie}`,
          HttpMethod.GET,
          null
        );

        const dataOriginal = await responseOriginal.json();

        setTranslations(dataOriginal);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTranslationOptions();
  }, [selectedMovie]);

  useEffect(() => {
    const fetchAiSubtitles = async () => {
      try {
        const response = await sendRequest(
          `/subtitles/ai-translated/${selectedMovie}`,
          HttpMethod.GET,
          null
        );
        const data = await response.json();
        setAiTranslations(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAiSubtitles();
  }, [translations]);

  const onMovieChange = async (event: any) => {
    setSelectedMovie(event.target.value);
    const response = await sendRequest(
      `/movies/${event.target.value}`,
      HttpMethod.GET,
      null
    );
    const data = await response.json();
    setMovieDetails(data);
  };

  const handleTranslationChange = (event: any) => {
    setSelectedTranslation(event.target.value);
    //TODO trigger translation logic
  };

  return {
    selectedMovie,
    onMovieChange,
    translations,
    aiTranslations,
    handleTranslationChange,
    hangleUploadFile,
    movieOptions,
    movieDetails,
  };
};
