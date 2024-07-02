import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

        try {
            const response = await axios.post(`http://localhost:3001/api/login`, {
                email,
                password
            });

            const { token, nom } = response.data;

            // Stocker le jeton dans le localStorage
            localStorage.setItem('token', token);

            // Appeler la fonction onLogin avec le nom de l'utilisateur 
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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Connexion</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginForm;
