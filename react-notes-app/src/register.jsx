import { useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register({
  darkMode,
  toggleTheme
}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] =useState("");
    const [email, setEmail] = useState("");
    const emailRef=useRef(null);
    const passwordRef=useRef(null);

    const [loading,setloading]=useState("");

  const navigate = useNavigate();

  async function handleRegister() {

    console.log("Register button clicked");
if (loading) return;
    if (
      username === "" || email === "" ||
      password === ""
    ) {
      toast.warning(
        "Fill all fields"
      );
      return;
    }
    setloading(true);

    try {

      // const response =
      //   await fetch(
      //     "https://notes-app-hhgp.onrender.com/register",
          
      const response =
  await fetch(
    `${import.meta.env.VITE_BASE_URL}/register`,
      {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );
        console.log(response);

      const data =
        await response.json();

      if (!response.ok) {

        toast.error(
          data.message
        );

        return;
      }

      toast.success(
        "Registration Successful"
      );

      await fetch(
  "http://localhost:3001/send-mail",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email 
    })
  }
);
setloading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    }

    catch (err) {

      toast.error(
        "Server Error"
      );

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

        <div className="nav-btns">

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

        <div className="logo">
          🚀
        </div>

        <h1>
          KeepNote
        </h1>

        <p className="subtitle">
          Create your account and start
          organizing your notes today.
        </p>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>setUsername(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              emailRef.current.focus();
            }}}
        
        />

        <input
  className="auth-input"
  ref={emailRef}
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onKeyDown={(e)=>{
    if(e.key==="Enter"){
      passwordRef.current.focus();
    }
  }}
   
/>

        <input
          className="auth-input"
          ref={passwordRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>setPassword( e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              handleRegister();
            }
          }}
            
        />

        <button
          className="auth-btn"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="switch-text">
          Already have an account?
        </p>

        <button
          className="secondary-btn"
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

    </div>

  );

}

export default Register;