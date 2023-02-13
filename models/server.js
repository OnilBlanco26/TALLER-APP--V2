const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;

    this.paths = {
      user: "/api/v2/user",
      repairs: "/api/v2/repairs",
    };
  }

  middlewares() {
    //UTILIZAMOS LAS CORS PARA PERMITIR ACCESO A LA API DESDE EL FRONT-END
    this.app.use(cors());
    //UTLIIZAMOS EXPRESS.JSON PARA PARSEAR EL BODY DE LA REQUEST
    this.app.use(express.json());
  }

  routes() {}

  database() {}

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}

module.exports = Server;
