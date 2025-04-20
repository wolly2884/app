const connection = require('../Conexao/database');

async function execSQLQuery(sqlQuery, params, res) {
  console.log('SQL Query:', sqlQuery);
  console.log('Parameters:', params);

  if (!res || typeof res.json !== 'function') {
    console.error('O objeto de resposta não está definido ou não é válido.');
    return;
  }

  try {
    const results = params && params.length > 0 
      ? await connection.query(sqlQuery, params)
      : await connection.query(sqlQuery);
    console.log('Consulta SQL executada com sucesso:', results);
    return res.json(results);
  } catch (err) {
    console.error('Erro ao executar a consulta SQL:', err);
    return res.status(500).json({ error: 'Erro ao executar a consulta SQL' });
  }
}

module.exports = { execSQLQuery };
