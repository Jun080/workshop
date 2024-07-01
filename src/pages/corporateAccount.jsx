import React, { useState, useEffect } from 'react';

import { jwtDecode } from 'jwt-decode'; 

import UserForm from '../components/form/UserForm';
import LoginForm from '../components/login/loginForm';
import CorporateForm from '../components/form/corporateForm.jsx'

const CorporateAccount = () => {
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
      <h1>Espace entreprise</h1>
      {user ? (
              <>
                  <h1>Bonjour {user.prénom} {user.nom} !</h1>
                  <p>S'inscrire à un tournoi</p>
                  <button onClick={handleLogout}>Déconnexion</button>
              </>
          ) : (
              <>
                  <h1>Créer un compte Entreprise</h1>
                  <CorporateForm />
                  <LoginForm onLogin={handleLogin} />
              </>
          )}
    </div>
  );
};

export default CorporateAccount;