import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "../components/Loading";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vcode, setVcode] = useState("");
  const [sending, setSending] = useState(false);

  const sendtologin = () => {
    window.location.href = '/login'
  }

  const handleSubmit = async (e) => {
    setSending(true)
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        password,
      });

      if (response.data.message == "Weak password") {
        setError("Password not strong enough. Must be longer than 8 characters, with at least one uppercase, lowercase letter, special digit and digit.");
        setSuccess("");
      }
      else if (response.data.message == "Only NTU students may register!"){
        setError("Only NTU students may register!");
        setSuccess("");
      }
      else if (response.data.message == "Email Sent!"){
        setSuccess("Email sent!");
        setError("");
        window.location.href = `/verify/${username}`
      }
    } catch (err) {
      if (err.status == 310){
        setError("Username exists!");
      }
      else {
        setError(`Unknown error code ${err.status} detected!`)
      }
      setSuccess("");
    }
    setSending(false)
  };

  return (
    <div className=" vh-100" style={{backgroundImage: "url('/library.png')", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', color: '#fff',}}>
      <nav className="navbar navbar-light bg-transparent" style={{height:'10vh'}}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
            AcademicGPT
          </a>
        </div>
      </nav>
      <div className="d-flex col justify-content-center align-items-center" style={{height:'90%'}}>
        <div className="col-md-4">
          <h2 className="text-center mt-4" style={{fontWeight:'bold', textShadow:'1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black'}}>Register</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
                Email:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
                Confirm Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger" style={{font_family: 'Poppins', fontWeight:'bold'}}>{error}</p>}
            <button type="submit" className="btn btn-secondary border-dark bold w-100" onClick={handleSubmit} disabled={sending} style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
              {sending == true ? "Give me a moment...": "Register"}
            </button>
            {sending && (
              <Loading/>
            )}
          </form>
          <p className="mt-3 link text-decoration-underline" onClick={sendtologin} style={{ cursor: 'pointer', font_family: 'Poppins', color:'white', fontWeight:'bold' }}>
            Registered before?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
