const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// CRUD
const Consulta = require('../Utils/consulta');   // Importe a função Get
const Cadastro = require('../Utils/cadastro');   // Importe a função Post
const Alteracao = require('../Utils/alteracao');  // Importe a função Put
const Delete = require('../Utils/delete');     // Importe a função Delete

// Find all --> traz todos os clientes
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = 'SELECT * FROM Clientes WHERE d_e_l_e_t_ <> "*"';
  Consulta.execSQLQuery(sqlQuery, res);
});

// Busca por ID
router.get('/find/:id', ValidToken, (req, res) => {
  let id = parseInt(req.params.id);
  const sqlQuery = `SELECT * FROM Clientes WHERE id = ${id} AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, res);
});

// Adiciona um novo cliente
router.post('/', ValidToken, (req, res) => {
  const dados = req.body;
  Cadastro.execSQLQuery(dados, res, 'Clientes');
});

// Atualiza um cliente existente
router.put('/', ValidToken, (req, res) => {
  const dados = req.body;
  Alteracao.execSQLQuery(dados, res, 'Clientes');
});

// Marca um cliente como deletado
router.delete('/', ValidToken, (req, res) => {
  const dados = req.body;
  Delete.execSQLQuery(dados, res, 'Clientes');
});

module.exports = router;
