import { resolve } from "path";
import koa from"koa"

import { db } from "./service/db/db"
import router from"./modules/routes/index"
import serve from "koa-static"

async function createApp(){
  const app = new koa()

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(resolve(__dirname, "spa")))
  
  
  await db
    .sync()
    .catch(err => console.log("Ошибка при подключении к базе данных: " + err))

  return app
}

module.exports = createApp