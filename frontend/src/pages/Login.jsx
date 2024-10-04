import React, { useState } from "react";
import Loading from "../components/Loading";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needverify, setNeedverify] = useState("");
  const [wait, setWait] = useState(false);

  const toRegister = () => {
    window.location.href="/register"
  }

  const toVerify = async () => {
    setWait(true)
    try{
      await fetch(`${import.meta.env.VITE_SERVER_PORT}/send_email`,{
        method:"POST",
        headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
        body: JSON.stringify({
          "email": username
        })
      }) 
    } catch(err){
      console.log(err)
    }
    window.location.href=`/verify/${username}`
    setWait(false)
  }

  const handleSubmit = async (e) => {
    console.log(import.meta.env.VITE_SERVER_PORT)
    setWait(true)
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_PORT}/login`, {
        method:"POST",
        headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
        body: JSON.stringify({
          "username": username,
          "password": password,
        })
      }).then(response => response.json());
      if (response.success) {
        try {
          const user_id = await fetch(`${import.meta.env.VITE_SERVER_PORT}/get_user?user_name=${username}`, {
          method:"GET",
          headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'}
        }).then(response=>response.json())
        console.log(user_id)
        localStorage.setItem("userID", user_id.user_id);
        localStorage.setItem("token", response.access_token);
        window.location.href = '/chat';
        setWait(false)
        } catch(err){
          setWait(false)
          console.log(err)
        }        
      } else {
        setWait(false)
        if (response.detail == "Invalid credentials"){
          setError(response.detail);
          setNeedverify("")
        }
        else if (response.detail == "Not verified yet! Click here to verify"){
          setNeedverify(response.detail)
          setError("")
        }
      }
    } catch (err) {
      setWait(false)
      setError(`Error occured: ${err}`);
    }
    setWait(false)
  };


  return (
    <div className=" vh-100 " style={{backgroundImage: "url('/library.png')", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', color: '#fff',}}>
      <nav className="navbar navbar-light bg-transparent" style={{ height: '10vh' }}>
        <div className="container-fluid">
          <a className="navbar-brand hover-effect-small" href="/" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
            AcademicGPT
          </a>
        </div>
      </nav>
      <div className="d-flex col justify-content-center align-items-center" style={{height:'90%'}}>
        <div className="col-md-4">
          <h2 className="text-center mt-4" style={{fontWeight:'bold', textShadow:'1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black'}}>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ backgroundColor: 'white'}}
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
            {needverify && <p className="text-danger" onClick={wait ? null: toVerify} style={{ font_family: 'Poppins', fontWeight:'bold', cursor: 'pointer', textDecoration: 'none', transition: 'text-decoration 0.2s' }} >{needverify}</p>}
            {wait && (
              <Loading/>
            )}
            {error && <p className="text-danger" style={{font_family: 'Poppins', fontWeight:'bold', textDecoration: 'none', transition: 'text-decoration 0.2s' }} >{error}</p>}
            <button type="submit" className="btn btn-secondary border-dark bold w-100" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
              Login
            </button>
          </form>
          <button type="submit" onClick={toRegister} className="btn btn-secondary border-dark bold w-100 mt-2" style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
              Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
