import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [nom, setNom] = useState('');
    const [prénom, setPrénom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Vérifier si le nom est vide
            if (!nom) {
                throw new Error('Le nom est requis.');
            }

            const response = await axios.post('http://localhost:3001/api/users', {
                nom,
                prénom,
                email,
                password
            });
            console.log(response.data);
            // Réinitialiser les champs après succès
            setNom('');
            setPrénom('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('There was an error adding the user!', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            <input type="text" placeholder="Prénom" value={prénom} onChange={(e) => setPrénom(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Ajouter utilisateur</button>
        </form>
    );
};

export default UserForm;
