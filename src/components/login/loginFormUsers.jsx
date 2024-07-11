import React, { useState } from 'react';
import axios from 'axios';

import '../../cssPages/account.css'

const LoginFormUsers = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                email,
                password
            });

            const { token, nom } = response.data;

            localStorage.setItem('token', token);

            onLogin(nom);

            setEmail('');
            setPassword('');
            setMessage('');
        } catch (error) {
            console.error('Erreur lors de la connexion !', error.response?.data || error.message);
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
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <p>Mot de passe*</p>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='btn btn-peach'>Connexion</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginFormUsers;
