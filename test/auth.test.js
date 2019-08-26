import test from "ava"

import agent from "supertest-koa-agent"
import appServer from "../src/index"

import issueToken from "./issueToken"


/**
 * перед каждым тестом, будут регистрироваться по 2 пользователя
 */
test.beforeEach(async t => {
  const app = agent(await appServer())

  const newUser = { login: "login1", password: "654321", name: "John" }
  const newUser2 = { login: "login2", password: "123456", name: "Bob" }

  const tokensUser1 = await app.post("/users/sigin").send(newUser)
  await app.post("/users/sigin").send(newUser2)

  const newContext = {
    ...t.context,

    // переменные, которые будут использоваться в тестах
    app,
    newUser,
    newUser2,
    tokensUser1: tokensUser1.body
  }

  t.context = newContext
})

// ТЕСТЫ


/**
 * протухший токен
 */
test("Мы получим 401 если токен протух или его нет вовсе", async t => {
  const { newUser: { login }, app } = t.context

  const request1 = await app.get("/users/" + login).set('Authorization', issueToken(login, "1ms"))
  const request2 = await app.get("/users/" + login)

  t.is(request1.status, 401)
  t.is(request2.status, 401)
})

/**
 * получение refresh токена
 */
test("При отправки refresh токена, мы получим новые токены", async t => {
  const { tokensUser1: { refreshToken }, newUser: { login }, app } = t.context

  let request = await app.post("/auth/refresh").send({refreshToken, login})

  t.is(request.status, 200)
  t.truthy(typeof request.body.token        === "string")
  t.truthy(typeof request.body.refreshToken === "string")
})

/**
 * некоррекный токен
 */
test("мы не можем воспользоваться старым или чужим refresh токеном", async t => {
  const { tokensUser1: { refreshToken }, newUser: { login }, app } = t.context

  const request1 = await app.post("/auth/refresh").send({refreshToken, login})
  const request2 = await app.post("/auth/refresh").send({refreshToken, login})
  const request3 = await app.post("/auth/refresh").send({refreshToken: "чужой refresh токен", login})

  t.is(request1.status, 200)
  t.is(request2.status, 404)
  t.is(request3.status, 404)
})

/**
 * чужой логин
 */
test("мы не можем получить новые токены, используя не свой логин", async t => {
  const { tokensUser1: { refreshToken }, newUser: { login }, app } = t.context

  const request1 = await app.post("/auth/refresh").send({refreshToken, login: "чужой логин"})

  t.is(request1.status, 403)
})