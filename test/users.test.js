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

  await app.post("/users/sigin").set('Authorization', issueToken(newUser.login)).send(newUser)
  await app.post("/users/sigin").set('Authorization', issueToken(newUser2.login)).send(newUser2)

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
 * публичная информация о всех пользователях
 */
test("Мы можем получить только публичную информацию о всех пользователях", async t => {
  const { newUser, app } = t.context

  const request = await app.get("/users").set('Authorization', issueToken(newUser.login))

  t.is(request.status, 200)
  t.is(request.body.users.length, 2)
  t.is(request.body.users[0].password) // в объекте нет пароля пользователя
})

/**
 * информация о пользователе по его логину
 */
test("Мы можем получить только публичную информацию о пользователе, по его логину", async t => {
  const { newUser2, newUser: {name, login}, app } = t.context

  const request = await app.get("/users/" + login).set('Authorization', issueToken(newUser2.login))

  t.is(request.status, 200)
  t.is(request.body.name, name)
  t.is(request.body.password) // в объекте нет пароля пользователя
})

/**
 * не правильный логин
 */
test("Мы не можем получить публичную информацию о пользователе, без логина", async t => {
  const { newUser2, app } = t.context

  const request = await app.get("/users/" + "не существующий логин").set('Authorization', issueToken(newUser2.login))

  t.is(request.status, 404)
  t.is(request.body.name)
})

/**
 * свой токен
 */
test("пользователь может получить всю информацию о себе если использует свой токен", async t => {
  const { newUser, app } = t.context

  const request = await app.get("/users/" + newUser.login).set('Authorization', issueToken(newUser.login))

  t.is(request.status, 200)
  t.is(request.body.name,     newUser.name)
  t.is(request.body.password, newUser.password) // - в объекте есть пароль
})