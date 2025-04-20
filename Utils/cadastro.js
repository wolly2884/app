const connection = require('../Conexao/database');

function execSQLQuery(data, res, table) {
    // Verifica se o array de dados foi fornecido e não está vazio
    if (!Array.isArray(data) || data.length === 0) {
        if (res) {
            res.status(400).json({ error: 'Nenhum dado fornecido' });
        }
        return;
    }

    // Extrai os nomes dos campos a partir do primeiro objeto, ignorando o campo "id"
    const keys = Object.keys(data[0]).filter(key => key !== 'id');
    if (keys.length === 0) {
        if (res) {
            res.status(400).json({ error: 'Nenhum campo válido para inserir' });
        }
        return;
    }
    
    // Monta a lista de colunas
    const columns = `(${keys.join(', ')})`;

    // Monta os placeholders para cada linha e acumula os valores
    const placeholdersArr = [];
    const values = [];
    let placeholderCounter = 1;

    for (const row of data) {
        // Gera os placeholders para a linha atual
        const rowPlaceholders = keys.map(() => `$${placeholderCounter++}`);
        placeholdersArr.push(`(${rowPlaceholders.join(', ')})`);
        // Adiciona os valores correspondentes à linha, na mesma ordem dos campos
        for (const key of keys) {
            values.push(row[key]);
        }
    }

    const placeholders = placeholdersArr.join(', ');

    // Monta a query final
    const sqlQuery = `INSERT INTO ${table} ${columns} VALUES ${placeholders}`;
    console.log('SQL Query:', sqlQuery);
    console.log('Valores:', values);

    // Executa a query utilizando prepared statements
    connection.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados no banco de dados:', err);
            if (res) {
                res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
            }
            return;
        }
        console.log('Dados inseridos com sucesso no banco de dados:', result);
        if (res) {
            res.json({ success: true });
        }
    });
}

module.exports = { execSQLQuery };
