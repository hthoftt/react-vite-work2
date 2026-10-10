import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/all.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import axios from "axios";
import { store } from "./store.jsx";

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL; // 預設api

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
);
