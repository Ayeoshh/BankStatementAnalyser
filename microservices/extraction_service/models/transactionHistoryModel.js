const {DataTypes} = require('sequelize');
const sequelize = require('../../../config/database');
const UserDetails = require('./userDetailsModel');

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
        allowNull: false
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


module.exports = TransactionHistory;