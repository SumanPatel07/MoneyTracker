const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/budget.controller');

router.get('/', ctrl.getItems);
router.post('/', ctrl.createItem);
router.put('/:id', ctrl.updateItem);
router.delete('/:id', ctrl.deleteItem);

module.exports = router;
