import { createRoot } from "react-dom/client";
import "./index.css";
import "yet-another-react-lightbox/styles.css";

import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext"; // <-- Thêm dòng này

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
