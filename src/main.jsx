import React from "react";
import { createRoot } from "react-dom/client";
import { setTheme } from "@blurb/codex-react";
import "@blurb/codex-react/styles";
import App from "./App.jsx";

setTheme("blurb");

createRoot(document.getElementById("root")).render(<App />);
