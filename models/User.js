const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        authId: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        authPw: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "user",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Memo, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.Todo, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.Follow, { foreignKey: "userId", sourceKey: "id" });
    db.User.hasMany(db.Follow, { foreignKey: "followingId", sourceKey: "id" });
    db.User.hasMany(db.Party, { foreignKey: "partyId", sourceKey: "id" });
  }
};
