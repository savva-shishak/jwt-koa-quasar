import test from "ava"

import agent from "supertest-koa-agent"
import appServer from "../src/index"

test.beforeEach(async t => {
  t.context.app = agent(await appServer())
})

// ТЕСТЫ

/**
 * регистрация
 */
test("При регистрации пользователь получает новые access и refresh токены", async t => {
  const { app } = t.context
  const newUser = { login: "login1", password: "password", name: "name"}
  const sigin = await app.post("/users/sigin").send(newUser)

  t.is(sigin.status, 201)

  t.truthy(typeof sigin.body.token        == "string")
  t.truthy(typeof sigin.body.refreshToken == "string")
})

/**
 * уже существующий логин
 */
test("Пользователь не может зарегистрироваться, если его логин уже существует", async t => {
  const { app } = t.context
  const newUser = { login: "login2", password: "password2", name: "name2"}

                await app.post("/users/sigin").send(newUser)
  const sigin = await app.post("/users/sigin").send(newUser)

  t.is(sigin.status, 406)
})