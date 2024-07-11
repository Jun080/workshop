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

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decodedToken;
    next();
  });
};


// Route pour ajouter les données des clients dans la table users
app.post('/api/users', async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [nom, prenom, email, hashedPassword], (err, result) => {
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

    const token = jwt.sign({
      userId: user.Usersid,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email
    }, SECRET_KEY, { expiresIn: '24h' });

    res.status(200).json({ token, userId: user.Usersid, nom: user.nom, prenom: user.prenom, email: user.email });
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
    }, SECRET_KEY, { expiresIn: '24h' });

    // Envoyer le token JWT et d'autres informations si nécessaire
    res.status(200).json({ token, company_name: company.company_name });
  });
});

// Route pour récupérer les tournois
app.get('/api/tournaments', (req, res) => {
  const sql = 'SELECT tournaments_list.id, tournaments_list.name, tournaments_list.date, tournaments_list.localisation, tournaments_list.prices, images.filename, images.filepath, tournaments_list.format, games.name AS game FROM tournaments_list JOIN games ON tournaments_list.game_id = games.id LEFT JOIN images ON games.image_id = images.id';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tournaments:', err);
      res.status(500).json({ error: 'Error fetching tournaments' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/api/tournaments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT tournaments_list.id, tournaments_list.name, tournaments_list.date, tournaments_list.localisation, tournaments_list.prices, tournaments_list.description, games.name AS game FROM tournaments_list JOIN games ON tournaments_list.game_id = games.id WHERE tournaments_list.id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching tournament:', err);
      res.status(500).json({ error: 'Error fetching tournament' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Tournament not found' });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Route pour récupérer les 3 prochains tournois
app.get('/api/upcoming-tournaments', (req, res) => {
  const sql = `SELECT tournaments_list.id, tournaments_list.name, tournaments_list.date, tournaments_list.localisation, games.name AS game
               FROM tournaments_list 
               JOIN games ON tournaments_list.game_id = games.id
               WHERE tournaments_list.date >= CURDATE()
               ORDER BY tournaments_list.date ASC
               LIMIT 3`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching upcoming tournaments:', err);
      res.status(500).json({ error: 'Error fetching upcoming tournaments' });
      return;
    }
    res.status(200).json(results);
  });
});

app.post('/api/user-tournaments/register/:tournamentId', verifyToken, (req, res) => {
  const { tournamentId } = req.params;
  const userId = req.user.userId;

  const insertSql = 'INSERT INTO user_tournaments (user_id, tournament_id) VALUES (?, ?)';
  db.query(insertSql, [userId, tournamentId], (err, result) => {
    if (err) {
      console.error('Error registering user to tournament:', err);
      return res.status(500).json({ error: 'Error registering user to tournament' });
    }
    res.status(200).json({ message: 'User registered successfully to the tournament' });
  });
});

app.get('/api/user-tournaments', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const selectSql = `
    SELECT t.*, g.name AS game_name
    FROM tournaments_list t
           JOIN user_tournaments ut ON t.id = ut.tournament_id
           JOIN games g ON t.game_id = g.id
    WHERE ut.user_id = ?
  `;
  db.query(selectSql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user tournaments:', err);
      return res.status(500).json({ error: 'Error fetching user tournaments' });
    }
    res.status(200).json(results);
  });
});

app.delete('/api/user-tournaments/:tournamentId', verifyToken, (req, res) => {
  const userId = req.user.userId;
  const tournamentId = req.params.tournamentId;

  const deleteSql = `
    DELETE FROM user_tournaments
    WHERE user_id = ? AND tournament_id = ?
  `;
  db.query(deleteSql, [userId, tournamentId], (err, results) => {
    if (err) {
      console.error('Error deleting user tournament:', err);
      return res.status(500).json({ error: 'Error deleting user tournament' });
    }
    res.status(200).json({ message: 'Successfully unsubscribed from the tournament' });
  });
});

