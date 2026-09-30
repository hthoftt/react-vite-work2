import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./styles/all.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL; // 預設api

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <HashRouter>
    <App />
  </HashRouter>,
  // {/* </StrictMode> */}
);
