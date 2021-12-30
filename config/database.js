import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
      client: 'pg',
      connection: {
        host : process.env.DB_HOST || '127.0.0.1',
        user : process.env.DB_USER || 'postgres',
        password : process.env.DB_PASS || 'postgres',
        database : process.env.DB_NAME || 'farmer-survey'
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