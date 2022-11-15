module.exports = (sequelize, DataTypes) => {
  const Admin_scheme = sequelize.define("Admin_Role", {
    sapId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Admin_scheme;
};
