import koaBody from "koa-body"

import Router from "koa-router"
const router = new Router()

import { User } from "../../service/db/users"
import { newToken } from "../../service/db/refresh.token"

/**
 * регистрация нового пользователя
 */
router.post("/", koaBody(), async ctx => {
  const newUser = ctx.request.body

  await 
  User
    .create(newUser)
    .then (res => { ctx.status = 201 })
    .catch(err => { ctx.status = 406 })

  ctx.body = await newToken(newUser.login)
})

module.exports = router