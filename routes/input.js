const express    = require('express');
const router     = express.Router();
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// CRUD
const Consulta   = require('../Utils/consulta');   // Importe a função Get
const Cadastro   = require('../Utils/cadastro');   // Importe a função Post
const Alteracao  = require('../Utils/alteracao');  // Importe a função Put
const Delete     = require('../Utils/delete');     // Importe a função Delete

// Find all --> traz todos os beneficiarios
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Beneficiarios where d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, res); 
});

// bucas por cpf ou email
router.get('/find/:id', ValidToken, (req, res) => {
  let id = req.params.id;
  const sqlQuery = `SELECT * FROM Beneficiarios WHERE (cd_cpf = '${id}' OR ds_email = '${id}') AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, res); 
});

// busca pelo titular e pelo dependente
router.get('/get/:id', ValidToken, (req, res) => {
  let id = parseInt(req.params.id);
  const sqlQuery = `SELECT * FROM Beneficiarios WHERE (id = ${id} OR id_titular = ${id}) AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, res); 
});

// Alteração de cadastro ou senha
router.put('/', ValidToken, (req, res) => {
  Alteracao.execSQLQuery(req.body, res, 'Beneficiarios');
});

// Inclusão do titular ou dependente
router.post('/', ValidToken, (req, res) => {
  Cadastro.execSQLQuery(req.body, res, 'Beneficiarios'); 
});

// Deletado mantendo o historico dos dados 
router.delete('/', ValidToken, (req, res) => {
  Delete.execSQLQuery(req.body, res, 'Beneficiarios'); 
});

module.exports = router;
