function TopNavBar() {
    return(
        <header className="bg-dark text-white text-center pb-3">
        <nav className="navbar navbar-light bg-dark" style={{ height: '10vh' }}>
          <div className="container-fluid ">
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
              Login
            </a>
          </div>
        </nav>
        <h1 style={{font_family: 'Poppins', color:'white'}}>Welcome to AcademicGPT 📚</h1>
        <p className="lead" style={{font_family: 'Poppins', color:'white'}}>An AI companion for students - developed by a fellow student</p>
      </header>
    )
}

export default TopNavBar