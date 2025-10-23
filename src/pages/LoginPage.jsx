import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-image-section"></div>
      <div className="login-form-section">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;