import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AlaskaOffroadExpedition from "./AlaskaOffroadExpedition.jsx";
import ReservationConfirmed from "./pages/ReservationConfirmed.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AlaskaOffroadExpedition />} />
        <Route
          path="/reservation-confirmed"
          element={<ReservationConfirmed />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);