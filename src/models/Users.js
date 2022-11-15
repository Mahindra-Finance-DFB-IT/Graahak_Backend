const sequelize = require("../core/Db");
const { Sequelize,DataTypes } = require('sequelize');

const Users = sequelize.define('Users', {
    id: {
        field: "id",
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username:{
      field: "username",
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "username_unique"
    },
    firstName: {
      field: "first_name",
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      field: "last_name",
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    loginType:{
        field: "login_type",
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastOtpSent:{
      field: "last_otp_sent",
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    lastLoginAt:{
      field: "last_login_at",
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    token:{
        field: "token",
        type: DataTypes.STRING(100),
        allowNull: false,
        unique:"token_unique"
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored:true,
 });

 module.exports = Users;