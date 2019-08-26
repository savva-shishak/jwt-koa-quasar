import test from "ava"

import agent from "supertest-koa-agent"
import appServer from "../src/index"

/**
 * перед каждым тестом, будут регистрироваться по 2 пользователя
 */
test.beforeEach(async t => {
  const app = agent(await appServer())

  const newUser = { login: "login5", password: "654321", name: "name" }
  const newUser2 = { login: "login2", password: "123456", name: "name" }

  await app.post("/users/sigin").send(newUser)
  await app.post("/users/sigin").send(newUser2)

  const newContext = {
    ...t.context,

    // переменные, которые будут использоваться во всех тестах
    app,
    newUser,
    newUser2
  }

  t.context = newContext
})

// ТЕСТЫ

/**
 * правильный логин и пароль
 */
test("При правильном логировании, пользоватеь получает новые токены", async t => {
  const { newUser: { login, password }, app } = t.context

  const tokens = await app.post("/auth/login").send({ login, password })

  t.is(tokens.status, 200)
  t.truthy(typeof tokens.body.token        === "string")
  t.truthy(typeof tokens.body.refreshToken === "string")
})

/**
 * не правильный логин,
 */
test("Ошибка 404, если пользователь логируется с не существующим логином", async t => {
  const { newUser: { password }, app } = t.context

  const request = await app.post("/auth/login").send({ login: "не правильный логин", password })

  t.is(request.status, 404)
})

/**
 * не правильный пароль
 */
test("Ошибка 403, если пользователь логируется с не правильным паролем", async t => {
  const { newUser: { login }, app } = t.context

  const request = await app.post("/auth/login").send({ login, password: "не првильный пароль" })

  t.is(request.status, 403)
})

/**
 * не указаны логин или пароль
 */
test("Ошибка 406, если пользователь логируется не указав логин или пароль", async t => {
  const { newUser: { login, password }, app } = t.context

  const request1 = await app.post("/auth/login").send({ login })
  const request2 = await app.post("/auth/login").send({ password })

  t.is(request1.status, 406)
  t.is(request2.status, 406)
})

/**
 * 2 устройства
 */
test("Пользователь может залогиниться с разных мест", async t => {
  const { newUser: { login, password }, app } = t.context

  const request1 = await app.post("/auth/login").send({ login, password })
  const request2 = await app.post("/auth/login").send({ login, password })

  t.is(request1.status, 200)
  t.is(request2.status, 200)
})