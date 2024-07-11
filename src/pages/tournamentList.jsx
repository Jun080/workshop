import React, { useEffect, useState } from 'react';
import '../cssPages/tournament.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    const [location, setLocation] = useState('');
    const [game, setGame] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [locations, setLocations] = useState([]);
    const [games, setGames] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tournaments`);
                console.log("Tournaments fetched successfully");
                setTournaments(response.data);
                setFilteredTournaments(response.data);
                setLocations([...new Set(response.data.map(t => t.localisation))]);
                setGames([...new Set(response.data.map(t => t.game))]);
                setDates([...new Set(response.data.map(t => format(new Date(t.date), 'yyyy-MM-dd')))]);
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

    const handleFilter = () => {
        let filtered = tournaments;

        if (location) {
            filtered = filtered.filter(tournament => tournament.localisation === location);
        }
        if (game) {
            filtered = filtered.filter(tournament => tournament.game === game);
        }
        if (selectedDate) {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            filtered = filtered.filter(tournament => format(new Date(tournament.date), 'yyyy-MM-dd') === formattedDate);
        }

        setFilteredTournaments(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [location, game, selectedDate]);

    return (
        <div className='tournament-list'>
            <div className='filters'>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value=''>Toutes les localisations</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>

                <select value={game} onChange={(e) => setGame(e.target.value)}>
                    <option value=''>Tous les jeux</option>
                    {games.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>

                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Sélectionner une date"
                    locale={fr}
                />

            </div>

            <h1>Le prochain tournoi</h1>
            {filteredTournaments.length > 0 && (
                <div className='first-card-tournament'>
                    <div className='infos'>
                        <div>
                            <h2>{filteredTournaments[0].game}</h2>
                            <p><span>Format:</span> {filteredTournaments[0].format}</p>
                            <p><span>Date:</span> {formatDate(filteredTournaments[0].date)}</p>
                            <p><span>Lieu:</span> {filteredTournaments[0].localisation}</p>
                            <p><span>Prix:</span> {filteredTournaments[0].prices}</p>
                        </div>

                        <Link to={`/tournois/${filteredTournaments[0].id}`} className='btn btn-peach'>Détails</Link>
                    </div>

                    {filteredTournaments[0].filename && filteredTournaments[0].filepath && (
                        <img
                            src={`/${filteredTournaments[0].filepath}`}
                            alt={filteredTournaments[0].filename}
                            className='col-lg-5'
                        />
                    )}
                </div>
            )}

            <h2 className='all-tournaments-title'>Tous les tournois</h2>
            <div className='cards-tournament-grid'>
                {filteredTournaments.slice(1).map(tournament => (
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
