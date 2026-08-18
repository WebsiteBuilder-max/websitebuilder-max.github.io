import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Harbour from "./pages/Harbour.jsx";
import Drift from "./pages/Drift.jsx";
import SitePage from "./pages/SitePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<SitePage kind="about" />} />
      <Route path="/privacy" element={<SitePage kind="privacy" />} />
      <Route path="/terms" element={<SitePage kind="terms" />} />
      <Route path="/harbour-kitchen/*" element={<Harbour />} />
      <Route path="/drift-supply/*" element={<Drift />} />
    </Routes>
  );
}
