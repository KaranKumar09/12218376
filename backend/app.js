const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const logger = require('./middlewares/logger');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(logger);
app.use('/', urlRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected Successfully"))
  .catch(err => console.error("MongoDB error", err));

module.exports = app;
