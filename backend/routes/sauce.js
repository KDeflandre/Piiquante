const express = require('express');
const router = express.Router();

const auth =  require('../middleware/auth');
const sauceCtrl = require('../controllers/sauces');

router.post('/', auth, sauceCtrl.createSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getSauce);
router.get('/:id', auth, sauceCtrl.getSauceId);

module.exports = router;

