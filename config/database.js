import knex from 'knex';

const db = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'admin',
      database : 'farmer-survey'
    }
  });

  export default db;