import { Link } from "react-router-dom";

export default function BackToStudio() {
  return (
    <div className="back-studio">
      <div className="wrap back-studio-row">
        <Link to="/">← Back to Cape Web Co</Link>
        <span>Sample site built by Cape Web Co · not a real business</span>
      </div>
    </div>
  );
}
