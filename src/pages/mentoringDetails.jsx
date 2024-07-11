import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';

const MentoringDetails = () => {
    const { id } = useParams();
    const [mentoring, setMentoring] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchMentoring = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mentorings/${id}`);
                setMentoring(response.data);
            } catch (error) {
                console.error('Error fetching mentoring session:', error);
            }
        };

        fetchMentoring();

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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-mentorings/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsUserRegistered(response.data.isRegistered);
            } catch (error) {
                console.error('Error checking user registration:', error);
            }
        };

        if (mentoring && userDetails) {
            checkUserRegistration();
        }
    }, [mentoring, userDetails, id]);

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

            await axios.post(`${process.env.REACT_APP_API_URL}/api/user-mentorings/register/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsUserRegistered(true);
        } catch (error) {
            console.error('Error registering user to mentoring session:', error);
            if (error.response && error.response.status === 401) {
                // Gérer le cas où l'utilisateur n'est pas autorisé
            }
        }
    };

    if (!mentoring) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h1>{mentoring.mentor}</h1>
                <p><span>Description:</span> {mentoring.description}</p>
                <p><span>Date:</span> {formatDate(mentoring.date)}</p>
                <p><span>Lieu:</span> {mentoring.localisation}</p>
            </div>
            {isUserLoggedIn && userDetails ? (
                <>
                    {isUserRegistered ? (
                        <p>Vous êtes déjà inscrit à cette session de mentoring.</p>
                    ) : (
                        <button onClick={handleRegistration}>Je m'inscris à la session de mentoring !</button>
                    )}
                </>
            ) : (
                <div>
                    <p>Connectez-vous pour vous inscrire à cette session de mentoring :</p>
                    <Link to="/compte-client" className='btn btn-peach'>Espace Client</Link>
                </div>
            )}
        </div>
    );
};

export default MentoringDetails;
