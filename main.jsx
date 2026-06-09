import React from "react";
import { createRoot } from "react-dom/client";
import DealModel from "./model.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DealModel />
  </React.StrictMode>
);
