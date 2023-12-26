const express = require('express');
const router = express.Router();

const tx = require('../controllers/tx.controller');

router.post('/deposit', tx.DepositPool);
router.post('/claim', tx.providePayback);
router.post('/test', tx.test);

module.exports = router;
