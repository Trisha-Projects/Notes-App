import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Home({
  darkMode,
  toggleTheme
}) {
  const navigate = useNavigate();

  return (
    <div
  className={
    darkMode
      ? "home-page dark"
      : "home-page light"
  }
>

      <div className="circle1"></div>
      <div className="circle2"></div>

      <nav className="top-nav">
<div className="nav-buttons">

  <button
    className="theme-btn"
    onClick={toggleTheme}
  >
    {
      darkMode
        ? "☀ Light"
        : "🌙 Dark"
    }
  </button>

</div>
        <h2>📝 KeepNote</h2>

        <div className="nav-buttons">

          <button
            className="nav-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="nav-btn signup"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

        </div>

      </nav>

      <div className="hero-card">

        <div className="hero-badge">
          🚀 Smart Notes Platform
        </div>

        <h1 className="hero-title">
          📝 KeepNote
        </h1>

        <p className="hero-subtitle">
          Turn scattered thoughts into organized action.
          Write notes, manage reminders and stay productive
          with one beautiful workspace.
        </p>

        <div className="hero-buttons">

          <button
            className="hero-btn primary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

          <button
            className="hero-btn secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

        <div className="preview-card">

          <div className="mini-note yellow">
            📚 Project Submission
          </div>

          <div className="mini-note green">
            🛒 Buy Groceries
          </div>

          <div className="mini-note blue">
            👨‍💻 Team Meeting 4 PM
          </div>

        </div>

        <div className="hero-stats">

          <div>
            <h3>10K+</h3>
            <p>Notes Created</p>
          </div>

          <div>
            <h3>24/7</h3>
            <p>Access</p>
          </div>

          <div>
            <h3>100%</h3>
            <p>Secure</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;