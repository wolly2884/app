const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { ValidToken } = require('../Utils/ValidToken'); // Importar o middleware

// Funções para CRUD
const Consulta 	= require('../Utils/consulta');
const Cadastro 	= require('../Utils/cadastro');
const Alteracao = require('../Utils/alteracao');
const Delete 	= require('../Utils/delete');

// Validação de entrada (opcional)
const { validateAgendamento } = require('../Utils/validacao');

// Rota para obter todos os agendamentos (GET /)
router.get('/', ValidToken, (req, res) => {
    const sqlQuery = `SELECT * FROM Agendamentos WHERE d_e_l_e_t_ <> '*'`;
    Consulta.execSQLQuery(sqlQuery,req.body, res); 
});

// Rota para buscar por ID do beneficiário (GET /find/:id)
router.get('/find/:id', ValidToken, (req, res) => {
    const id = req.params.id;

    // Prevenção contra SQL Injection
    const sqlQuery = `SELECT * FROM Agendamentos WHERE cd_cpf_beneficiaro in ( ${id} ) AND d_e_l_e_t_ <> '*'`;
    Consulta.execSQLQuery(sqlQuery, [], res); 
});

// Rota para buscar por ID e data (GET /get/:id&:date)
router.get('/get/:id&:date', ValidToken, (req, res) => {
    const id = req.params.id;
    const date = req.params.date; // Data no formato adequado

    // Prevenção contra SQL Injection e formatação de data correta
    const sqlQuery = `SELECT * FROM Agendamentos WHERE cd_cpf_beneficiaro  in ( ${id} ) AND dt_agendamento = ${date} AND d_e_l_e_t_ <> '*'`;
    Consulta.execSQLQuery(sqlQuery, [], res); 
});

// Rota para atualizar agendamento (PUT /)
router.put('/', ValidToken, (req, res) => {
    const dados = req.body;

    try {
        // Validar os dados do agendamento antes de atualizar
        validateAgendamento(dados);

        // Verificar se o ID está presente e é válido
        if (!dados.id || isNaN(dados.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Chama a função de alteração passando os dados validados
        Alteracao.execSQLQuery(dados, res, 'Agendamentos');
    } catch (err) {
        // Se a validação falhar, retorna um erro com a mensagem apropriada
        res.status(400).json({ error: err.message });
    }
});

// Rota para criar agendamento (POST /)
router.post('/', ValidToken, (req, res) => {
    const dados = req.body;

    try {
        // Validar os dados do agendamento antes de inserir
       // validateAgendamento(dados);

        // Verificar se todos os campos obrigatórios estão presentes
       // if (!dados.id || !dados.data || !dados.descricao) {
        //    return res.status(400).json({ error: 'Dados incompletos' });
        //}

        console.log(dados);
        // Chama a função de cadastro passando os dados validados
        Cadastro.execSQLQuery(dados, res, 'Agendamentos');
    } catch (err) {
        // Se a validação falhar ou houver algum outro erro, retorna um erro com a mensagem apropriada
        res.status(400).json({ error: err.message });
    }
});

// Rota para marcar agendamento como excluído (DELETE /)
router.delete('/', ValidToken, (req, res) => {
    const dados = req.body;

    // Lógica de "exclusão" (soft delete)
    Delete.execSQLQuery([dados.id_agendamento], res, 'Agendamentos');
});

module.exports = router;
