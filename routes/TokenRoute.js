const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { ValidToken } = require('../Utils/ValidToken');

// CRUD utils
const Consulta = require('../Utils/consulta');
const Cadastro = require('../Utils/cadastro');
const Alteracao = require('../Utils/alteracao');
const Delete = require('../Utils/delete');

// Data atual
const dataAtual = new Date().toISOString().split('T')[0];

// Joi schema para login
const loginSchema = Joi.object({
  nm_user: Joi.string().max(20).required(),
  cd_pass: Joi.string().max(20).required()
});

// Joi schema para criação/edição de token
const tokenSchema = Joi.object({
  nm_user: Joi.string().max(20).required(),
  cd_pass: Joi.string().max(200).required(),
  nm_empresa: Joi.string().max(100).required(),
  dt_valid: Joi.date().required()
});

// GET: todos os tokens válidos
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Token WHERE dt_valid > ? AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [dataAtual], res);
});

// GET: token por ID
router.get('/find/id/:id', ValidToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const sqlQuery = `SELECT * FROM Token WHERE id = ? AND dt_valid > ? AND d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, [id, dataAtual], res);
});

// POST: login do usuário
router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { nm_user, cd_pass } = req.body;
       const sql = `SELECT * FROM Token WHERE nm_user='${nm_user}' AND dt_valid > '${dataAtual}' AND cd_pass = '${cd_pass}' AND d_e_l_e_t_ <> '*'`;

    Consulta.execSQLQuery(sql, [], res, async (result) => {
      if (result.length > 0) {
        const match = await bcrypt.compare(cd_pass, result[0].cd_pass);
        console.log( result[0].cd_pass)
        console.log( cd_pass)
        
        if (match) {
          res.status(200).json({
            message: 'Login successful',
            user: {
              id: result[0].id,
              nm_empresa: result[0].nm_empresa,
              nm_user: result[0].nm_user,
              dt_valid: result[0].dt_valid,
              env_senha: result[0].cd_pass,
              rec_senha: cd_pass
            }
          });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: criar novo token
router.post('/', ValidToken, async (req, res) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const dados = { ...req.body };
    dados.cd_pass = await bcrypt.hash(dados.cd_pass, 10); // hash da senha

    Cadastro.execSQLQuery(dados, res, 'Token');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar token' });
  }
});

// PUT: atualizar token existente
router.put('/', ValidToken, async (req, res) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const dados = { ...req.body };
    dados.cd_pass = await bcrypt.hash(dados.cd_pass, 10); // atualiza hash da senha

    Alteracao.execSQLQuery(dados, res, 'Token');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar token' });
  }
});

// DELETE: soft delete de token
router.delete('/', ValidToken, (req, res) => {
  const dados = req.body;
  Delete.execSQLQuery(dados, res, 'Token');
});

module.exports = router;
