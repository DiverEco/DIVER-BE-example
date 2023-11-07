// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import ImageUpload from './components/ImageUpload';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | "">("");
  // console.log(process.env.REACT_APP_API_ENDPOINT);
  const handleLogin = (token: string) => {
    setIsLoggedIn(true);
    setJwtToken(token);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <ImageUpload jwtToken={jwtToken} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
