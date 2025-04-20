const connection = require('../Conexao/database');

function execSQLQuery(data, res, table) {
  // Verifica se foi fornecido um ID válido
  if (!data.id || isNaN(data.id)) {
    console.error('ID inválido:', data.id);
    if (res) {
      res.status(400).json({ error: 'ID inválido' });
    }
    return;
  }

  // Constrói a consulta SQL usando prepared statements para prevenir SQL Injection
  // Atualiza a coluna D_E_L_E_T_ para '*' indicando exclusão lógica, com o id passado como parâmetro
  const sqlQuery = `UPDATE ${table} SET D_E_L_E_T_ = '*' WHERE id = $1`;
  console.log('SQL Query:', sqlQuery);

  // Executa a query com o id fornecido
  connection.query(sqlQuery, [data.id], (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      if (res) {
        return res.status(500).json({ error: 'Erro ao executar a consulta SQL' });
      }
      return;
    }
    console.log('Consulta SQL executada com sucesso:', results);
    if (res) {
      res.json(results);
    }
  });
}

module.exports = { execSQLQuery };