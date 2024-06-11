const client = require('prom-client');

// Crée un registre
const register = new client.Registry();

// Crée une métrique de type compteur
const httpRequestCounter = new client.Counter({
  name: 'http_request_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'endpoint']
});

// Enregistre la métrique
register.registerMetric(httpRequestCounter);

// Exporte le registre
module.exports = { httpRequestCounter, register };
