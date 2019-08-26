import createApp from "./src/index"
import config from"./src/config"

let app;

async function start() {
  app = await createApp()

  app.listen(config.port, () => {
      console.log("Сервер начал прослушку запросов по адресу: http://localhost:" + config.port); 
  })
}

start()