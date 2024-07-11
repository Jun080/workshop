import React, { useEffect, useState } from 'react';
import '../cssPages/tournament.css'

import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tournaments`);
                console.log("Tournaments fetched successfully");
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments().catch(console.error);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: fr });
    };

    return (
        <div className='tournament-list'>
            <h1>Le prochain tournoi</h1>
            {tournaments.length > 0 && (
                <div className='first-card-tournament'>
                    <div className='infos'>
                        <div>
                            <h2>{tournaments[0].game}</h2>
                            <p><span>Format:</span> {tournaments[0].format}</p>
                            <p><span>Date:</span> {formatDate(tournaments[0].date)}</p>
                            <p><span>Lieu:</span> {tournaments[0].localisation}</p>
                            <p><span>Prix:</span> {tournaments[0].prices}</p>
                        </div>

                        <Link to={`/tournois/${tournaments[0].id}`} className='btn btn-peach'>Détails</Link>
                    </div>

                    {tournaments[0].filename && tournaments[0].filepath && (
                        <img
                            src={`/${tournaments[0].filepath}`}
                            alt={tournaments[0].filename}
                            className='col-lg-5'
                        />
                    )}
                </div>
            )}

            <h2 className='all-tournaments-title'>Tous les tournois</h2>
            <div className='cards-tournament-grid'>
                {tournaments.slice(1).map(tournament => (
                    <div key={tournament.id} className='card-tournament'>
                        <div>
                            <h3>{tournament.game}</h3>
                            <p><span>Format:</span> {tournament.format}</p>
                            <p><span>Date:</span> {formatDate(tournament.date)}</p>
                            <p><span>Lieu:</span> {tournament.localisation}</p>
                            <p><span>Prix:</span> {tournament.prices}</p>
                        </div>
                        <Link to={`/tournois/${tournament.id}`} className='btn btn-peach'>Détails</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournament;
