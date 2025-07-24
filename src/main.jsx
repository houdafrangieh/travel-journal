import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Styles/main.css";
import data from "./Data/entries.js";

const root = createRoot(document.getElementById("root"));
root.render(<App data={data} />);