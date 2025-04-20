const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validation = require('../Utils/validacao'); // Import the validation schemas
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// CRUD
const Consulta  = require('../Utils/consulta');   // Função para SELECT
const Cadastro  = require('../Utils/cadastro');   // Função para INSERT
const Alteracao = require('../Utils/alteracao'); // Função para UPDATE
const Delete    = require('../Utils/delete');       // Função para DELETE

// Find all --> Traz todos os beneficiários
router.get('/', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Beneficiarios WHERE d_e_l_e_t_ <> '*'`;
  Consulta.execSQLQuery(sqlQuery, req.body, res);
});

// Find all --> Traz todos os Titulares
router.get('/titular', ValidToken, (req, res) => {
  const sqlQuery = `SELECT * FROM Beneficiarios WHERE d_e_l_e_t_ <> '*' AND ic_beneficiario = 'T' ORDER BY 2`;
  Consulta.execSQLQuery(sqlQuery, req.body, res);
});

// Busca por CPF ou e-mail
router.get('/find/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = Joi.string().required().validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `
    SELECT *
      FROM beneficiarios a
        WHERE a.id_titular = (
          SELECT id 
            FROM beneficiarios b
              WHERE (b.cd_cpf = $1 OR b.ds_email = $2) 
                AND b.ic_beneficiario = 'T' 
                AND b.d_e_l_e_t_ <> '*'
      ) 
      AND a.d_e_l_e_t_ <> '*'
    UNION 
      SELECT *
        FROM beneficiarios c
          WHERE (c.cd_cpf = $3 OR c.ds_email = $4)
            AND c.d_e_l_e_t_ <> '*'
      ORDER BY 1;
  `;

  Consulta.execSQLQuery(sqlQuery, [id, id, id, id], res); // Usando prepared statements para evitar SQL Injection
});


// Busca por CPF ou e-mail
router.get('/get/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = Joi.string().required().validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `
    SELECT *
      FROM beneficiarios a
        WHERE a.id_titular = (
          SELECT id 
            FROM beneficiarios b
              WHERE (b.id = $1 ) 
                AND b.ic_beneficiario = 'T' 
                AND b.d_e_l_e_t_ <> '*'
      ) 
      AND a.d_e_l_e_t_ <> '*'
    UNION 
      SELECT *
        FROM beneficiarios c
              WHERE (c.id = $2 ) 
                AND c.ic_beneficiario = 'T' 
            AND c.d_e_l_e_t_ <> '*'
      ORDER BY 1;
  `;

  Consulta.execSQLQuery(sqlQuery, [id, id], res); // Usando prepared statements para evitar SQL Injection
});

// Busca pelos dependentes de um titular
router.get('/get_d/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `SELECT * FROM Beneficiarios WHERE id_titular = $1 AND d_e_l_e_t_ <> '*'`;

  Consulta.execSQLQuery(sqlQuery, [parseInt(id)], res);
});

// Busca por titular específico
router.get('/get_t/:id', ValidToken, (req, res) => {
  const { id } = req.params;

  // Validar o formato do ID
  const { error } = validation.idSchema.validate(id);
  if (error) return res.status(400).json({ error: 'ID inválido' });

  const sqlQuery = `SELECT * FROM Beneficiarios 
                      WHERE id = $1 
                        AND d_e_l_e_t_ <> '*'`;
                        
  Consulta.execSQLQuery(sqlQuery, [parseInt(id)], res);
});

// Alteração de cadastro ou senha
router.put('/', ValidToken, (req, res) => {
  
  // Validar os dados de entrada
  //const { error } = validation.updateSchema.validate(req.body);
  //if (error) return res.status(400).json({ error: error.details[0].message });

  Alteracao.execSQLQuery(req.body, res, 'Beneficiarios');
});

// Inclusão de titular ou dependente
router.post('/', ValidToken, (req, res) => {

  // Validar os dados de entrada
  //const { error } = validation.beneficiarySchema.validate(req.body);
  //if (error) return res.status(400).json({ error: error.details[0].message });
  console.log(req.body);

  Cadastro.execSQLQuery(req.body, res, 'Beneficiarios');
});

// Marca como deletado mantendo o histórico dos dados
router.delete('/', ValidToken, (req, res) => {

  // Validar os dados de entrada
  const { error } = validation.deleteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  Delete.execSQLQuery(req.body, res, 'Beneficiarios');
});

module.exports = router;
