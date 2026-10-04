const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const startScheduler = require('./services/scheduler');

const app = express();

connectDB();
startScheduler();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'ContentHub Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
