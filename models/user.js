module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define("user", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    userType: {
      type: DataTypes.ENUM,
      values: ["a", "u"],
      defaultValue: "u",
      comment: "a - Admin, u - User",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: "0",
      comment: "0 - No, 1 - Verified",
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    mobileVerified: {
      type: DataTypes.ENUM,
      values: ["0", "1"],
      defaultValue: "0",
      comment: "0 - No, 1 - Verified",
    },

    tenureId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["a", "i", "d"],
      defaultValue: "a",
      comment: "a - Active, i - Inactive, d - Deleted",
    },

    createdAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

 

  return user;
};
