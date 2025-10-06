import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {darkTheme} from "./theme.ts";
import {ThemeProvider} from "@mui/material";


createRoot(document.getElementById('root')!).render(

  <StrictMode>
      <ThemeProvider theme={darkTheme}>
      <App />
      </ThemeProvider>
  </StrictMode>,
)
