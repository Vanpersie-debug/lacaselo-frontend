import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===== Redirect Component =====
// This simple UI will be the only thing rendered
const RedirectMessage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ color: '#dc3545', marginBottom: '15px' }}>
        Iyi page yahinduwe
      </h1>
      <p style={{ fontSize: '18px', color: '#333', marginBottom: '25px' }}>
        Kanda kuriyi link ujye kuri page nshya:
      </p>
      <a 
        href="https://lacaselo-frontend.vercel.app/" 
        style={{ 
          fontSize: '18px', 
          color: '#0d6efd', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          padding: '12px 24px',
          border: '2px solid #0d6efd',
          borderRadius: '8px',
          transition: 'background-color 0.3s'
        }}
      >
        https://lacaselo-frontend.vercel.app/
      </a>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<RedirectMessage />} />
      </Routes>
    </Router>
  );
}

export default App;