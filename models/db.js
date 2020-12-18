const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('METABASE', 'sa', '1fb3c9Ua', {
    host: '192.168.1.80',
    dialect: 'mssql'
});
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}