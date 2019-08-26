import test from "ava"

import agent from "supertest-koa-agent"
import appServer from "../src/index"

import issueToken from "./issueToken"

/**
 * перед каждым тестом, будет пользователь
 */
test.beforeEach(async t => {
  const app = agent(await appServer())

  const User = { login: "login", password: "654321", name: "name" }
  
  const tokensOfDevise1 = await app.post("/users/sigin").send(User)
  const tokensOfDevise2 = await app.post("/auth/login").send(User)

  const newContext = {
    ...t.context,

    // переменные, которые будут использоваться в тестах
    app,
    User,
    tokensOfDevise1: tokensOfDevise1.body,
    tokensOfDevise2: tokensOfDevise2.body
  }
  
  t.context = newContext
})

/**
 * логаут с одно устройства
 */
test("При логауте пользователя с 1 устройства, только 1 соответствующий refresh токен становится не валидным", async t => {
  const { User: { login }, tokensOfDevise1: { refreshToken, token }, tokensOfDevise2, app } = t.context

  const REQUEST_WITH_DEVISE_1 = {
    refreshToken, 
    login
  }

  const REQUEST_WITH_DEVISE_2 = {
    refreshToken: tokensOfDevise2.refreshToken,
    login
  }

  await app.post("/auth/logout").send(REQUEST_WITH_DEVISE_1)

  const request1 = await app.post("/auth/refresh").send(REQUEST_WITH_DEVISE_1)
  const request2 = await app.post("/auth/refresh").send(REQUEST_WITH_DEVISE_2)

  t.is(request1.status, 404)
  t.is(request2.status, 200)
})

/**
 * логаут со всех устройств
 */
test("Полном логауте, все refresh токены пользователя удаляются", async t => {
  const { User: { login }, tokensOfDevise1: { refreshToken, token }, tokensOfDevise2, app } = t.context
})