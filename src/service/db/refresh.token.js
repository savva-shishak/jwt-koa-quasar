import { Sequelize, db } from "./db"
import jwt from "jsonwebtoken"
import uuid from "uuid/v4"
import config from "../../config"

const Token = db.define("refreshToken", {
  refreshToken: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },

  login: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

/**
 * регистрация нового рефреш токена,
 * возвращает случайно сгенерированный refresh токен и access токен
 * 
 * @param {String} login
 */
async function newToken(login) {
 
  const newToken = { login, refreshToken: uuid() }

  await Token.create(newToken).then(res => res.refreshToken)

  return {
    token:        jwt.sign({ login }, config.secret),
    refreshToken: newToken.refreshToken
  }
}

module.exports = {
  Token,
  newToken
}