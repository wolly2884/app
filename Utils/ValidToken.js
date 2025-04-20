const jwt = require('jsonwebtoken');
const connection = require('../Conexao/database');

// Middleware para validar o token JWT
const ValidToken = (req, res, next) => {
  // Obtém o token dos headers
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  // Remove o prefixo 'Bearer ' se presente
  const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  // (Atenção: Evite logar informações sensíveis em produção)
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('Token recebido:', actualToken);

  // Usa a chave secreta definida na variável de ambiente ou um valor padrão
  const secretKey = process.env.JWT_SECRET || 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  // Verifica o token
  jwt.verify(actualToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Supõe que o token contenha o ID do usuário
    const userId = decoded.id;

    // Consulta a tabela 'Token' para verificar se o usuário existe e não foi excluído logicamente
    const query = `SELECT * FROM Token WHERE id = $1 AND d_e_l_e_t_ <> '*'`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
      }

      if (!results || !results.rows || results.rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado ou excluído' });
      }

      const tokenData = results.rows[0];

      // Verifica se o token está expirado comparando a data armazenada no banco com a data atual
      const currentDate = new Date();
      const tokenExpirationDate = new Date(tokenData.dt_valid);
      if (tokenExpirationDate < currentDate) {
        return res.status(403).json({ error: 'Token expirado' });
      }

      // Verifica se o usuário (nome) decodificado corresponde ao registro encontrado
      if (decoded.name !== tokenData.nm_user) {
        return res.status(403).json({ error: 'Você não tem as permissões necessárias para acessar a página' });
      }

      // Se tudo estiver OK, adiciona os dados decodificados à requisição e chama o próximo middleware
      req.user = decoded;
      next();
    });
  });
};

module.exports = { ValidToken };
