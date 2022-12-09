const sequelize = require("../core/Db");
const { Sequelize, DataTypes } = require('sequelize');

const UserLogs = sequelize.define('UserLogs', {
    Id: {
        field: "id",
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Username: {
        field:"username",
        type: Sequelize.STRING(200),
        allowNull: true
    },
    Role: {
        field:"role", // se, admin, sm/rsm
        type: Sequelize.STRING(200),
        allowNull: true
    },
    ApiName: {
        field:"api_name",
        type: Sequelize.STRING(200),
        allowNull: true
    },
    CreatedAt:{
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW()
    },
    UpdatedAt:{
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true
    } 
},{
    tableName: 'user_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
});

module.exports = UserLogs;