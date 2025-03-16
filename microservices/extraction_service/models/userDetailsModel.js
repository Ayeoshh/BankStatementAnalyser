const {DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const UserDetails = sequelize.define('UserDetails', {
    customerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    accountHolder: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jointHolder: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ifscCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    micrCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nomineeRegistered: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    openingBalance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    closingBalance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    transactionTotalDebit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    transactionTotalCredit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    branchAddress: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'user_details',
    timestamps: false
});

sequelize.sync({ force: false }) // Use force: true to drop and recreate tables (Be Careful!)
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch(error => {
    console.error("Error syncing database:", error);
  });

  
module.exports = UserDetails;
