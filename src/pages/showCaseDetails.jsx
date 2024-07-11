import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ShowcaseDetails = () => {
    const { id } = useParams();
    const [showcase, setShowcase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShowcase = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/showcases/${id}`);
                setShowcase(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du showcase :', error);
                setError('Erreur lors de la récupération des détails du showcase.');
            } finally {
                setLoading(false);
            }
        };

        fetchShowcase();
    }, [id]);

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {showcase && (
                <div>
                    <h1>{showcase.game}</h1>
                    <p><span>Description :</span> {showcase.description}</p>
                    <p><span>Description du jeu :</span> {showcase.game_description}</p>
                    <p><span>Date :</span> {showcase.date}</p>
                    <p><span>Lieu :</span> {showcase.localisation}</p>
                    <p><span>Équipes :</span> {showcase.teams}</p>
                </div>
            )}
        </div>
    );
};

export default ShowcaseDetails;