app.get('/api/showcases', (req, res) => {
  const sql = `
    SELECT 
      show_case.id, 
      show_case.localisation, 
      show_case.date, 
      show_case.description, 
      show_case.game_description, 
      games.name AS game,
      GROUP_CONCAT(show_case_teams.team_name SEPARATOR ', ') AS teams
    FROM show_case
    JOIN games ON show_case.game_id = games.id
    LEFT JOIN show_case_teams ON show_case.id = show_case_teams.show_case_id
    GROUP BY show_case.id, show_case.localisation, show_case.date, show_case.description, show_case.game_description, games.name
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching showcases:', err);
      res.status(500).json({ error: 'Error fetching showcases' });
      return;
    }
    res.status(200).json(results);
  });
});

// Récupérer les détails d'un showcase par ID
app.get('/api/showcases/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      show_case.id, 
      show_case.localisation, 
      show_case.date, 
      show_case.description, 
      show_case.game_description, 
      games.name AS game,
      GROUP_CONCAT(show_case_teams.team_name SEPARATOR ', ') AS teams
    FROM show_case
    JOIN games ON show_case.game_id = games.id
    LEFT JOIN show_case_teams ON show_case.id = show_case_teams.show_case_id
    WHERE show_case.id = ?
    GROUP BY show_case.id, show_case.localisation, show_case.date, show_case.description, show_case.game_description, games.name
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des détails du showcase :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des détails du showcase' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Showcase non trouvé' });
      return;
    }
    res.status(200).json(results[0]);
  });
});


app.get('/api/mentorings', (req, res) => {
  const sql = 'SELECT * FROM mentoring';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des mentorats :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des mentorats' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/api/mentorings/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT mentoring.id, mentoring.localisation, mentoring.date, mentoring.mentor, mentoring.description FROM mentoring WHERE mentoring.id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de la session de mentorat :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de la session de mentorat' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Session de mentorat non trouvée' });
      return;
    }
    res.status(200).json(results[0]);
  });
});


app.post('/api/user-mentorings/register/:mentoringId', verifyToken, (req, res) => {
  const { mentoringId } = req.params;
  const userId = req.user.userId;

  const insertSql = 'INSERT INTO user_mentorings (user_id, mentoring_id) VALUES (?, ?)';
  db.query(insertSql, [userId, mentoringId], (err, result) => {
    if (err) {
      console.error('Error registering user to mentoring session:', err);
      return res.status(500).json({ error: 'Error registering user to mentoring session' });
    }
    res.status(200).json({ message: 'User registered successfully to the mentoring session' });
  });
});

app.get('/api/user-mentorings/:mentoringId', verifyToken, (req, res) => {
  const { mentoringId } = req.params;
  const userId = req.user.userId;

  const selectSql = `
        SELECT COUNT(*) AS count
        FROM user_mentorings
        WHERE user_id = ? AND mentoring_id = ?
    `;
  db.query(selectSql, [userId, mentoringId], (err, results) => {
    if (err) {
      console.error('Error checking user registration to mentoring:', err);
      return res.status(500).json({ error: 'Error checking user registration to mentoring' });
    }
    const isRegistered = results[0].count > 0;
    res.status(200).json({ isRegistered });
  });
});

app.delete('/api/user-mentorings/:mentoringId', verifyToken, (req, res) => {
  const { mentoringId } = req.params;
  const userId = req.user.userId;

  const deleteSql = `
    DELETE FROM user_mentorings
    WHERE user_id = ? AND mentoring_id = ?
  `;
  db.query(deleteSql, [userId, mentoringId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la session de mentorat de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression de la session de mentorat de l\'utilisateur' });
    }
    res.status(200).json({ message: 'Désinscription réussie de la session de mentorat' });
  });
});


app.get('/api/user-mentorships', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const selectSql = `
    SELECT m.*, DATE_FORMAT(m.date, '%Y-%m-%d') as formatted_date, m.localisation, m.mentor, m.description
    FROM user_mentorings um
    JOIN mentoring m ON um.mentoring_id = m.id
    WHERE um.user_id = ?
  `;
  db.query(selectSql, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des mentorings :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des mentorings' });
    }
    res.status(200).json(results);
  });
});





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
