const express = require("express"); // Framework JS
const mongoose = require("mongoose"); // MongoDB
const dotenv = require("dotenv"); // Pour stocker les variables d'environnements
const helmet = require("helmet"); // Pour la sécurité HHTPS
const morgan = require("morgan"); // Pour les logs et résultats des requêtes
const { httpRequestCounter, register } = require('./metrics');
const logger = require('./logger');

dotenv.config();

// 🚗 Routes
const movieRoute = require("./routes/movies")

// ➡️ Module imports :
//const swagger = require("./doc/swagger.js");

// ⛰️ Environment variables :
const port = process.env.FILM_API_PORT;

const app = express();

// Connexion à MongoDB :
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✔️  Film API connected to MongoDB."))
    .catch((err) => console.log(err));

// Middleware :
app.use(express.json()); // Body parser for POST requests
app.use(helmet());
app.use(morgan("common"));

// Middleware pour compter les requêtes HTTP
app.use((req, res, next) => {
    httpRequestCounter.labels(req.method, req.path).inc();
    next();
});

// Route pour exposer les métriques
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Logger
app.use((req, res, next) => {
    logger.info(`Requête ${req?.method} sur ${req?.path}`);
    next();
  });


// =====> API Routes
app.use("/api/movies", movieRoute);

app.listen(port, '0.0.0.0', () => {
    console.log("✔️  Film API running on port " + port + "...")
})