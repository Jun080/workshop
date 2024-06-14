const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
