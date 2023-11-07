// src/components/Login.tsx
import React, { useState } from 'react';

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Hash the password using SHA-256.
      const passwordHash = await hashPassword(password);
      
      // Send a request to the server for authentication with the hashed password.
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${process.env.REACT_APP_API_KEY}`
        },
        body: JSON.stringify({ username, password: passwordHash }),
      });

      if (response.ok) {
        const data = await response.json();
        const jwtToken = data.jwt_token;
        onLogin(jwtToken);
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login.');
    }
  };

  const hashPassword = async (plainPassword: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);

    const passwordBuffer = await crypto.subtle.digest('SHA-256', data);
    const passwordArray = Array.from(new Uint8Array(passwordBuffer));

    const passwordHash = passwordArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return passwordHash;
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{errorMessage}</p>
    </div>
  );
};

export default Login;
