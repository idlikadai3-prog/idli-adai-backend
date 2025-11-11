import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Support multiple common env names
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DB_NAME || process.env.DATABASE_NAME || 'koththu_shop';

const buildConnectionString = () => {
  // If provided a full URI that already contains a db name, use as-is
  if (MONGODB_URI.includes('mongodb://') || MONGODB_URI.includes('mongodb+srv://')) {
    if (MONGODB_URI.match(/mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/)) {
      return MONGODB_URI;
    }
    return MONGODB_URI.endsWith('/') ? `${MONGODB_URI}${DATABASE_NAME}` : `${MONGODB_URI}/${DATABASE_NAME}`;
  }
  return `mongodb://localhost:27017/${DATABASE_NAME}`;
};

export const connectDB = async () => {
  const connectionString = buildConnectionString();
  let attempt = 0;
  const maxAttempts = 3;
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  const maskConnectionString = (uri) => {
    try {
      const url = new URL(uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
      if (url.password) {
        const masked = uri.replace(url.password, '****');
        return masked;
      }
      return uri;
    } catch {
      return uri;
    }
  };

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      console.log(`Connecting to MongoDB (attempt ${attempt}/${maxAttempts}) → ${maskConnectionString(connectionString)}`);
      await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      if (attempt < maxAttempts) {
        const backoff = attempt * 1000;
        console.log(`Retrying in ${backoff}ms...`);
        await delay(backoff);
      } else {
        if (connectionString.includes('mongodb+srv://')) {
          console.error('Check: Atlas cluster status, IP Access List, username/password, SRV DNS.');
        } else {
          console.error('Check: Local mongod running, port 27017, firewall, connection string.');
        }
        throw error;
      }
    }
  }
};

export default mongoose;

