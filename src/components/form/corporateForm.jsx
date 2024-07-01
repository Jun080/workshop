import React, { useState } from 'react';
import axios from 'axios';

const CorporateForm = () => {
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPassword, setCompanyPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!companyName) {
                throw new Error('Le nom de l\'entreprise est requis.');
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/corporate_clients`, {
                company_name: companyName,
                company_email: companyEmail,
                company_password: companyPassword
            });
            console.log(response.data);

            setCompanyName('');
            setCompanyEmail('');
            setCompanyPassword('');

            setMessage('Entreprise ajoutée avec succès.');
        } catch (error) {
            console.error('Il y a eu une erreur lors de l\'ajout de l\'entreprise !', error.message);
            setMessage('Entreprise non ajoutée.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom de l'entreprise" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                <input type="email" placeholder="Email de l'entreprise" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe de l'entreprise" value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />
                <button type="submit">Ajouter entreprise</button>
            </form>
            {message && <p>{message}</p>}               
        </div>
    );
};

export default CorporateForm;
