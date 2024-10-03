import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";

const VerificationCode = () => {
  const { uid } = useParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);

  const resentVerification = async (e) => {
    e.preventDefault();
    setRunning(true);
    try{
      await fetch("http://localhost:8000/send_email",{
        method:"POST",
        headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
        body: JSON.stringify({
          "email": uid
        })
      }) 
    } catch(err){
      console.log(err)
    }
    setRunning(false)
  }

  const handleVerification = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages

    try {
      setRunning(true);
      const res = await fetch('http://127.0.0.1:8000/verify', {
              method:"POST",
              headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
              body: JSON.stringify({
                email: uid,
                code: code
              })
      }).then(response=>response.json())
      setRunning(true);
      setMessage("User verified and registered successfully!");
      window.location.href = '/login'
    } catch (err) {
      setRunning(true);
      console.log(err)
      setError("Invalid verification code. Please try again.");
    }
    setRunning(true);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
      <h2 className="mb-3">Verify Your Code</h2>
      <h6 className="mb-1">Please check your email for the verfication code</h6>
      <h6 className="mb-4">Click 'Send again' if you haven't received it after 5 minutes</h6>
      <form  className="w-50">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" onClick={handleVerification} className="btn btn-primary w-100">Verify</button>
        <button type="submit" onClick={resentVerification} className="btn btn-primary w-100 mt-2">Send again</button>
        {running && (
            <Loading/>
          )}
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {message && <p className="text-success mt-3">{message}</p>}
    </div>
  );
};

export default VerificationCode;
