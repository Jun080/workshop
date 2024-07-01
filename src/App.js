import './App.css';
import React, { useState, useEffect } from 'react';

import Menu from './components/menu.jsx'
import UserForm from './components/clientForm.jsx';
import LoginForm from './components/loginForm.jsx';
import { jwtDecode } from 'jwt-decode'; 

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          const { nom, prénom } = jwtDecode(token);
          setUser({ nom, prénom });
      }
  }, []);

  const handleLogin = (nom, prénom) => {
      setUser({ nom, prénom });
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
  };

  return (
      <div>
        <Menu />
          {user ? (
              <>
                  <h1>Bonjour {user.prénom} {user.nom} !</h1>
                  <button onClick={handleLogout}>Déconnexion</button>
              </>
          ) : (
              <>
                  <h1>Créer un compte</h1>
                  <UserForm />
                  <h1>Se connecter</h1>
                  <LoginForm onLogin={handleLogin} />
              </>
          )}
      </div>
  );
};

export default App;
