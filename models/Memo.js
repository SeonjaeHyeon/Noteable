const Sequelize = require("sequelize");

module.exports = class Memo extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Memo",
        tableName: "memo",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Memo.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
  }
};
