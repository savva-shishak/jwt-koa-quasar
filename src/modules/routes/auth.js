import koaBody from "koa-body"

import Router from "koa-router"
const router = new Router()

import { Token, newToken } from "../../service/db/refresh.token"
import { User } from "../../service/db/users"

/**
 * логирование, 
 * получает логин и пароль 
 * 
 * если не указаны логин или пароль, статус 406
 * 
 * находит пользователя по логину
 * 
 * если такого нет, статус 404,
 * если пользователь найден, но у него другой пароль, статус 400
 * 
 * если всё хорошо, статус 200, регистрируется новый refresh токен и возвращается вместе с access токеном
 */
router.post("/login", koaBody(), async ctx => {
  const userAuth = ctx.request.body

  if (!userAuth.login || !userAuth.password) {
    ctx.status = 406
    return;
  }

  const checkLogin = await User.findOne({ where: { login: userAuth.login }})

  if (!checkLogin) {
    ctx.status = 404
    return;
  }

  if (userAuth.password != checkLogin.password) {
    ctx.status = 403
    return; 
  }

  ctx.status = 200
  ctx.body   = await newToken(userAuth.login)
})

/**
 * 1-й логаут
 */
router.post("/logout", koaBody(), async ctx => {
  
  const { login, refreshToken } = ctx.request.body

  const checkRefresh = await Token.findOne({where: { refreshToken }})

  if (!checkRefresh) {
    ctx.status = 404
    return;
  }

  if (checkRefresh.login != login) {
    ctx.status = 403
    return;
  }

  await Token.destroy({where: { refreshToken }})
  ctx.status = 200
})

/**
 * 2-й логаут
 */
router.post("/logout/all", koaBody(), async ctx => {
  
  const { login } = ctx.request.body

  await Token.destroy({where: { login }})
  ctx.status = 200
})

/**
 * получение нового refresh токена
 */
router.post("/refresh", koaBody(), async ctx => {
  const {login, refreshToken} = ctx.request.body

  const checkRefresh = await Token.findOne({where: { refreshToken }})

  if (!checkRefresh) {
    ctx.status = 404
    return;
  }

  if (checkRefresh.login != login) {
    ctx.status = 403
    return;
  }

  await Token.destroy({where: { refreshToken }})

  ctx.body = await newToken(login) 
})

module.exports = router