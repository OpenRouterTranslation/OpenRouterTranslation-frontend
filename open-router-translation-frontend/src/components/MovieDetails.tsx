import type React from "react";
import type { Movie } from "../hooks/useHeader";

export const MovieDetails: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div>
      <div>
        Title: {movie.name} ({movie.releaseYear})
      </div>
      <div>{movie.description}</div>
    </div>
  );
};
