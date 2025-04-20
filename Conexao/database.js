require('dotenv').config();

/*/ database.js
const mysql = require('mysql');

// Configuração da conexão
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "lp4"
});

module.exports = connection;
*/

const { Client } = require('pg');
  
// Configuração da conexão
  const client = new Client({
    user:     process.env.DB_USER,
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port:     process.env.DB_PORT, 
    ssl: { rejectUnauthorized: false } 
  });
  
  client.connect()
    .then(() => console.log('Conectado ao banco de dados'))
    .catch(err => console.error('Erro ao conectar ao banco de dados', err));
module.exports = client;
