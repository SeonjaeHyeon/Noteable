const Sequelize = require("sequelize");

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        followingId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Follow",
        tableName: "follow",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Follow.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
    db.Follow.belongsTo(db.User, {
      foreignKey: "followingId",
      targetKey: "id",
    });
  }
};
