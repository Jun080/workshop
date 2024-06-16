const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const SECRET_KEY = 'votre_secret_key';

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asihXcPDyR2PHXd',
    database: 'workshopjo'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// pour ajouter les données des clients dans la table users
app.post('/api/users', (req, res) => {
    const { nom, prénom, email, password } = req.body;

    const sql = 'INSERT INTO users (nom, prénom, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prénom, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data' });
            return;
        }
        console.log('1 record inserted');
        res.status(200).json({ message: 'User added successfully' });
    });    
});

// pour ajouter les données des entreprises dans la table corporate_clients
app.post('/api/corporate_clients', (req, res) => {
    const { company_name, company_email, company_password } = req.body;

    const sql = 'INSERT INTO corporate_clients (company_name, company_email, company_password) VALUES (?, ?, ?)';
    db.query(sql, [company_name, company_email, company_password], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données :', err);
            res.status(500).json({ error: 'Erreur lors de l\'insertion des données' });
            return;
        }
        console.log('1 enregistrement inséré');
        res.status(200).json({ message: 'Entreprise ajoutée avec succès' });
    });    
});

// connexion au compte client
app.post('/api/login', (req, res) => {
    const { email, password, userType } = req.body;

    const table = userType === 'users';

    connection.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Erreur du serveur.');
        }

        if (results.length === 0) {
            return res.status(400).send('Email ou mot de passe incorrect.');
        }

        const user = results[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Email ou mot de passe incorrect.');
        }

        const token = jwt.sign({ id: user.id, userType }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
