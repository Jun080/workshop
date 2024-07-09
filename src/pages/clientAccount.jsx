import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import LoginFormUsers from '../components/login/loginFormUsers.jsx';
import UserForm from '../components/form/UserForm';

const ClientAccount = () => {
    const [user, setUser] = useState(null);
    /*const [message, setMessage] = useState('');*/
    const [isRegistering, setIsRegistering] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.company_name) {
                /*setMessage('Vous êtes déjà connecté en tant qu\'entreprise');*/
            } else {
                const { nom, prénom } = decodedToken;
                setUser({ nom, prénom });
            }
        }
    }, []);

    const handleLogin = (nom, prénom) => {
        setUser({ nom, prénom });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div>
            <h1>Espace client public</h1>
            {user && !user.company_name ? (
                <>
                    <br/>
                    <hr/>
                    <h1>Bonjour {user.prénom} {user.nom} !</h1>
                    <p>S'inscrire à un tournoi</p>
                    <button onClick={handleLogout}>Déconnexion</button>
                </>
            ) : (
                <>
                    {isRegistering ? (
                        <>
                            <h1>Créer un compte utilisateur</h1>
                            <UserForm />
                            <p>
                                Vous avez déjà un compte ?{' '}
                                <button onClick={toggleForm}>
                                    Connectez-vous
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1>Connexion utilisateur</h1>
                            <LoginFormUsers onLogin={handleLogin} />
                            <p>
                                Vous n'avez pas de compte ?{' '}
                                <button onClick={toggleForm}>
                                    Créez-en un
                                </button>
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ClientAccount;
