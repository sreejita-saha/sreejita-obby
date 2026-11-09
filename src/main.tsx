// Browser entry point. Usually this file does not need changing.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "modern-normalize/modern-normalize.css";
import "./index.css";
import App from "./App.tsx";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

inject();
injectSpeedInsights();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
