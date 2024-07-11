import React, { useState } from 'react';
import axios from 'axios';

import '../../cssPages/account.css'

const LoginFormCorporate = ({ onLogin }) => {
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPassword, setCompanyPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/corporate/login`, {
                company_email: companyEmail,
                company_password: companyPassword
            });

            const { token, company_name } = response.data;

            localStorage.setItem('token', token);

            onLogin(company_name);

            setCompanyEmail('');
            setCompanyPassword('');
            setMessage('');
        } catch (error) {
            console.error('Erreur lors de la connexion à l\'entreprise !', error.message);
            setMessage('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>Email*</p>
                    <input
                        type="email"
                        placeholder="Email de l'entreprise"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <p>Mot de passe*</p>
                    <input
                        type="password"
                        placeholder="Mot de passe de l'entreprise"
                        value={companyPassword}
                        onChange={(e) => setCompanyPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='btn btn-peach'>Connexion</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginFormCorporate;
