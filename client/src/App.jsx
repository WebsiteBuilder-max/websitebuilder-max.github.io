import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Harbour from "./pages/Harbour.jsx";
import Drift from "./pages/Drift.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/harbour-kitchen" element={<Harbour />} />
      <Route path="/harbour-kitchen/" element={<Navigate to="/harbour-kitchen" replace />} />
      <Route path="/drift-supply" element={<Drift />} />
      <Route path="/drift-supply/" element={<Navigate to="/drift-supply" replace />} />
    </Routes>
  );
}
