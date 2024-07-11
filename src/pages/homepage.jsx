import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {format} from "date-fns";
import {fr} from "date-fns/locale";

import SponsorsBanner from "../components/sponsorsBanner.jsx"

const Homepage = () => {
    const [upcomingTournaments, setUpcomingTournaments] = useState([]);

    useEffect(() => {
        const fetchUpcomingTournaments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/upcoming-tournaments`);
                setUpcomingTournaments(response.data);
            } catch (error) {
                console.error('Error fetching upcoming tournaments:', error);
            }
        };

        fetchUpcomingTournaments();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: fr });
    };

  return (
    <div>
        <h2>Prochains tournois</h2>
        {upcomingTournaments.length === 0 ? (
            <p>Aucun tournoi à venir pour le moment.</p>
        ) : (
            <div className='cards-tournament-grid'>
                {upcomingTournaments.map(tournament => (
                    <div key={tournament.id} className='card-tournament'>
                        <h2>{tournament.name}</h2>
                        <p><span>Jeu:</span> {tournament.game}</p>
                        <p><span>Date:</span> {formatDate(tournament.date)}</p>
                        <p><span>Lieu:</span> {tournament.localisation}</p>
                        <Link to={`/tournois/${tournament.id}`} className='btn btn-peach'>Détails</Link>
                    </div>
                ))}
            </div>
        )}
        <h2>maps</h2>
        <SponsorsBanner />
        <h2>newsletter</h2>
    </div>
  );
};

export default Homepage;