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
  translatedSrtText: string;
  versionNumber: number;
};
export const useHeader = (
  setSelectedTranslation: React.Dispatch<React.SetStateAction<number>>,
  setSelectedMovie: React.Dispatch<React.SetStateAction<number>>,
  selectedMovie: number
) => {
  const [movieOptions, setMovieOptions] = useState<Movie[]>([]);
  // const [selectedMovie, setSelectedMovie] = useState<number>(-1);

  const [translations, setTranslations] = useState<Translation[]>([]);

  const hangleUploadFile = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFileToApi(file, selectedMovie);
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
          `/translations/original/${selectedMovie}`,
          HttpMethod.GET,
          null
        );
        const responseTranslated = await sendRequest(
          `/translations/movie/${selectedMovie}`,
          HttpMethod.GET,
          null
        );
        const dataOriginal = await responseOriginal.json();
        const dataTranslated = await responseTranslated.json();

        const data = [...dataOriginal, ...dataTranslated];

        setTranslations(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTranslationOptions();
  }, [selectedMovie]);

  const onMovieChange = (event: any) => {
    setSelectedMovie(event.target.value);
  };

  const handleTranslationChange = (event: any) => {
    setSelectedTranslation(event.target.value);
    //TODO trigger translation logic
  };

  return {
    selectedMovie,
    onMovieChange,
    translations,
    handleTranslationChange,
    hangleUploadFile,
    movieOptions,
  };
};
