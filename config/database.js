const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(     
    process.env.DB_DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
    }
);

// sequelize.authenticate()
//     .then(()=>{console.log('Connection has been established successfully.');})  
//     .catch(error => {console.error('Database connection failed', error)});
// Test the connection
(async () => {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to PostgreSQL:', error);
    }
  })();

module.exports = sequelize;
