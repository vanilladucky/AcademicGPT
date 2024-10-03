import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Introduction() {
  return (
    <div>
      <header className="bg-dark text-white text-center pb-3">
        <nav className="navbar navbar-light bg-dark" style={{ height: '10vh' }}>
          <div className="container-fluid">
            <a className="navbar-brand" href = '/' style={{font_family: 'Poppins', color:'white', fontWeight:'bold'}}>
              AcademicGPT
            </a>
            <a 
              className="navbar-brand ms-2" 
              href="/introduction" 
              style={{ fontFamily: 'Poppins', color: 'white', fontWeight: 'bold' }}
            >
              About
            </a>
            <a 
              className="navbar-brand ms-auto" 
              href="/login" 
              style={{ fontFamily: 'Poppins', color: 'white', fontWeight: 'bold' }}
            >
              Login
            </a>
          </div>
        </nav>
        <h1 style={{font_family: 'Poppins', color:'white'}}>Welcome to AcademicGPT 📚</h1>
        <p className="lead" style={{font_family: 'Poppins', color:'white'}}>An AI companion for students - developed by a fellow student</p>
      </header>

      <section className="container py-5" style={{font_family: 'Poppins', color:'black'}}>
        <div className="row">
          <div className="col-md-6 text-start">
            <h2>About AcademicGPT</h2>
            <p>
                Have you ever come across answers from ChatGPT that you just know isn't true?            
            </p>
            <p>
                Have you ever wished ChatGPT could take a look at your notes and help you like a teacher?
            </p>
            <p>
                These are some of the inspirations that was in my head when I decided to start this project on a random Tuesday. I believe LLMs are easily accessible and the concept of RAGs are gaining more popularity nowadays. However, I
                believed there was an engineering, creative opportunity that I could jump on and maybe produce an useful application. My vision for this project
                is one where students can receive highly tailored, specific replies with regards to their own university's teaching and lecture materials. 
            </p>
            <p>
                With this ability,
                I hope to see an increase in productivity of students and an easier studying experience for us. 
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="/student_studying.png"
              alt="App Introduction"
              className="img-fluid"
            />
          </div>
        </div>
      </section>

      <section className="bg-light py-5" style={{font_family: 'Poppins', color:'black'}}>
        <div className="container">
          <h2 className="text-center">Key Features</h2>
          <div className="row text-center py-4">
            <div className="col-md-4">
              <i className="bi bi-lightbulb-fill" style={{ fontSize: '3rem' }}></i>
              <h4>Extensive knowledge</h4>
              <p>AcademicGPT is equipped with specific knowledge of various different NTU courses.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-code-slash" style={{ fontSize: '3rem' }}></i>
              <h4>Provides references</h4>
              <p>AcademicGPT will provide you with lecture materials relevant to your question.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-graph-up" style={{ fontSize: '3rem' }}></i>
              <h4>Free to use</h4>
              <p>No need to worry about paying or any hidden paywalls.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        <p>Contact me at adacademicgpt@gmail.com</p>
      </footer>
    </div>
  );
}

export default Introduction;
