const { DataTypes } = require("sequelize");

const db = require('./db');

const timesheet = db.sequelize.define("timesheet", {
    TIPO: DataTypes.TEXT,
    RECURSO: DataTypes.TEXT,
});

//usuarios.sync({ force: true })

module.exports = timesheet;