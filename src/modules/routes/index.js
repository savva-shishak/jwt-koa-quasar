import Router from "koa-router"
import auth from "./auth"
import users from "./users"
import sigin from "./sigin"

import jwtMiddleware from "koa-jwt"
import config from "../../config"

import jwt from "jsonwebtoken"

const router = new Router()

router.use("/auth", auth.routes())
router.use("/sigin", sigin.routes())

router.use(jwtMiddleware({
    secret: config.secret
}))
router.use("/users", users.routes())

module.exports = router