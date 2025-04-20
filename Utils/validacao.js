// utils/validacao.js
// validation.js
const Joi = require('joi');

const idSchema = Joi.number().integer().positive().required();

// Esquema de validação para beneficiário
const beneficiarioSchema =          Joi.object({
  nm_beneficiario:                  Joi.string().max(50).required(),
  cd_cpf:                           Joi.string().length(11).pattern(/^\d+$/).required(),
  cd_password:                      Joi.string().max(20).required(),
  cd_age:                           Joi.date().iso().required(),
  cd_cardnumber:                    Joi.string().length(20).pattern(/^\d+$/).required(),
  ds_email:                         Joi.string().email().max(40).required(),
  ds_healthplan:                    Joi.string().max(40).required(),
  cd_cns:                           Joi.string().length(17).pattern(/^\d+$/).optional().allow(null),
  ic_beneficiario:                  Joi.string().valid('T', 'D').optional().allow(null),
  id_titular:                       Joi.number().integer().optional().allow(null)
}); 

// Função para validar os dados do beneficiário
const validateBeneficiario = (data) => {
  const { error } = beneficiarioSchema.validate(data);
  if (error) {
    throw new Error(`Erro de validação: ${error.details.map(detail => detail.message).join(', ')}`);
  }
};

// Esquema de validação para agendamentos
const agendamentoSchema =           Joi.object({
  id:                               Joi.number().integer().positive().required(),
  cd_cpf_beneficiaro:               Joi.string().length(11).required(),
  dt_agendamento:                   Joi.date().iso().required(),
  descricao:                        Joi.string().min(3).max(255).optional(),
  // Adicione outros campos conforme necessário
});

// Função para validar os dados de agendamento
const validateAgendamento = (data) => {
  const { error } = agendamentoSchema.validate(data);
  if (error) {
    throw new Error(`Erro de validação: ${error.details.map(detail => detail.message).join(', ')}`);
  }
};

// Esquema de validação para procedimentos
const procedimentoSchema =           Joi.object({
    cd_procedimentos:                Joi.string().max(20).required(),
    ds_procedimentos:                Joi.string().max(50).required(),
    ds_tipo_procedimentos:           Joi.string().length(3).valid('mat', 'med', 'tax', 'pro', 'exa', 'ser').required(),
    vl_procedimentos:                Joi.number().precision(2).positive().required(),
    vl_procedimentos_coparticipacao: Joi.number().precision(2).positive().required(),
    pc_procedimentos_coparticipacao: Joi.number().integer().min(0).max(100).required(),
});
// Função para validar os dados dos procedimentos
const validateProcedimento = (data) => {
  const { error } = procedimentoSchema.validate(data);
  if (error) {
    throw new Error(`Erro de validação: ${error.details.map(detail => detail.message).join(', ')}`);
  }
};

// Esquema de validação para títulos de beneficiário
const tituloBeneficiarioSchema =    Joi.object({
  id_beneficiario:                  Joi.number().integer().positive().required(),
  dt_vencimento:                    Joi.date().iso().required(),
  vl_total_procedimentos:           Joi.number().precision(2).positive().required(),
  vl_coparticipacao:                Joi.number().precision(2).positive().required(),
  vl_mensalidade:                   Joi.number().precision(2).positive().required(),
  dt_pagamento:                     Joi.date().iso().optional().allow(null),
  status_pagamento:                 Joi.string().valid('Pendente', 'Pago', 'Atrasado').default('Pendente'),
  tipo_documento:                   Joi.string().valid('Boleto', 'Fatura').default('Boleto'),
  
  irpf_deducao:                     Joi.string().valid('SIM', 'NAO').default('SIM')
});

// Função para validar os dados do título de beneficiário
const validateTituloBeneficiario = (data) => {
  const { error } = tituloBeneficiarioSchema.validate(data);
  if (error) {
    throw new Error(`Erro de validação: ${error.details.map(detail => detail.message).join(', ')}`);
  }
};

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  // Include fields that can be updated
});

const deleteSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  // Include other fields if necessary
});

module.exports = {   idSchema,  updateSchema,  deleteSchema ,validateAgendamento, validateBeneficiario, validateProcedimento, validateTituloBeneficiario };
