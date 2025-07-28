import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Styles/main.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);