import { Link } from "react-router-dom";

export default function BackToStudio() {
  return (
    <div className="back-studio">
      <div className="wrap back-studio-row">
        <Link to="/">← Back to Web Work Co</Link>
        <span>Sample site built by Web Work Co · not a real business</span>
      </div>
    </div>
  );
}
