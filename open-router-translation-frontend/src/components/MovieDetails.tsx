import { Box, Typography } from "@mui/material";
import type { Movie } from "../hooks/useHeader";

export const MovieDetails: React.FC<{ movie: Movie }> = ({ movie }) => {
    return (
        <Box
            sx={{
                p: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 500,
                    mb: 0.5,
                    color: 'primary.main'
                }}
            >
                {movie.name} ({movie.releaseYear})
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: 'text.secondary',
                    lineHeight: 1.3,
                    fontSize: '0.875rem'
                }}
            >
                {movie.description}
            </Typography>
        </Box>
    );
};
