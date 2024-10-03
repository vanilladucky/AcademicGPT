function Logo() {
    const handleLogout = () => {
        localStorage.removeItem("userID")
        localStorage.removeItem("token")
        window.location.href = '/';
    };

    return (
        <div className="d-flex align-items-center shadow border-bottom border-dark border-2" style={{ height: '100%' }}>
            {/* Empty div to occupy the left space */}
            <div style={{ flex: 1 }}></div>
            
            {/* Centered logo */}
            <div className="text-center" style={{ flex: 4 }}>
                <span className="align-middle fs-1" style={{ fontFamily: 'Georgia', fontWeight: 'bold', color: '#fdfefe' }}>
                    AcademicGPT 📚
                </span>
            </div>
            
            {/* Logout button on the right */}
            <div style={{ flex: 1 }} className="d-flex justify-content-end">
                <button 
                    className="btn btn-danger" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Logo;