import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AuthService = {
  isAuthenticated: false,
  login(username, password) {
    if (username === "admin" && password === "password") {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  },
  logout() {
    this.isAuthenticated = false;
  },
  isLoggedIn() {
    return this.isAuthenticated;
  }
};

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (AuthService.login(username, password)) {
      setIsAuthenticated(true);
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        text: 'Welcome to the Employee Dashboard',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Invalid credentials',
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="table-input mt-1"
            placeholder="Enter username (admin)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="table-input mt-1"
              placeholder="Enter password (password)"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
            </button>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="button w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;