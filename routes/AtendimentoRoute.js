const express    = require('express');
const router     = express.Router();
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// CRUD
const Consulta   = require('../Utils/consulta');   // Função de GET (consulta)
const Cadastro   = require('../Utils/cadastro');   // Função de POST (inclusão)
const Alteracao  = require('../Utils/alteracao');  // Função de PUT (alteração)
const Delete     = require('../Utils/delete');     // Função de DELETE (remoção lógica)

// Find all --> Traz todos os Atendimentos
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Atendimentos WHERE d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [], res);  // Sem parâmetros
});

// Busca por ID
router.get('/get/:id', ValidToken, (req, res) => {
  let id = parseInt(req.params.id);  // Certifica que o ID é um número

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const sqlQuery = `SELECT * FROM Atendimentos WHERE id = $1 AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id], res);  // Usa parâmetros para evitar SQL Injection
});

// Busca por descrição do atendimento
router.get('/find/:id', ValidToken, (req, res) => {
  let id = req.params.id;

  const sqlQuery = `SELECT * FROM Atendimentos WHERE ds_Atendimento = $1 AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id], res);  // Usa prepared statements
});

// Alteração de cadastro ou senha
router.put('/', ValidToken, (req, res) => {
  const dados = req.body;

  if (!dados || Object.keys(dados).length === 0) {
    return res.status(400).json({ error: 'Dados inválidos para alteração' });
  }

  Alteracao.execSQLQuery(dados, res, 'Atendimentos');
});

// Inclusão de novo titular ou dependente
router.post('/', ValidToken, (req, res) => {
  const dados = req.body;

  if (!dados || Object.keys(dados).length === 0) {
    return res.status(400).json({ error: 'Dados inválidos para inclusão' });
  }

  Cadastro.execSQLQuery(dados, res, 'Atendimentos'); 
});

// Marca como deletado mantendo o histórico dos dados
router.delete('/', ValidToken, (req, res) => {
  const dados = req.body;

  if (!dados || !dados.id) {
    return res.status(400).json({ error: 'ID inválido para exclusão' });
  }

  Delete.execSQLQuery(sqlQuery, [dados.id], res, 'Atendimentos');  // Soft delete usando prepared statement
});

module.exports = router;
