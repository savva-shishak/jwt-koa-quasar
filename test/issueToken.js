import jwt from "jsonwebtoken"
import config from "../src/config"

/**
 * функция генерирует поле access токен по логину
 * и жизнеспособности (по умолчанию 5 мин.)
 */
module.exports = (login, expiresIn = 300) => {
  const Authorization = jwt.sign({ login }, config.secret, { expiresIn })

  return `Bearer ${Authorization}`
}