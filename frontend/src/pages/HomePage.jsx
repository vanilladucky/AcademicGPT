import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {


  return (
    <div style={styles.container}>
      <nav className="navbar navbar-light bg-transparent" style={{ height: '10vh' }}>
        <div className="container-fluid">
          <a className="navbar-brand hover-effect-small" href = '/' style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
            AcademicGPT
          </a>
          <a 
            className="navbar-brand ms-2 hover-effect-small"  
            href="/introduction" 
            style={{ fontFamily: 'Poppins', color: 'white', fontWeight: 'bold' }}
          >
            About
          </a>
          <a 
            className="navbar-brand ms-auto hover-effect-small" 
            href="/login" 
            style={{ fontFamily: 'Poppins', color: 'white', fontWeight: 'bold' }}
          >
            Register
          </a>
          <a 
            className="navbar-brand ms-2 hover-effect-small" 
            href="/register" 
            style={{ fontFamily: 'Poppins', color: 'white', fontWeight: 'bold' }}
          >
            Login
          </a>
        </div>
      </nav>

      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
        <h1 className="display-3" style={{fontWeight:'bold', textShadow:'1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black'}}>
          Welcome to AcademicGPT 📚
        </h1>
        <p className="lead" style={{fontWeight:'bold', textShadow:'1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black'}}>
          AI-powered companion for your academic questions
        </p>
      </div>
      <footer className="d-flex flex-column justify-content-center align-items-center bg-dark text-white text-center" style={{height:'10vh'}}>
        <p>Contact me at adacademicgpt@gmail.com</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: "url('/library.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    color: '#fff',
  },
  logo: {
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#fff',
  },
  loginButton: {
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    color: '#fff',
  },
  tagline: {
    fontSize: '1.5rem',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    color: '#fff',
  },
};

export default HomePage;
