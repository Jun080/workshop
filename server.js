import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const SECRET_KEY = process.env.SECRET_KEY;

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

app.post('/api/corporate', async (req, res) => {
  const { company_name, company_email, company_password } = req.body;
  const hashedPassword = await bcrypt.hash(company_password, 10);

  const sql = 'INSERT INTO corporate_clients (company_name, company_email, company_password) VALUES (?, ?, ?)';
  db.query(sql, [company_name, company_email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Error inserting data' });
      return;
    }
    res.status(200).json({ message: 'Company added successfully' });
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

app.post('/api/corporate/login', (req, res) => {
  const { company_email, company_password } = req.body;

  // Recherche de l'entreprise dans la base de données par email
  const sql = 'SELECT * FROM corporate_clients WHERE company_email = ?';
  db.query(sql, [company_email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'entreprise :', err);
      res.status(500).json({ error: 'Erreur lors de la recherche de l\'entreprise' });
      return;
    }

    // Vérifier si l'entreprise existe
    if (results.length === 0) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Récupérer les données de l'entreprise à partir des résultats de la requête
    const company = results[0];

    // Vérifier le mot de passe hashé
    const isPasswordValid = await bcrypt.compare(company_password, company.company_password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer un token JWT pour l'entreprise
    const token = jwt.sign({
      companyId: company.id,
      company_name: company.company_name
    }, SECRET_KEY, { expiresIn: '1h' });

    // Envoyer le token JWT et d'autres informations si nécessaire
    res.status(200).json({ token, company_name: company.company_name });
  });
});

// Route pour récupérer les tournois
app.get('/api/tournaments', (req, res) => {
  const sql = 'SELECT tournaments.id, tournaments.name, tournaments.date, tournaments.localisation, games.name AS game FROM tournaments JOIN games ON tournaments.game_id = games.id';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tournaments:', err);
      res.status(500).json({ error: 'Error fetching tournaments' });
      return;
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
