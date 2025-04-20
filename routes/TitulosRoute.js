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

// Rota para buscar todos os títulos de beneficiários
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM titulos_beneficiario WHERE d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [], res);
});

// Rota para buscar um título de beneficiário por ID
router.get('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `SELECT * FROM titulos_beneficiario WHERE id_titulo = $1 AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id], res);
});

// Rota para criar um novo título de beneficiário
router.post('/', ValidToken, (req, res) => {

  // Validar os dados de entrada
  const { error } = validation.tituloBeneficiarioSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  Cadastro.execSQLQuery(req.body, res, 'titulos_beneficiario');
});

// Rota para atualizar um título de beneficiário existente
router.put('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  // Validar os dados de entrada
  const { errorUpdate } = validation.tituloBeneficiarioSchema.validate(req.body);
  if (errorUpdate) return res.status(400).json({ error: errorUpdate.details[0].message });

  Alteracao.execSQLQuery({ ...req.body, id_titulo: id }, res, 'titulos_beneficiario');
});

// Rota para deletar um título de beneficiário (marca como deletado)
router.delete('/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  Delete.execSQLQuery([id], res, 'titulos_beneficiario');
});

module.exports = router;
