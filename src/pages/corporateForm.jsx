// CorporateForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const CorporateForm = () => {
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPassword, setCompanyPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Vérifier si le nom de l'entreprise est vide
            if (!companyName) {
                throw new Error('Le nom de l\'entreprise est requis.');
            }

            const response = await axios.post('http://localhost:3001/api/corporate_clients', {
                company_name: companyName,
                company_email: companyEmail,
                company_password: companyPassword
            });
            console.log(response.data);
            // Réinitialiser les champs après succès
            setCompanyName('');
            setCompanyEmail('');
            setCompanyPassword('');
        } catch (error) {
            console.error('Il y a eu une erreur lors de l\'ajout de l\'entreprise !', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nom de l'entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <input type="email" placeholder="Email de l'entreprise" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe de l'entreprise" value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />
            <button type="submit">Ajouter entreprise</button>
        </form>
    );
};

export default CorporateForm;
