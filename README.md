## Перед началом
Проект использует СУБД PostgreSQL - и перед началом надо создать базу данных app_db, роль appsadmin с паролем 123456, либо поменять настройки конфигурации БД в файле scr/servise/DB.config.js на те, которые вам необходимы

#### Устанока зависимостей:
npm i 

#### Запуск
npm start

#### Тестирование
npm test

## О проекте

Это проект - шаблон JWT. Т.е. это приложение использует полноценную рабочую поддержку JWT токенов

## Бэкэнд

Бэкэнд может показаться запутанным, файл start.js, файл index.js. На самом деле, такая система показалась мне удобной для тестирования. Сам сервер ничего нового из себя не представляет. БД PostgreSQL, для JWT jsonwebtoken и koa-jwt, тесты: ava, supertest-koa-agent.
Для генерации аскцесс токенов используется jsonwebtoken, для рефреш токенов - генератор уникальных строк uuid.

## Фронтенд - самое интересное

Мне нравится, при отправке http запросов, использовать библиотеку axios. Axios - это очень мощный инструмент, который позволяет себя дополнять (axios.create()) и тестировать (библиотека axios-mock-adapter)
Я решил не брезгать тем что мне предлагает эта вещь и расширил её (src/store/modules_example/servises/jwt/client).

### Класс client
Этот класс, в котором определены поля: client, token, refreshToken, login и refreshRequest.
Поле client - ключевое поле, это тотже объект axios, то есть мы можем пользоваться им как библиотекой axios, client.get("url"), client.post("url")). Но в нём переопределены интерцепторы, то есть при каждом запросе, в шапку добавляется свойство Authorization со значением "Bearer " + переменная token. 
Так же при получении статуса ошибки запроса 401 - client автоматически делает запрос на получение новых токенов используя refreshToken и login.

Получается мы пользуемся переменной client также как axios, но теперь не задумываемся, об токенах как в Angular 2+

