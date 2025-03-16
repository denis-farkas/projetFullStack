const mongoose = require('mongoose');
const DB_HOST = '127.0.0.1';
const DB_PORT = 27017;
const DB_NAME = 'tasksBase';
const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

module.exports = {
  DB_HOST : DB_HOST,
  DB_PORT : DB_PORT,
  DB_NAME : DB_NAME,
  DB_URI : DB_URI
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Base de données connectée');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Quitte le processus en cas d'erreur
  }
};

// Exporte à la fois la connexion et les variables de config
module.exports = { connectDB, DB_URI, DB_HOST, DB_PORT, DB_NAME };

