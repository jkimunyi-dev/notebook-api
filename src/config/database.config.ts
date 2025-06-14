import { Pool } from 'pg';

export const databaseConfig = {
  connectionString: 'postgresql://demodb_owner:npg_8WsIJV1zLwdD@ep-damp-sea-a8qnzghk-pooler.eastus2.azure.neon.tech/demodb?sslmode=require',
  ssl: {
    rejectUnauthorized: false,
  },
};

export const pool = new Pool(databaseConfig);