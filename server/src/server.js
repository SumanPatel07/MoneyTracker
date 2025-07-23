require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const budgetRoutes = require('./routes/budget.routes');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/items', budgetRoutes);

// Connect DB & start
const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
});