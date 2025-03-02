const {DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const UserDetails = sequelize.define('UserDetails',{
    CustomerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    ifscCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    panNo: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timeStamps: true,
});

module.exports = UserDetails;
