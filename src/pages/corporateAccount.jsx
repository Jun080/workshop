// CorporateAccount.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import LoginFormCorporate from '../components/login/loginFormCorporate.jsx';
import CorporateForm from '../components/form/corporateForm.jsx';

const CorporateAccount = () => {
    const [user, setUser] = useState(null);
    /*const [message, setMessage] = useState('');*/
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.nom) {
                /*setMessage('Vous êtes déjà connecté en tant qu\'utilisateur');*/
            } else {
                const {company_name} = jwtDecode(token);
                setUser({company_name});
            }
        }
    }, []);

    const handleLogin = (company_name) => {
        setUser({ company_name });
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
            <h1>Espace entreprise</h1>
            {user && !user.nom ? (
                <>
                    <h1>Bienvenue {user.company_name} !</h1>
                    <p>Effectuer des actions spécifiques pour l'entreprise</p>
                    <button onClick={handleLogout}>Déconnexion</button>
                </>
            ) : (
                <>
                    {isRegistering ? (
                        <>
                            <h1>Créer un compte entreprise</h1>
                            <CorporateForm />
                            <p>
                                Vous avez déjà un compte ?{' '}
                                <button onClick={toggleForm}>
                                    Connectez-vous
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1>Connexion entreprise</h1>
                            <LoginFormCorporate onLogin={handleLogin} />
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

export default CorporateAccount;
