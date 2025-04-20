// src-backend/app.js
// require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Importação de rotas
const routes = {
  input: require('../routes/input'),
  person: require('../routes/personRoute'),
  beneficiario: require('../routes/BeneficiarioRoute'),
  agenda: require('../routes/AgendasRoute'),
  medico: require('../routes/MedicosRoute'),
  medicamento: require('../routes/MedicamentoRoute'),
  atendimento: require('../routes/AtendimentoRoute'),
  especialidade: require('../routes/EspecialidadeRoute'),
  procedimentos: require('../routes/ProcedimentosRoute'),
  titulos: require('../routes/TitulosRoute'),
  protected: require('../routes/ProtectedRoute'),
  dashboard: require('../routes/DashboardRoute'),
  token: require('../routes/TokenRoute'),
};

// Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Servir arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../client/build')));

// Rotas da API
app.use('/input', routes.input);
app.use('/persons', routes.person);
app.use('/beneficiario', routes.beneficiario);
app.use('/agenda', routes.agenda);
app.use('/medico', routes.medico);
app.use('/medicamento', routes.medicamento);
app.use('/atendimento', routes.atendimento);
app.use('/especialidade', routes.especialidade);
app.use('/procedimentos', routes.procedimentos);
app.use('/titulos', routes.titulos);
app.use('/protected', routes.protected);
app.use('/dashboard', routes.dashboard);
app.use('/token', routes.token);

// Redirecionar todas as outras rotas para o index.html do React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

module.exports = app;
