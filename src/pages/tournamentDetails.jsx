import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';

const TournamentDetails = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [filteredTournaments, setFilteredTournaments] = useState([]);


    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tournaments/${id}`);
                setTournament(response.data);
            } catch (error) {
                console.error('Error fetching tournament:', error);
            }
        };

        fetchTournament();

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setIsUserLoggedIn(true);
                setUserDetails(decodedToken);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [id]);

    useEffect(() => {
        const checkUserRegistration = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-tournaments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsUserRegistered(response.data.isRegistered);
            } catch (error) {
                console.error('Error checking user registration:', error);
            }
        };

        if (tournament && userDetails) {
            checkUserRegistration();
        }
    }, [tournament, userDetails, id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: fr });
    };

    const handleRegistration = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. User must be logged in.');
                return;
            }

            await axios.post(`${process.env.REACT_APP_API_URL}/api/user-tournaments/register/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsUserRegistered(true);
        } catch (error) {
            console.error('Error registering user to tournament:', error);
            if (error.response && error.response.status === 401) {
                // Gérer le cas où l'utilisateur n'est pas autorisé
            }
        }
    };

    if (!tournament) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h1>{tournament.name}</h1>
                <div>
                    <p><span>Jeu:</span> {tournament.game}</p>
                    <p><span>Format:</span> {tournament.format}</p>
                    <p><span>Date:</span> {formatDate(tournament.date)}</p>
                    <p><span>Lieu:</span> {tournament.localisation}</p>
                    <p><span>Prix:</span> {tournament.prices}</p>
                    <p><span>Description:</span> {tournament.description}</p>
                </div>
                {filteredTournaments[0].filename && filteredTournaments[0].filepath && (
                    <img
                        src={`/${filteredTournaments[0].filepath}`}
                        alt={filteredTournaments[0].filename}
                        className='col-lg-5'
                    />
                )}

            </div>
            {isUserLoggedIn && userDetails ? (
                <>
                    {isUserRegistered ? (
                        <p>You are already registered for this tournament.</p>
                    ) : (
                        <button onClick={handleRegistration} className='btn btn-peach'>Je m'inscris au tournoi
                            !</button>
                    )}
                </>
            ) : (
                <div>
                    <p>Connectez-vous pour vous inscrire à ce tournoi :</p>
                    <Link to="/compte-client" className='btn btn-peach'>Espace Client</Link>
                </div>
            )}
        </div>
    );
};

export default TournamentDetails;