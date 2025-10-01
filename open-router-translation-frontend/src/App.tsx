import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { MovieForm } from "./pages/MovieFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<MovieForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;