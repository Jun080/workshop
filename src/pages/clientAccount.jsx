import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LoginFormUsers from '../components/login/loginFormUsers.jsx';
import UserForm from '../components/form/UserForm';
import { Link } from 'react-router-dom';
import {format} from "date-fns";
import {fr} from "date-fns/locale";

const ClientAccount = () => {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [mentorships, setMentorships] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.company_name) {
            } else {
                const { nom, prénom } = decodedToken;
                setUser({ nom, prénom });

                fetchUserTournaments(token);
                fetchUserMentorships(token);
            }
        }
    }, []);

    const fetchUserTournaments = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-tournaments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTournaments(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des tournois:', error);
        }
    };

    const fetchUserMentorships = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-mentorships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Mentorships response:', response.data); // Vérifier la structure des données reçues
            setMentorships(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des mentorings :', error);
        }
    };



    const handleLogin = (nom, prénom) => {
        setUser({ nom, prénom });
        const token = localStorage.getItem('token');
        fetchUserTournaments(token);
        fetchUserMentorships(token);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setTournaments([]);
    };

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: fr });
    };

    const handleUnsubscribe = async (tournamentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/user-tournaments/${tournamentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mise à jour de l'état pour retirer le tournoi désinscrit
            setTournaments(prevTournaments => prevTournaments.filter(tournament => tournament.id !== tournamentId));
        } catch (error) {
            console.error('Erreur lors de la désinscription du tournoi:', error);
        }
    };

    return (
        <div className='account'>
            {user ? (
                <>
                    <div className='d-flex justify-content-between'>
                        <h1>Bonjour {user.prénom} {user.nom} !</h1>
                        <button onClick={handleLogout} className="btn btn-peach-outline log-out">Déconnexion</button>
                    </div>
                    <h2>Tournois auxquels vous êtes inscrit :</h2>
                    {tournaments.length > 0 ? (
                        <div className='cards-tournament-grid'>
                            {tournaments.map(tournament => (
                                <div key={tournament.id}>
                                    <Link to={`/tournoi/${tournament.id}`} className='card-tournament'>
                                        <div>
                                            <h2>{tournament.game_name}</h2>
                                            <p><span>Format:</span> {tournament.format}</p>
                                            <p><span>Date:</span> {formatDate(tournament.date)}</p>
                                            <p><span>Lieu:</span> {tournament.localisation}</p>
                                            <p><span>Prix:</span> {tournament.prices}€</p>
                                        </div>
                                        <button onClick={() => handleUnsubscribe(tournament.id)} className='btn btn-peach-outline log-out'>
                                            Se désinscrire
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Vous n'êtes inscrit à aucun tournoi pour le moment.</p>
                    )}

                    <h2>Mentorats auxquels vous êtes inscrit :</h2>
                    {mentorships.length > 0 ? (
                        <div className='cards-mentorship-grid'>
                            {mentorships.map(mentorship => (
                                <div key={mentorship.id}>
                                    <Link to={`/mentorat/${mentorship.id}`} className='card-mentorship'>
                                        <div>
                                            <h2>{mentorship.subject}</h2>
                                            <p><span>Date:</span> {formatDate(mentorship.date)}</p>
                                            <p><span>Lieu:</span> {mentorship.location}</p>
                                            <p><span>Formateur:</span> {mentorship.instructor}</p>
                                        </div>
                                        <button onClick={() => handleUnsubscribe(mentorship.id)}
                                                className='btn btn-peach-outline log-out'>
                                            Se désinscrire
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Vous n'êtes inscrit à aucun mentorat pour le moment.</p>
                    )}
                </>
            ) : (
                <>
                    {isRegistering ? (
                        <>
                            <h1>Créer un compte utilisateur</h1>
                            <UserForm/>
                            <p>
                                Vous avez déjà un compte ?{' '}
                                <a onClick={toggleForm} className='a-peach'>Connectez-vous</a>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1>Connectez-vous</h1>
                            <LoginFormUsers onLogin={handleLogin} />
                            <p>
                                Vous n'avez pas de compte ?{' '}
                                <a onClick={toggleForm} className='a-peach'>Créez-en un</a>
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ClientAccount;
