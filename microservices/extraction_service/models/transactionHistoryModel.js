const {DataTypes} = require('sequelize');
const sequelize = require('../../../config/database');
const UserDetails = require('./userDetailsModel');
const moment = require('moment'); 

const TransactionHistory = sequelize.define('TransactionHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tranDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        set(value) {
            // Convert any date format to ISO (YYYY-MM-DD)
            if (value) {
                const formattedDate = moment(value, [
                    "DD-MM-YYYY",
                    "MM-DD-YYYY",
                    "YYYY/MM/DD",
                    "DD/MM/YYYY",
                    "MM/DD/YYYY",
                    "YYYY-MM-DD"
                ], true).format("YYYY-MM-DD");

                if (!formattedDate || formattedDate === "Invalid date") {
                    throw new Error(`Invalid date format: ${value}`);
                }

                this.setDataValue('tranDate', formattedDate);
            }
        }
    },
    chqNo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    particulars: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    debit: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    credit: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'transaction_history',
    timestamps: false
});

// Define foreign key relationship
TransactionHistory.belongsTo(UserDetails, { foreignKey: 'customerId', targetKey: 'customerId' });
UserDetails.hasMany(TransactionHistory, { foreignKey: 'customerId', sourceKey: 'customerId', onDelete: 'CASCADE'});

sequelize.sync({ force: false }) // Use force: true to drop and recreate tables (Be Careful!)
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch(error => {
    console.error("Error syncing database:", error);
  });


module.exports = TransactionHistory;