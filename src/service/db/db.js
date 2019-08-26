import Sequelize from "sequelize"
import { DB, role, password } from "../DB.config"

const db = new Sequelize(DB, role, password, {
  host:    "localhost",
  dialect: "postgres",
  logging: false
})

module.exports = {
  Sequelize,
  db
}