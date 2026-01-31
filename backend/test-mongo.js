const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI not set in backend/.env');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(uri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });
