const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const Sessions = sequelize.define('Sessions', {
    Username: {
        field:"username",
        type: Sequelize.CHAR(200),
        primaryKey: true
    },
    Token: {
        field:"token",
        type: Sequelize.TEXT,
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
    tableName: 'sessions',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
});

module.exports = Sessions;