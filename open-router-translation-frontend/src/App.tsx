import {BrowserRouter, Routes, Route} from "react-router-dom";
import {LandingPage} from "./pages/LandingPage";
import {MovieForm} from "./pages/MovieFormPage";
import {ThemeProvider} from "@mui/material";
import {darkTheme} from "./theme.ts";

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/create" element={<MovieForm/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
