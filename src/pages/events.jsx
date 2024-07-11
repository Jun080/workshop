import React, { useEffect, useState } from 'react';
import '../cssPages/tournament.css';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ShowCase = () => {
    const [showcases, setShowcases] = useState([]);
    const [mentorings, setMentorings] = useState([]);

    useEffect(() => {
        const fetchShowcases = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/showcases`);
                console.log("Showcases fetched successfully");
                setShowcases(response.data);
            } catch (error) {
                console.error('Error fetching showcases:', error);
            }
        };

        const fetchMentorings = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mentorings`);
                console.log("Mentorings fetched successfully");
                setMentorings(response.data);
            } catch (error) {
                console.error('Error fetching mentorings:', error);
            }
        };

        fetchMentorings().catch(console.error);
        fetchShowcases().catch(console.error);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy', { locale: fr });
    };

    return (
        <div className='showcase-list'>
            <h1>Le prochain showcase</h1>
            {showcases.length > 0 && (
                <div className='first-card-showcase'>
                    <div className='infos'>
                        <div>
                            <h2>{showcases[0].game}</h2>
                            <p><span>Description:</span> {showcases[0].description}</p>
                            <p><span>Game Description:</span> {showcases[0].game_description}</p>
                            <p><span>Date:</span> {formatDate(showcases[0].date)}</p>
                            <p><span>Lieu:</span> {showcases[0].localisation}</p>
                            <p><span>Équipes:</span> {showcases[0].teams}</p>
                        </div>
                        <Link to={`/showcases/${showcases[0].id}`} className='btn btn-peach'>Détails</Link>
                    </div>
                </div>
            )}

            <h2 className='all-showcases-title'>Tous les showcases</h2>
            <div className='cards-showcase-grid'>
                {showcases.slice(1).map(showcase => (
                    <div key={showcase.id} className='card-showcase'>
                        <div>
                            <h3>{showcase.game}</h3>
                            <p><span>Description:</span> {showcase.description}</p>
                            <p><span>Game Description:</span> {showcase.game_description}</p>
                            <p><span>Date:</span> {formatDate(showcase.date)}</p>
                            <p><span>Lieu:</span> {showcase.localisation}</p>
                            <p><span>Équipes:</span> {showcase.teams}</p>
                        </div>
                        <Link to={`/showcases/${showcase.id}`} className='btn btn-peach'>Détails</Link>
                    </div>
                ))}
            </div>

            <div className='mentoring-list'>
                <h2>Sessions de Mentorat</h2>
                {mentorings.map(mentoring => (
                    <div key={mentoring.id} className='card-mentoring'>
                        <div>
                            <h3>{mentoring.mentor}</h3>
                            <p><span>Description:</span> {mentoring.description}</p>
                            <p><span>Date:</span> {formatDate(mentoring.date)}</p>
                            <p><span>Lieu:</span> {mentoring.localisation}</p>
                            <Link to={`/mentorings/${mentoring.id}`} className='btn btn-peach'>Détails</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowCase;
