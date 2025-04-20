const express = require('express');
const router = express.Router();
const { ValidToken } = require('../Utils/ValidToken');

router.get('/', ValidToken, (req, res) => {
    res.json({ message: 'Você acessou uma rota protegida!' });
});

module.exports = router;
