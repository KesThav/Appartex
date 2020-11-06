const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const Mongoose = require("mongoose");
const router = require("./routes");
const cors = require("@koa/cors");
const json = require("koa-json");
const { koaSwagger } = require("koa2-swagger-ui");
const Swagger = require("./middlewares/swagger");

require("dotenv").config();

const app = new Koa();

const mongooseOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
// Connect to the MongoDB database
Mongoose.connect(process.env.DB_ONLINE, mongooseOptions, () =>
  console.log("connected")
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:
        "Appartex : Une application de gestion pour propriétaire indépendant",
      version: "1.0.0",
      description:
        "Dans le contexte de mon travail de bachelor, j'ai développé une web app pour propriétaire indépendant afin qu'il puisse gérer leurs immeubles/appartements/locataires,... sans passer par une régie",
    },
  },

  apis: [
    "./routes/auth.js",
    "./routes/tenants.js",
    "./routes/buildings.js",
    "./routes/appartments.js",
    "./routes/contracts.js",
    "./routes/bills.js",
    "./routes/status.js",
    "./routes/billstatus.js",
    "./routes/messages.js",
  ],

  path: "/swagger.json",
};

const swagger = Swagger(swaggerOptions);

const swaggerUi = koaSwagger({
  routePrefix: "/doc",
  swaggerOptions: {
    url: swaggerOptions.path,
  },
});

const port = process.env.PORT || 5000;
app
  .use(swagger)
  .use(swaggerUi)
  .use(cors())
  .use(bodyParser())
  .use(json())
  .use(router())
  .listen(port, () => console.log(`listen on port ${port}`));
