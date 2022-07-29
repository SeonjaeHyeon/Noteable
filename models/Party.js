const Sequelize = require("sequelize");

module.exports = class Party extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        todoId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        partyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Party",
        tableName: "party",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Party.belongsTo(db.Todo, {
      foreignKey: "todoId",
      targetKey: "id",
    });
    db.Party.belongsTo(db.User, {
      foreignKey: "partyId",
      targetKey: "id",
    });
  }
};
