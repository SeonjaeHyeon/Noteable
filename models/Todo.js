const Sequelize = require("sequelize");

module.exports = class Todo extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        type: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Todo",
        tableName: "todo",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Todo.hasMany(db.Party, { foreignKey: "todoId", sourceKey: "id" });
    db.Todo.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
  }
};
