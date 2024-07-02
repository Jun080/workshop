import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [nom, setNom] = useState('');
    const [prénom, setPrénom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!nom) {
                throw new Error('Le nom est requis.');
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, {
                nom,
                prénom,
                email,
                password
            });
            console.log(response.data);

            setNom('');
            setPrénom('');
            setEmail('');
            setPassword('');

            setMessage('Utilisateur ajouté avec succès.');
        } catch (error) {
            console.error('There was an error adding the user!', error.message);
            setMessage('Utilisateur non ajouté.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                <input type="text" placeholder="Prénom" value={prénom} onChange={(e) => setPrénom(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Ajouter utilisateur</button>
            </form>
            {message && <p>{message}</p>}            
        </div>
    );
};

export default UserForm;
