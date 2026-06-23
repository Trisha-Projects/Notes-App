import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({
  darkMode,
  toggleTheme
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 async function login() {

  if (loading) return;

  if (
    username === "" ||
    password === ""
  ) {
    toast.warning("Fill all fields");
    return;
  }

  setLoading(true);

  try {

    // const res = await fetch(
    //   "https://notes-app-hhgp.onrender.com/login",
    const res = await fetch(
  `${import.meta.env.VITE_BASE_URL}/login`, 
    
    {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (!res.ok) {

      toast.error(
        "Invalid Credentials"
      );

      setLoading(false);

      return;
    }

    const data =
      await res.json();

    localStorage.setItem( "token",data.token);

    toast.success(
      "Login Successful"
    );

    setLoading(false);

    setTimeout(() => {
      navigate("/notes");
    }, 1000);

  }

  catch (err) {

    toast.error(
      "Server Error"
    );

    setLoading(false);

  }

}

  return (
    <div
  className={
    darkMode
      ? "auth-page dark"
      : "auth-page light"
  }
>

      <div className="auth-card">

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

        <div className="logo">
          📝
        </div>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to access your notes and stay productive.
        </p>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
  className="auth-btn"
  onClick={login}
  disabled={loading}
>
  {
    loading
      ? "Logging in..."
      : "Login"
  }
</button>

        <p className="switch-text">
          Don't have an account?
        </p>

        <button
          className="secondary-btn"
          onClick={() =>
            navigate("/register")
          }
        >
          Register
        </button>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

    </div>
  );
}

export default Login;