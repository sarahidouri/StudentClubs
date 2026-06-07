import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/studentclubs';

const normalizeMongoUri = (uri) => {
  const [base, query] = uri.split('?');
  const parts = base.split('/');

  if (parts.length >= 4) {
    parts[3] = 'studentclubs';
  } else if (parts.length === 3) {
    parts.push('studentclubs');
  }

  return `${parts.join('/')}${query ? `?${query}` : ''}`;
};

dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = DEFAULT_MONGODB_URI;
  console.log(`INFO: MONGODB_URI not set, defaulting to ${process.env.MONGODB_URI}`);
} else if (!process.env.MONGODB_URI.includes('/studentclubs')) {
  console.warn(
    `WARNING: MONGODB_URI contained a different database name; overriding to studentclubs. Original: ${process.env.MONGODB_URI}`
  );
  process.env.MONGODB_URI = normalizeMongoUri(process.env.MONGODB_URI);
  console.log(`INFO: Normalized MONGODB_URI to ${process.env.MONGODB_URI}`);
}

console.log('DEBUG: Environment variables loaded. JWT_SECRET is', process.env.JWT_SECRET ? 'PRESENT' : 'MISSING');

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is missing!');
  process.exit(1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error('❌ FATAL ERROR: JWT_REFRESH_SECRET is missing!');
  process.exit(1);
}
