require('dotenv').config();

const connectDB = require('./config/db');
const buildApp = require('./app');

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();

  const app = buildApp();
  app.listen(PORT, () => {
    console.log(`Task Manager API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
