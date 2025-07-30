import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Styles/main.css";
import ErrorBoundary from "./Components/ErrorBoundary";

const root = createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);