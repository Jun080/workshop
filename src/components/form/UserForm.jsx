import React, { useState } from 'react';
import axios from 'axios';

import '../../cssPages/account.css'

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
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);

            if (error.response) {
                console.error('Response data:', error.response.data);
            }

            setMessage('Utilisateur non ajouté. Veuillez vérifier les informations saisies.');
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className='form-grid'>
                        <div>
                            <h3>Nom</h3>
                            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required/>
                        </div>
                        <div>
                            <h3>Prénom</h3>
                            <input type="text" placeholder="Prénom" value={prénom} onChange={(e) => setPrénom(e.target.value)} required/>
                        </div>
                    </div>
                    <div className='form-grid'>
                        <div>
                            <h3>Adresse mail</h3>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <h3>Mot de passe</h3>
                            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                    </div>
                </div>
                <button type="submit">Ajouter utilisateur</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserForm;
