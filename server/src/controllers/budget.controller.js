const BudgetItem = require('../models/BudgetItem');

//GET all
exports.getItems = async (req, res) => {
    try {
        const userId = req.query.userId || 'default';
        const items = await BudgetItem.find({userId}).sort({ timestamp: -1});
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch items.'});
    }
};

//POST create
exports.createItem = async (req, res) => {
    try {
        const userId = req.body.userId || 'default';
        const item = await BudgetItem.create({ ...req.body, userId });
        res.status(201).json(item);
    }
    catch (err)
    {
        res.status(400).json({ error: 'Filed to create item.'});
    }
};

//PUT Update
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await BudgetItem.findByIdAndUpdate(id, req.body, { new: true});
        if (!updated) return res.status(404).json({ error: 'Not found'});
        res.json(updated); 
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update item'});
    }
};

//DELETE
exports.deleteItem = async (req, res) => {
    try {
        const {id} = req.params;
        await BudgetItem.findByIdAndDelete(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete item.'});
    }
};