import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AlaskaOffroadExpedition from "./AlaskaOffroadExpedition.jsx";
import ReservationConfirmed from "./pages/ReservationConfirmed.jsx";
import BookPackage from "./BookPackage.jsx";
import PlanYourTrip from "./pages/PlanYourTrip.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Existing Homepage */}
        <Route
          path="/"
          element={<AlaskaOffroadExpedition />}
        />

        {/* New Dedicated Trip Builder Page */}
        <Route
          path="/plan-your-trip"
          element={<PlanYourTrip />}
        />

        {/* Existing Package Booking */}
        <Route
          path="/book-package"
          element={<BookPackage />}
        />

        {/* Existing Reservation Confirmation */}
        <Route
          path="/reservation-confirmed"
          element={<ReservationConfirmed />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);