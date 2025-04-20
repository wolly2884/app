const connection = require('../Conexao/database');

function execSQLQuery(data, res, table) {
    // Valida se o ID é válido
    if (!data.id || isNaN(data.id)) {
        console.error('ID inválido:', data);
        if (res) {
            res.status(400).json({ error: 'ID inválido' });
        }
        return;
    }

    // Lista para armazenar os campos e valores
    const setFields = [];
    const values = [];
    let nval = 1; // Contador de parâmetros para o prepared statement

    // Itera sobre os campos do objeto data
    for (const key in data) {
        if (key !== 'id') { // Ignora o campo ID
            setFields.push(`${key} = $${nval}`);
            values.push(data[key]); // Adiciona o valor à lista de valores
            nval++; // Incrementa o contador de parâmetros
        }
    }

    // Se não houver campos para atualizar, retorna erro
    if (setFields.length === 0) {
        console.error('Nenhum campo válido para atualizar');
        if (res) {
            res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
        }
        return;
    }

    // Adiciona o ID na lista de valores como o último parâmetro
    values.push(data.id);

    // Monta a query SQL dinamicamente
    const sqlQuery = `UPDATE ${table} SET ${setFields.join(', ')} WHERE id = $${nval}`;

    console.log('SQL Query:', sqlQuery);
    console.log('Valores:', values);

    // Executa a consulta SQL no banco de dados
    connection.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar os dados no banco de dados:', err);
            if (res) {
                res.status(500).json({ error: 'Erro ao atualizar os dados no banco de dados' });
            }
            return;
        }

        // Verifica se alguma linha foi afetada
        if (result.rowCount === 0) {
            console.warn(`Nenhum registro encontrado para o ID ${data.id}`);
            if (res) {
                res.status(404).json({ error: 'Registro não encontrado' });
            }
            return;
        }

        console.log(`Dados atualizados com sucesso para o ID ${data.id}`);
        if (res) {
            res.json({ success: true, affectedRows: result.rowCount });
        }
    });
}

module.exports = { execSQLQuery };
