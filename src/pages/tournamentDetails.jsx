import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TournamentDetails = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/tournaments/${id}`);
                setTournament(response.data);
            } catch (error) {
                console.error('Error fetching tournament details:', error);
            }
        };

        fetchTournament();
    }, [id]);

    if (!tournament) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{tournament.name}</h1>
            <p>Jeu: {tournament.game}</p>
            <p>Date: {tournament.date}</p>
            <p>Lieu: {tournament.localisation}</p>
            <p>Prix: {tournament.prices}</p>
        </div>
    );
};

export default TournamentDetails;
