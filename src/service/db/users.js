import { Sequelize, db } from "./db"

const User = db.define("user", {
 login: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = {
  User
}

