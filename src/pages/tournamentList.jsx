import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tournaments`);
                console.log("Tournaments fetched successfully", response.data);
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments().catch(console.error);
    }, []);

    return (
        <div>
            <h1>Liste des tournois</h1>
            <div>
                {tournaments.map(tournament => (
                    <div key={tournament.id}>
                        <h2>{tournament.name}</h2>
                        <p>Jeu: {tournament.game}</p>
                        <p>Date: {tournament.date}</p>
                        <p>Lieu: {tournament.localisation}</p>
                        <Link to={`/tournois/${tournament.id}`}>Détails</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tournament;
