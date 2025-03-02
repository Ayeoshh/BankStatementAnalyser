const {DataTypes} = require('sequelize');
const sequelize = require('../../../config/database');
const UserDetails = require('./userDetailsModel');

const TransactionHistory = sequelize.define('TransactionHistory', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    chqNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    particulars: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    debit: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    credit: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    initBr: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

UserDetails.hasMany(TransactionHistory, {foreignKey: 'customerId', onDelete: 'CASCADE'});
TransactionHistory.belongsTo(UserDetails, {foreignKey: 'custormerId'});

module.exports = TransactionHistory;