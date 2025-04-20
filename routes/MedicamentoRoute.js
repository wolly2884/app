const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// CRUD
const Consulta = require('../Utils/consulta');   // Função para SELECT
const Cadastro = require('../Utils/cadastro');   // Função para INSERT
const Alteracao = require('../Utils/alteracao'); // Função para UPDATE
const Delete = require('../Utils/delete');       // Função para DELETE

// Find all --> Traz todos os medicamentos
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Medicamentos WHERE d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, req.body, res);
});

// Busca por código do medicamento
router.get('/find/:id', ValidToken, (req, res) => {
  let id = req.params.id;
  const sqlQuery = `SELECT * FROM Medicamentos WHERE cd_Medicamento = $1 AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery ,[id] , res); // Usando prepared statement
});

// Busca por ID do medicamento
router.get('/get/:id', ValidToken, (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const sqlQuery = `SELECT * FROM Medicamentos WHERE id = $1 AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id], res); // Usando prepared statement
});

// Alteração de medicamento
router.put('/', ValidToken, (req, res) => {
  Alteracao.execSQLQuery(req.body, res, 'Medicamentos');
});

// Inclusão de novo medicamento
router.post('/', ValidToken, (req, res) => {
  console.log(req.body);
  Cadastro.execSQLQuery(req.body, res, 'Medicamentos');
});

// Marca como deletado mantendo o histórico dos dados
router.delete('/', ValidToken, (req, res) => {
  Delete.execSQLQuery(req.body, res, 'Medicamentos');
});

module.exports = router;
