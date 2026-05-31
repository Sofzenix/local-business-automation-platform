import dotenv from 'dotenv';
import app from './app.js';
import connectToDB from './config/mongo.config.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDB();//connecting to mongoDB

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();