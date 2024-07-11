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
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5249.98288205056!2d2.2919063759616796!3d48.858373600708376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1720670883870!5m2!1sfr!2sfr"
              width="600" height="450" allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          <SponsorsBanner/>
          <h2>newsletter</h2>
      </div>
  );
};

export default Homepage;