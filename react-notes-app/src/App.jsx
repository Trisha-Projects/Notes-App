import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Notes from "./Notes";
import { useState } from "react";

function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/login" />;
}

function App() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  function toggleTheme() {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );

  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    <Home
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  }
/>

<Route
  path="/login"
  element={
    <Login
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  }
/>

<Route
  path="/register"
  element={
    <Register
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />
  }
/>

<Route
  path="/notes"
  element={
    <ProtectedRoute>
      <Notes
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    </ProtectedRoute>
  }
/>
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;