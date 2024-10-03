import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ErrorPageGeneral() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 text-danger">Error!</h1>
        <p className="lead">Something went wrong. Please try again later.</p>
      </div>
    </div>
  );
}

export default ErrorPageGeneral;
