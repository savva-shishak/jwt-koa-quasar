import koaBody from "koa-body"

import jwt from "jsonwebtoken"

import Router from "koa-router"
const router = new Router()

import { User } from "../../service/db/users"

/**
 *публичная информация о всех пользвателях
 */
router.get("/", async ctx => {
  const usersAll = await User.findAll({ where: {}, raw: true})

  const users = []

  for (let i = 0; i < usersAll.length; i++) {
    users.push({ name: usersAll[i].name, login: usersAll[i].login})
  }

  ctx.body = {users}
})

/**
 * информация о пользователе
 */
router.get("/:login", async ctx => {
  const searchLogin = ctx.params.login

  const searchUser = await User.findOne({ where: { login: searchLogin }})

  if (!searchUser) {
    ctx.status = 404
    return;
  }

  const { authorization } = ctx.header
  const token = authorization.slice(7)

  let tokenLogin = jwt.decode(token)
  tokenLogin = tokenLogin.login
  
  let userData = {
    name:  searchUser.name,
    login: searchUser.login
  }

  if (tokenLogin == searchLogin) {
    userData.password = searchUser.password
  }

  ctx.body = userData
})

module.exports = router