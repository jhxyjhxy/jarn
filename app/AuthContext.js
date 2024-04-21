import React, { createContext, useState } from 'react';

const AuthContext = createContext();

// Create a provider component
const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null); // Initialize state

  // Function to set the authentication token
  const login = (token) => {
    setAuthToken(token); // Store the token in state
  };

  // Function to clear the authentication token
  const logout = () => {
    setAuthToken(null); // Clear the token
  };

  // Provide the state and functions to the children
  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };