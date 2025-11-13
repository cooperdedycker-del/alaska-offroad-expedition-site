import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AlaskaOffroadExpedition from "./AlaskaOffroadExpedition.jsx"; // your current main page component
import LionsClubPage from "./pages/LionsClub.jsx"; // we'll create this next
import "./index.css"; // whatever you already import for Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AlaskaOffroadExpedition />} />
        <Route path="/lionsclub" element={<LionsClubPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
