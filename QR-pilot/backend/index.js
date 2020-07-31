const Koa = require('koa');
const Router = require('koa-router');
const routes = require("./src/routes/routes");
const bodyParser = require('koa-bodyparser');
const {passport} = require("./src/models/user");
const database = require("./src/database/mongooseDatabase");
const app = new Koa();
const cors = require('@koa/cors');
const router = new Router();
const config = require("./config");

database.connection.on('error', console.error);

app.use(bodyParser());
app.use(cors());
app.use(passport.initialize());

routes({router});

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(config.node_port, () => {
    console.log(`Server listening on port:`);
});

module.exports = server;
