const express = require('express');
const router = express.Router();
const validation = require('../Utils/validacao');  // Supondo que o esquema de validação esteja no arquivo 'validacao.js'
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// Funções utilitárias
const Consulta  = require('../Utils/consulta');   // Função para SELECT
const Cadastro  = require('../Utils/cadastro');   // Função para INSERT
const Alteracao = require('../Utils/alteracao');  // Função para UPDATE
const Delete    = require('../Utils/delete');     // Função para DELETE

// Rota para buscar todos os procedimentos
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Procedimentos WHERE d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, req.body, res);
});

// Rota para buscar um procedimento por ID
router.get('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `SELECT * FROM Procedimentos WHERE cd_procedimentos = ? AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id], res);
});

// Rota para criar um novo procedimento
router.post('/', ValidToken, (req, res) => {
  // Validar os dados de entrada
  const { error } = validation.procedimentoSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  Cadastro.execSQLQuery(req.body, res, 'Procedimentos');
});

// Rota para atualizar um procedimento existente
router.put('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  // Validar os dados de entrada
  const { errorUpdate } = validation.procedimentoSchema.validate(req.body);
  if (errorUpdate) return res.status(400).json({ error: errorUpdate.details[0].message });

  Alteracao.execSQLQuery({ ...req.body, cd_procedimentos: id }, res, 'Procedimentos');
});

// Rota para deletar um procedimento (marca como deletado)
router.delete('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `UPDATE Procedimentos SET d_e_l_e_t_ = '*' WHERE cd_procedimentos = ?`;
  Delete.execSQLQuery([id], res, 'Procedimentos');
});

module.exports = router;
