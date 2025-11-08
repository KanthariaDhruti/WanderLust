import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";
import { AuthProvider } from "./components/AuthContext";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
