import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      },
  });

  export default db;

  // client: 'pg',
  //   connection: {
  //     host : '127.0.0.1',
  //     user : 'postgres',
  //     password : 'postgres',
  //     database : 'farmer-survey'  
  //   }