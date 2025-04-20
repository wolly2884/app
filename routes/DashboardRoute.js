// routes/DashboardRoute.js
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Importando o pool de conexão com o banco de dados

router.get('/', async (req, res) => {
  try {
    const totalBeneficiariosResult = await pool.query(`
      SELECT COUNT(*) FROM Beneficiarios WHERE d_e_l_e_t_ = ' '
    `);
    const totalAtendimentosResult = await pool.query(`
      SELECT COUNT(*) FROM Atendimentos WHERE d_e_l_e_t_ = ' '
    `);
    const topProcedimentosResult = await pool.query(`
      SELECT ds_procedimentos, COUNT(*) AS total 
      FROM Procedimentos 
      GROUP BY ds_procedimentos 
      ORDER BY total DESC 
      LIMIT 5
    `);
    const mediaValoresResult = await pool.query(`
      SELECT AVG(vl_procedimentos) AS media_valor 
      FROM Procedimentos
    `);

    res.json({
      totalBeneficiarios: totalBeneficiariosResult.rows[0].count,
      totalAtendimentos: totalAtendimentosResult.rows[0].count,
      topProcedimentos: topProcedimentosResult.rows,
      mediaValorProcedimentos: parseFloat(mediaValoresResult.rows[0].media_valor)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
