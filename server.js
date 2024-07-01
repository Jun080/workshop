const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env

const app = express();
const port = process.env.PORT || 3001; // Utilise le port défini dans les variables d'environnement ou 3001 par défaut

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const SECRET_KEY = process.env.SECRET_KEY; // Utilise la clé secrète définie dans les variables d'environnement

app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route pour ajouter les données des clients dans la table users
app.post('/api/users', async (req, res) => {
    const { nom, prénom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (nom, prénom, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prénom, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        res.status(200).json({ message: 'User added successfully' });
    });    
});

// Route pour ajouter les données des entreprises dans la table corporate_clients
app.post('/api/corporate_clients', async (req, res) => {
    const { company_name, company_email, company_password } = req.body;
    const hashedPassword = await bcrypt.hash(company_password, 10);

    const sql = 'INSERT INTO corporate_clients (company_name, company_email, company_password) VALUES (?, ?, ?)';
    db.query(sql, [company_name, company_email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err);
            res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
            return;
        }
        res.status(200).json({ message: 'Entreprise ajoutée avec succès' });
    });    
});

// Route de connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', err);
            res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur' });
            return;
        }
        if (results.length === 0) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            return;
        }

        const token = jwt.sign({ userId: user.id, nom: user.nom }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token, nom: user.nom });
    });
});

// Route pour inscrire un utilisateur à un tournoi
app.post('/api/register', (req, res) => {
    const { userId, tournamentId } = req.body;

    const sql = 'INSERT INTO registrations (user_id, tournament_id) VALUES (?, ?)';
    db.query(sql, [userId, tournamentId], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'inscription :', err);
            res.status(500).json({ error: 'Erreur lors de l\'inscription' });
            return;
        }
        res.status(200).json({ message: 'Inscription réussie' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
